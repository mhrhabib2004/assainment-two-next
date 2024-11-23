import mongoose, { Schema, Document, Model } from "mongoose";

// Define Category Enum
enum Category {
  Writing = "Writing",
  OfficeSupplies = "Office Supplies",
  ArtSupplies = "Art Supplies",
  Educational = "Educational",
  Technology = "Technology",
}

// Define the IProduct Interface
interface IProduct extends Document {
  name: string;
  brand: string;
  price: number;
  category: Category;
  description: string;
  quantity: number;
  inStock: boolean;
}

// Define the Product Schema
const productSchema = new Schema<IProduct>(
  {
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
        message:
          "Category must be one of Writing, Office Supplies, Art Supplies, Educational, Technology",
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
  },
  { timestamps: true } 
);

// Define the Product Model
const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default ProductModel;
