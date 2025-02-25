import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { isValidStatusTransition } from './order.constant';
import { TOrder } from './order.interface';
import OrderModel from './order.model';
import QueryBuilder from '../Builder/QueryBuilder';
import AppError from '../errors/AppError';
import ProductModel from '../product/product.model';
import { orderUtils } from './order.utils';

const getMeOrderFromDB = async (query: Record<string, unknown>, email: string) => {
    const orders = await OrderModel.find({})
        .populate({ path: "user", match: { email } })
        .populate({ path: "products", populate: { path: "product" } });

    const filteredOrders = orders.filter(order => order.user !== null);

    const orderQuery = new QueryBuilder(
        OrderModel.find({ _id: { $in: filteredOrders.map(order => order._id) } }),
        query
    ).search(["status", "totalPrice"]).filter().sort().paginate().fields();

    return {
        meta: await orderQuery.countTotal(),
        result: await orderQuery.modelQuery,
    };
};

const createOrderIntoDB = async (
    payload: { products: { product: string; quantity: number }[] },
    user: JwtPayload,
    client_ip: string
    
    
) => {
    console.log(user);
    if (!user?.userId) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    if (!payload?.products?.length) throw new AppError(httpStatus.BAD_REQUEST, 'No products in the order');
    
    if (!user.name) throw new AppError(httpStatus.BAD_REQUEST, 'Customer name is required'); // Check for name

    let totalPrice = 0;
    const productIds = payload.products.map(p => p.product);
    const dbProducts = await ProductModel.find({ _id: { $in: productIds } });

    if (dbProducts.length !== payload.products.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'Some products were not found');
    }
    
    const productsWithObjectId = payload.products.map((product) => {
        const dbProduct = dbProducts.find(p => p._id.toString() === product.product);
        if (!dbProduct || dbProduct.isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, `Product with ID ${product.product} is deleted or not found`);
        }
        if (dbProduct.quantity < product.quantity) {
            throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for product with ID ${product.product}`);
        }
        dbProduct.quantity -= product.quantity;
        totalPrice += dbProduct.price * product.quantity;
        return { product: new Types.ObjectId(product.product), quantity: product.quantity };
    });

    await Promise.all(dbProducts.map(product => product.save()));

    const order = await OrderModel.create({
        products: productsWithObjectId,
        user: new Types.ObjectId(user.userId),
        totalPrice,
        status: 'Pending',
    });

    // Log the payment payload for debugging
    console.log("Payment Payload:", {
        amount: totalPrice,
        order_id: order._id,
        currency: "BDT",
        customer_name: user.name, // Ensure name is passed correctly
        customer_address: user.address || "Sylhet",
        customer_email: user.email,
        customer_phone: user.mobile || "01917540405",
        customer_city: user.address || "Sylhet",
        client_ip,
    });

    // Initiate payment and capture the response
    const payment = await orderUtils.makePaymentAsync({
        amount: totalPrice,
        order_id: order._id,
        currency: "BDT",
        customer_name: user.name, // Ensure name is passed correctly
        customer_address: user.address || "Sylhet",
        customer_email: user.email,
        customer_phone: user.mobile || "01917540405",
        customer_city: user.address || "Sylhet",
        client_ip,
    });

    // Log the payment response for debugging
    console.log("Payment Response:", payment);

    // Check if the payment has a transaction status and process it
    if (payment?.transactionStatus) {
        order.transaction = {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
        };
        await order.save();
    }

    // Ensure paymentUrl is returned, otherwise return null
    const paymentUrl = payment?.checkout_url || null;

    // Log paymentUrl for debugging
    console.log("Payment URL:", paymentUrl);

    return {
        success: true,
        message: "Order created successfully",
        data: {
            orderDetails: order,
            paymentUrl, // return the payment URL (null if not present)
        },
    };
};


const deleteOrderFromDB = async (id: string) => {
    const order = await OrderModel.findByIdAndDelete(id);
    if (!order) throw new AppError(httpStatus.NOT_FOUND, 'This Order is not found!');
    return order;
};

const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
    const order = await OrderModel.findById(id).populate('products.product');
    if (!order) throw new AppError(httpStatus.NOT_FOUND, 'This Order is not found!');

    if (payload.status && !isValidStatusTransition(order.status, payload.status)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Invalid status transition from ${order.status} to ${payload.status}`);
    }

    if (payload.products) {
        const productIds = payload.products.map(p => p.product);
        const dbProducts = await ProductModel.find({ _id: { $in: productIds } });

        for (const updatedProduct of payload.products) {
            const existingProduct = order.products.find(p => p.product._id.toString() === updatedProduct.product.toString());
            if (!existingProduct) throw new AppError(httpStatus.NOT_FOUND, 'Product not found in the order!');

            const dbProduct = dbProducts.find(p => p._id.toString() === updatedProduct.product.toString());
            if (!dbProduct) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');

            const quantityDifference = updatedProduct.quantity - existingProduct.quantity;
            if (quantityDifference > 0 && dbProduct.quantity < quantityDifference) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient stock for this product!');
            }

            dbProduct.quantity -= quantityDifference;
            existingProduct.quantity = updatedProduct.quantity;
        }

        await Promise.all(dbProducts.map(product => product.save()));
    }

    payload.totalPrice = order.products.reduce((sum, p) => sum + (p.product.price * p.quantity), 0);

    return await OrderModel.findByIdAndUpdate(id, { ...payload }, { new: true });
};

// Add the verifyPayment function
const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    if (verifiedPayment.length) {
        await OrderModel.findOneAndUpdate(
            { "transaction.id": order_id },
            {
                "transaction.bank_status": verifiedPayment[0].bank_status,
                "transaction.sp_code": verifiedPayment[0].sp_code,
                "transaction.sp_message": verifiedPayment[0].sp_message,
                "transaction.transactionStatus": verifiedPayment[0].transaction_status,
                "transaction.method": verifiedPayment[0].method,
                "transaction.date_time": verifiedPayment[0].date_time,
                status:
                    verifiedPayment[0].bank_status == "Success"
                        ? "Paid"
                        : verifiedPayment[0].bank_status == "Failed"
                            ? "Pending"
                            : verifiedPayment[0].bank_status == "Cancel"
                                ? "Cancelled"
                                : "",
            }
        );
    }

    return verifiedPayment;
};

// Export all functions
export const OrderService = {
    createOrderIntoDB,
    deleteOrderFromDB,
    updateOrderIntoDB,
    getMeOrderFromDB,
    verifyPayment, // Add this to the exports
};