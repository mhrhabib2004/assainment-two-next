import { Router } from 'express';
import { createOrder } from '../controllers/order.controllers';


const orderRouter = Router();

// POST: Create an order
orderRouter.post('/', createOrder);

export default orderRouter;
