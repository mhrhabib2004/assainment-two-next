import { Request, Response } from "express";
import ProductModel from "../product/product.model";
import OrderModel from "./order.model";


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
      
    } catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            status: false,
            error: error instanceof Error ? error.stack : error
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

      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalRevenue" },
        },
      },
   ])

     // Check if revenue data exists
     if (revenueData.length === 0) {
        return res.status(200).json({
          message: "No orders found",
          status: true,
          data: { totalRevenue: 0 },
        });
      } 
       // Response with total revenue
    res.status(200).json({
        message: "Revenue calculated successfully",
        status: true,
        data: {
          totalRevenue: revenueData[0].totalRevenue, 
        },
      });
} catch (error) {
    res.status(500).json({
        message: "Failed to calculate revenue",
        status: false,
        error: error instanceof Error ? error.stack : error
      });
    
}
}