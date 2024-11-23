import { Router } from 'express';
import { calculateRevenue, createOrder } from '../controllers/order.controllers';


const orderRouter = Router();

// POST: Create an order
orderRouter.post('/', createOrder);
orderRouter.get('/revenue', calculateRevenue);

export default orderRouter;
