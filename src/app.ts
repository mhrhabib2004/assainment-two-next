import express, { Request, Response } from "express";
import productRouter from "./route/product.route";
import orderRouter from "./route/order.route";

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Routes
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Server is live",
  });
});

export default app;

