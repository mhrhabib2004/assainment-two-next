import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { OrderService } from "./order.service";
import AppError from "../errors/AppError";

// Create Order Function
const createOrder = catchAsync(async (req, res) => {
    const user = req.user; // Assuming `req.user` contains the authenticated user's details
    const clientIp = req.ip; // Get the client's IP address

    const result = await OrderService.createOrderIntoDB(req.body, user, clientIp);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
});

// Verify Payment Function
const verifyPayment = catchAsync(async (req, res) => {
    const orderId = req.query.order_id as string; // Extract order_id from query params

    const result = await OrderService.verifyPayment(orderId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment verified successfully',
        data: result,
    });
});

// get All order 
const getAllOrder = catchAsync(async (req, res) => {

    const result = await OrderService.getAllOrderFromDB(req.query);
    // const result = await OrderService.getAllOrderFromDB();
    // console.log(result);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Order get successfully',
        // meta: result?.meta,
        // data: result?.result,
        data: result
    });
});

const getMeOrder = catchAsync(async (req, res) => {
    const userId = req.user?.userId; // Ensure this is the correct user ID

    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User ID is missing");
    }

    const result = await OrderService.getMeOrderFromDB(req.query, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User orders retrieved successfully',
        data: result
    });
});


// Delete Order Function
const deleteOrder = catchAsync(async (req, res) => {
    const { id } = req.params; // Extract order ID from request params

    const result = await OrderService.deleteOrderFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order deleted successfully',
        data: result,
    });
});

// Update Order Function
const updateOrder = catchAsync(async (req, res) => {
    const { orderId } = req.params; // Extract order ID from request params

    const result = await OrderService.updateOrderIntoDB(orderId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order updated successfully',
        data: result,
    });
});

export const OrderController = {
    createOrder,
    getAllOrder,
    deleteOrder,
    updateOrder,
    verifyPayment,
    getMeOrder,
};
