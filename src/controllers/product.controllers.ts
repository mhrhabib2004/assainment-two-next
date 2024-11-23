
import { Request, Response } from "express";
import ProductModel from "../model/product/product.model";

const createProduct = async (req:Request,res:Response)=>{
    const paylod = req.body
     const resut = await ProductModel.create(paylod)
     res.json({
        message: "Product created successfully",
        success: true,
        data : resut

     })
}

// export const productController = {

// }

// Controller to get all products
export const getAllProducts = async (req: Request, res: Response) => {
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
      const products = await ProductModel.find(filter);
  
      // Response
      res.status(200).json({
        message: "Products retrieved successfully",
        status: true,
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve products",
        status: false,
        error: error.message,
      });
    }
  };
  
  export const productController = {
    createProduct,getAllProducts
    }