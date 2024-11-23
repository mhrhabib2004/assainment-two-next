"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Order Schema
const orderSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
// Order Model
const OrderModel = (0, mongoose_1.model)("Order", orderSchema);
exports.default = OrderModel;
