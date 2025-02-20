import { Request, Response } from "express";
import ProductModel from "./product.model";


const createProduct = async (req:Request,res:Response)=>{
   try {
    const paylod = req.body
    const resut = await ProductModel.create(paylod)
    
    res.json({
       message: "Product created successfully",
       success: true,
       data : resut

    })
   } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve products",
      status: false,
      error : error instanceof Error ? error.stack : error
    });
   }
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
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve products",
        status: false,
        error : error instanceof Error ? error.stack : error
      });
    }
  };

  // Controller to get a specific product by ID

  export const getProductById = async (req:Request,res:Response) => {
    try {
        const {productId } = req.params;
        const product = await ProductModel.findById(productId);

        if(!product){
            return res.status(404).json({
                messege :"Product not found",
                status: false,
            })
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            status: true,
            data: product,
          });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve product",
            status: false,
            error: error instanceof Error ? error.stack : error,
        })
    }
  }


  // Controller to update a product by ID 

  export const updateProduct = async (req:Request , res:Response) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            {...updates, updatedAt: new Date()},
            {new: true, runValidators: true }
        )

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

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            status: false,
            error: error instanceof Error ? error.stack : error
        })
    }
  }


  export const deleteProduct = async (req:Request , res:Response)=>{
    try {
        const {productId}=req.params;
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
            data: {},});
    } catch (error ) {
        res.status(500).json({
            message: "Failed to update product",
            status: false,
            error: error instanceof Error ? error.stack : error
        })
    }

  }
  
  export const productController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
    }