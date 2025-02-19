import { Router } from 'express';
import { calculateRevenue, createOrder } from './order.controllers';


const orderRouter = Router();

// POST: Create an order
orderRouter.post('/', createOrder);
orderRouter.get('/revenue', calculateRevenue);

export default orderRouter;
