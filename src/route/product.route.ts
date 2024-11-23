

import { Router } from "express";
import { productController } from "../controllers/product.controllers";

const productRouter = Router();

// Endpoint to create a new product
productRouter.post("/create-product", productController.createProduct);

// Endpoint to get all products
productRouter.get("/", productController.getAllProducts);

export default productRouter;
