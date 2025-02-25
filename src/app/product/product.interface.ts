/* eslint-disable no-unused-vars */
export enum Category  {
    Writing = "Writing",
    OfficeSupplies = "Office Supplies",
    ArtSupplies = "Art Supplies",
    Educational = "Educational",
    Technology = "Technology",
  }

// Define the IProduct Interface
export interface IProduct extends Document {
    name: string;
    brand: string;
    image:string;
    price: number;
    category: Category;
    description: string;
    quantity: number;
    isDeleted: boolean;
    inStock: boolean;
  }