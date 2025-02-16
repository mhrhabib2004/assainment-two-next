import express from 'express';
import { AdminControllers } from './admin.controller';
import auth from '../app/middlewares/auth';
import { USER_ROLE } from '../app/modules/user/user.consatnt';


const router = express.Router(); 

// User Blocked Route
router.patch(
    '/users/:userId/deactive', auth(USER_ROLE.admin),  AdminControllers.userDeactive,
);

// User unBlocked Route
router.patch(
    '/users/:userId/active', auth(USER_ROLE.admin), AdminControllers.userActive,
);

// // Delete Blog by Admin Route
// router.delete(
//     '/blogs/:id', auth(USER_ROLE.admin), AdminControllers.deleteBlogByAdmin,
// );

export const AdminRoutes = router;