import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Bicycle',
                    required: [true, 'Bicycle ID is required'],
                },
                quantity: {
                    type: Number,
                    required: [true, 'Quantity is required'],
                    min: [1, 'Quantity must be at least 1'],
                },
                _id: false, // Prevents Mongoose from automatically adding an `_id` field for subdocuments
            },
        ],
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0, 'Total price cannot be negative'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
            default: 'Pending',
            required: [true, 'Order status is required'],
        },
        transaction: {
            id: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
            transactionStatus: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
            bank_status: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
            sp_code: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
            sp_message: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
            method: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
            date_time: {
                type: String,
                required: false, // Optional, as it may not be available initially
            },
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

const OrderModel = model<TOrder>('Order', orderSchema);

export default OrderModel;