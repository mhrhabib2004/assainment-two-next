import { Request, Response } from "express";
import OrderModel from "../model/order/order.model";
import ProductModel from "../model/product/product.model";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { email, product, quantity, totalPrice } = req.body;

        const foundProduct = await ProductModel.findById(product);
        
        if (!foundProduct) {
            return res.status(404).json({
              message: "Product not found",
              status: false,
            });
          }

          if (foundProduct.quantity < quantity) {
            return res.status(400).json({
              message: "Insufficient stock",
              status: false,
            });
          }


          foundProduct.quantity -= quantity;

          if (foundProduct.quantity === 0) {
            foundProduct.inStock = false;
          }

          await foundProduct.save();

          const newOrder = await OrderModel.create({
            email,
            product,
            quantity,
            totalPrice,
          })

          res.status(201).json({
            message: "Order created successfully",
            status: true,
            data: newOrder,
          });
      
    } catch (error:any) {
        res.status(500).json({
            message: "Failed to create order",
            status: false,
            error: error.message,
          });
    }
}


// calculateRevenue 

export const calculateRevenue = async (req:Request,res:Response) => {
try {
   const revenueData = await OrderModel.aggregate([
    {
        $lookup : {
            from: "products", 
            localField: "product",
            foreignField: "_id",
            as: "productDetails", 
        },
    },
    {
        $unwind: "$productDetails",
    },
    {
        $project: {
          totalRevenue: {
            $multiply: [
              "$quantity",        
              "$productDetails.price",         
            ],
          },
        },
      },
   ])
} catch (error: eny) {
    res.status(500).json({
        message: "Failed to calculate revenue",
        status: false,
        error: error.message,
      });
    
}
}