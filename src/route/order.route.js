"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controllers_1 = require("../controllers/order.controllers");
const orderRouter = (0, express_1.Router)();
// POST: Create an order
orderRouter.post('/', order_controllers_1.createOrder);
orderRouter.get('/revenue', order_controllers_1.calculateRevenue);
exports.default = orderRouter;
