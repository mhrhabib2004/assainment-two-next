"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define Category Enum
/* eslint-disable no-unused-vars */
var Category;
(function (Category) {
    Category["Writing"] = "Writing";
    Category["OfficeSupplies"] = "Office Supplies";
    Category["ArtSupplies"] = "Art Supplies";
    Category["Educational"] = "Educational";
    Category["Technology"] = "Technology";
})(Category || (Category = {}));
// Define the Product Schema
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
    },
    brand: {
        type: String,
        required: [true, "Brand name is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"],
    },
    category: {
        type: String,
        enum: {
            values: [
                Category.Writing,
                Category.OfficeSupplies,
                Category.ArtSupplies,
                Category.Educational,
                Category.Technology,
            ],
            message: "Category must be one of Writing, Office Supplies, Art Supplies, Educational, Technology",
        },
        required: [true, "Category is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity must be a non-negative number"], // Prevent negative quantities
    },
    inStock: {
        type: Boolean,
        required: [true, "In-stock status is required"],
    },
}, { timestamps: true });
// Define the Product Model
const ProductModel = mongoose_1.default.model("Product", productSchema);
exports.default = ProductModel;
