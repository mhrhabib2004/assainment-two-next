import httpStatus from 'http-status';
import { Request, Response } from "express";
import ProductModel from "./product.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";

// Controller to create a new product
const createProduct = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await ProductModel.create(payload);

    res.status(httpStatus.CREATED).json({
        message: "Product created successfully",
        success: true,
        data: result,
    });
});

// Controller to get all products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const { searchTerm } = req.query;
    let filter = {};

    // Apply filter if searchTerm exists
    if (searchTerm) {
        filter = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { brand: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } },
            ],
        };
    }

    // Fetch filtered or all products
    const products = await ProductModel.find(filter);

    // Response
    res.status(httpStatus.OK).json({
        message: "Products retrieved successfully",
        success: true,
        data: products,
    });
});

// Controller to get a specific product by ID
const getProductById = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);

    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    res.status(httpStatus.OK).json({
        message: "Product retrieved successfully",
        success: true,
        data: product,
    });
});

// Controller to update a product by ID
const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const updates = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    res.status(httpStatus.OK).json({
        message: "Product updated successfully",
        success: true,
        data: updatedProduct,
    });
});

// Controller to delete a product (soft delete)
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await ProductModel.findByIdAndUpdate(
        productId,
        { isDeleted: true },
        { new: true }
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    res.status(httpStatus.OK).json({
        success: true,
        message: "Product is deleted successfully",
        data: result,
    });
});

// Export all controllers
export const productController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
