"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_route_1 = __importDefault(require("./route/product.route"));
const order_route_1 = __importDefault(require("./route/order.route"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // To parse JSON bodies
// Routes
app.use("/api/products", product_route_1.default);
app.use("/api/orders", order_route_1.default);
// Root route
app.get("/", (req, res) => {
    res.send({
        status: true,
        message: "Server is live",
    });
});
exports.default = app;
