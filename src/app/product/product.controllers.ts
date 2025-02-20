import { Request, Response } from "express";
import ProductModel from "./product.model";
import catchAsync from "../utils/catchAsync";


// Controller to create a new product
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await ProductModel.create(payload);

  res.status(201).json({
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
  res.status(200).json({
    message: "Products retrieved successfully",
    status: true,
    data: products,
  });
});

// Controller to get a specific product by ID
const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const product = await ProductModel.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      status: false,
    });
  }

  res.status(200).json({
    message: "Product retrieved successfully",
    status: true,
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
    return res.status(404).json({
      message: "Product not found",
      status: false,
    });
  }

  res.status(200).json({
    message: "Product updated successfully",
    status: true,
    data: updatedProduct,
  });
});

// Controller to delete a product by ID
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const deletedProduct = await ProductModel.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return res.status(404).json({
      message: "Product not found",
      status: false,
    });
  }

  res.status(200).json({
    message: "Product deleted successfully",
    status: true,
    data: {},
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