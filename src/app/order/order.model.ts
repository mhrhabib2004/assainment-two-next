import { Schema, model, Document } from "mongoose";

// Order Interface
interface IOrder extends Document {
  email: string;           
  product: Schema.Types.ObjectId;      
  quantity: number;        
  totalPrice: number;      
  createdAt: Date;        
  updatedAt: Date;         
}

// Order Schema
const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",   
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,           
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,   
  }
);

// Order Model
const OrderModel = model<IOrder>("Order", orderSchema);

export default OrderModel;
