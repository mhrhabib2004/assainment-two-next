import express, { Request, Response } from "express";
import { AuthRoutes } from "./app/modules/auth/auth.router";
import { AdminRoutes } from "./app/admin/admin.route";
import cors from "cors"
import productRouter from "./app/product/product.route";
import orderRouter from "./app/order/order.route";
import globalErrorHandler from "./app/middlewares/globalerrorhandler";

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies

app.use(cors({origin:'http://localhost:5173',credentials: true}))

// Routes
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);

// Error-handling middleware (must be added after all routes)
app.use(globalErrorHandler);
// Root route
app.get("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Server is live",
  });
});

export default app;

