import express from 'express';
import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import { USER_ROLE } from '../modules/user/user.consatnt';
import { OrderController } from './order.controllers';
const router = express.Router();

// Create Order Route
router.post(
    '/',
    auth(USER_ROLE.user), 
    validateRequest(OrderValidations.createOrderValidationSchema), // Validate request payload
    OrderController.createOrder, 
);

// Verify Payment Route
router.get(
    '/verify-payment',
    auth(USER_ROLE.user), // Only authenticated users can verify payments
    OrderController.verifyPayment, // Handle payment verification logic
);

// Get All Orders Route
router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.user), // Admins and users can view orders
    OrderController.getAllOrder, // Handle get all orders logic
);

// Get My Orders Route
router.get(
    '/me',
    auth(USER_ROLE.user), // Only authenticated users can view their own orders
    OrderController.getMeOrder, // Handle get my orders logic
);

// Delete Order Route
router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user), // Admins and users can delete orders
    OrderController.deleteOrder, // Handle delete order logic
);

// Update Order Route
router.patch(
    '/:orderId',
    auth(USER_ROLE.user, USER_ROLE.admin), // Admins and users can update orders
    validateRequest(OrderValidations.updateOrderValidationSchema), // Validate request payload
    OrderController.updateOrder, // Handle update order logic
);

export const orderRouter = router;