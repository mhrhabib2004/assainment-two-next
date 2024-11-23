"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRevenue = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../model/order/order.model"));
const product_model_1 = __importDefault(require("../model/product/product.model"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, product, quantity, totalPrice } = req.body;
        const foundProduct = yield product_model_1.default.findById(product);
        if (!foundProduct) {
            return res.status(404).json({
                message: "Product not found",
                status: false,
            });
        }
        if (foundProduct.quantity < quantity) {
            return res.status(400).json({
                message: "Insufficient stock",
                status: false,
            });
        }
        foundProduct.quantity -= quantity;
        if (foundProduct.quantity === 0) {
            foundProduct.inStock = false;
        }
        yield foundProduct.save();
        const newOrder = yield order_model_1.default.create({
            email,
            product,
            quantity,
            totalPrice,
        });
        res.status(201).json({
            message: "Order created successfully",
            status: true,
            data: newOrder,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            status: false,
            error: error instanceof Error ? error.stack : error
        });
    }
});
exports.createOrder = createOrder;
// calculateRevenue 
const calculateRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenueData = yield order_model_1.default.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails",
            },
            {
                $project: {
                    totalRevenue: {
                        $multiply: [
                            "$quantity",
                            "$productDetails.price",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalRevenue" },
                },
            },
        ]);
        // Check if revenue data exists
        if (revenueData.length === 0) {
            return res.status(200).json({
                message: "No orders found",
                status: true,
                data: { totalRevenue: 0 },
            });
        }
        // Response with total revenue
        res.status(200).json({
            message: "Revenue calculated successfully",
            status: true,
            data: {
                totalRevenue: revenueData[0].totalRevenue,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to calculate revenue",
            status: false,
            error: error instanceof Error ? error.stack : error
        });
    }
});
exports.calculateRevenue = calculateRevenue;
