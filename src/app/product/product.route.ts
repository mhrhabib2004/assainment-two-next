import { Router } from "express";
import { ProductValidations } from "./product.validations"; // Import validation schemas
import validateRequest from "../middlewares/validateRequest";
import { productController } from "./product.controllers";
import auth from "../middlewares/auth";
import { USER_ROLE } from "../modules/user/user.consatnt";


const productRouter = Router();

// Endpoint to create a new product
productRouter.post(
    "/create-product", 
    auth(USER_ROLE.admin),
    validateRequest(ProductValidations.createProductValidationSchema), 
    productController.createProduct
);

// Endpoint to get all products
productRouter.get("/", productController.getAllProducts);

// Endpoint to get a single product by ID
productRouter.get("/:productId", productController.getProductById);

// Endpoint to update a product by ID
productRouter.put(
    "/:productId",auth(USER_ROLE.admin),
    validateRequest(ProductValidations.updateProductValidationSchema), 
    productController.updateProduct
);

// Endpoint to delete a product by ID
productRouter.delete("/:productId", productController.deleteProduct);

export default productRouter;