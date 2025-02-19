import express from 'express';
import { USER_ROLE } from '../modules/user/user.consatnt';
import auth from '../middlewares/auth';
import { AdminControllers } from './admin.controller';

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
