
import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { isValidStatusTransition, OrderSearchableFields } from './order.constant';
import { TOrder } from './order.interface';
import OrderModel from './order.model';
import QueryBuilder from '../Builder/QueryBuilder';
import AppError from '../errors/AppError';
import ProductModel from '../product/product.model';
import { orderUtils } from './order.utils';
import { User } from '../modules/user/user.model';
// import { User } from '../modules/user/user.model';

const createOrderIntoDB = async (
    payload: { products: { product: string; quantity: number }[] },
    user: JwtPayload,
    client_ip: string
) => {
    // Fetch the user from the database
    const cuser = await User.findById(user?.userId);
    if (!cuser || !cuser.name || !cuser.email) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User name and email are required');
    }
    
    const { name, email } = cuser;

    // Check if the user ID exists
    if (!user?.userId) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    
    // Ensure there are products in the order
    if (!payload?.products?.length) throw new AppError(httpStatus.BAD_REQUEST, 'No products in the order');
    
    // Calculate the total price and validate the products
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

    // Save the updated product quantities
    await Promise.all(dbProducts.map(product => product.save()));

    // Create the order in the database
    const order = await OrderModel.create({
        products: productsWithObjectId,
        user: new Types.ObjectId(user.userId),
        totalPrice,
        status: 'Pending',
    });

    // Prepare the payment payload
    const paymentPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: "BDT",
        customer_name: name,
        customer_address: "N/A",
        customer_email: email,
        customer_phone: "N/A",
        customer_city: "N/A",
        client_ip,
    };

    // Log the payment payload (remove or adjust for production)
    // console.log("Payment Payload:", paymentPayload);

    // Initiate payment and capture the response
    const payment = await orderUtils.makePaymentAsync(paymentPayload);

    // Log the payment response (remove or adjust for production)
    // console.log("Payment Response:", payment);

    // Check if the payment was successful and update the order's transaction details
    if (payment?.transactionStatus) {
        order.transaction = {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
        };
        await order.save();
    }

    // Ensure the payment URL is returned if available
    const paymentUrl = payment?.checkout_url || null;
    if (!paymentUrl) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment URL could not be generated');
    }

    // Return the order details along with the payment URL
    return {
        success: true,
        message: "Order created successfully",
        data: {
            orderDetails: order,
            paymentUrl,
        },
    };
};

// get All Order
const getAllOrderFromDB = async (query: Record<string, unknown>) => {

    const orderQuery = new QueryBuilder(OrderModel.find()
        .populate("user")
        .populate({
            path: "products",
            populate: {
                path: 'product',
            },
        }),
        query,
    )
        .search(OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await orderQuery.countTotal();
    const result = await orderQuery.modelQuery;

    return {
        meta,
        result,
    };
};

const getMeOrderFromDB = async (query: Record<string, unknown>, userId: string) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    const orderQuery = new QueryBuilder(
        OrderModel.find({ user: userId }) // Directly filter orders by userId
        .populate({
            path: "products",
            populate: {
                path: "product",
            },
        }),
        query
    )
        .search(OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await orderQuery.countTotal();
    const result = await orderQuery.modelQuery;

    return {
        meta,
        result,
    };
};


// Delete Order Data
const deleteOrderFromDB = async (id: string) => {

    const order = await OrderModel.findById(id);

    // Check blog Exist
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'This Order is not found !');
    }

    const result = OrderModel.findByIdAndDelete(id)
    return result;
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
    getAllOrderFromDB,
    deleteOrderFromDB,
    updateOrderIntoDB,
    getMeOrderFromDB,
    verifyPayment, 
};