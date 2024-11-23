
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

export const productController = {
createProduct
}