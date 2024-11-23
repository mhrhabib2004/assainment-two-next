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
exports.productController = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_model_1 = __importDefault(require("../model/product/product.model"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paylod = req.body;
    const resut = yield product_model_1.default.create(paylod);
    res.json({
        message: "Product created successfully",
        success: true,
        data: resut
    });
});
// export const productController = {
// }
// Controller to get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        const products = yield product_model_1.default.find(filter);
        // Response
        res.status(200).json({
            message: "Products retrieved successfully",
            status: true,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve products",
            status: false,
            error: error instanceof Error ? error.stack : error
        });
    }
});
exports.getAllProducts = getAllProducts;
// Controller to get a specific product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({
                messege: "Product not found",
                status: false,
            });
        }
        res.status(200).json({
            message: "Product retrieved successfully",
            status: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve product",
            status: false,
            error: error instanceof Error ? error.stack : error,
        });
    }
});
exports.getProductById = getProductById;
// Controller to update a product by ID 
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const updates = req.body;
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, Object.assign(Object.assign({}, updates), { updatedAt: new Date() }), { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            status: false,
            error: error instanceof Error ? error.stack : error
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const deletedProduct = yield product_model_1.default.findByIdAndDelete(productId);
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
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            status: false,
            error: error instanceof Error ? error.stack : error
        });
    }
});
exports.deleteProduct = deleteProduct;
exports.productController = {
    createProduct,
    getAllProducts: exports.getAllProducts,
    getProductById: exports.getProductById,
    updateProduct: exports.updateProduct,
    deleteProduct: exports.deleteProduct
};
