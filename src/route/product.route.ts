import { Router } from "express";
import { productController } from "../controllers/product.controllers";

const productRouter = Router()

productRouter.post("/create-product", productController.createProduct)

export default productRouter