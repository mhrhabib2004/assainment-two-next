"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controllers_1 = require("../controllers/product.controllers");
const productRouter = (0, express_1.Router)();
// Endpoint to create a new product
productRouter.post("/create-product", product_controllers_1.productController.createProduct);
// Endpoint to get all products
productRouter.get("/", product_controllers_1.productController.getAllProducts);
productRouter.get("/:productId", product_controllers_1.productController.getProductById);
productRouter.put("/:productId", product_controllers_1.productController.updateProduct);
productRouter.delete("/:productId", product_controllers_1.productController.deleteProduct);
exports.default = productRouter;
