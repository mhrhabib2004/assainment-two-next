import express, { Request, Response } from "express";
import productRouter from "./route/product.route";
import orderRouter from "./route/order.route";
import { AuthRoutes } from "./app/modules/auth/auth.router";
import { AdminRoutes } from "./admin/admin.route";
import cors from "cors"

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies

app.use(cors({origin:'http://localhost:5173',credentials: true}))

// Routes
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);


// Root route
app.get("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Server is live",
  });
});

export default app;

