import express from 'express';
import { AdminControllers } from './admin.controller';
import auth from '../app/middlewares/auth';
import { USER_ROLE } from '../app/modules/user/user.consatnt';


const router = express.Router();

// Block User Route
router.patch(
    '/users/:userId/deactive', 
    auth(USER_ROLE.admin),  
    AdminControllers.userDeactive
);

// Unblock User Route
router.patch(
    '/users/:userId/active', 
    auth(USER_ROLE.admin), 
    AdminControllers.userActive
);

export const AdminRoutes = router;
