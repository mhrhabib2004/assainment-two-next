
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.consatnt';


const router = express.Router();

// User register Route
router.post(
    '/register',
    validateRequest(UserValidation.userValidationSchema),
    AuthControllers.registerUser,
);

// Login User Route
router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
);

// get All user route
router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.user),
    AuthControllers.getAlluser,
);

// get Me user route
router.get(
    '/me',
    auth(USER_ROLE.user, USER_ROLE.admin),
    AuthControllers.getMeuser,
);


// Update user route
router.patch(
    '/:userId',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(AuthValidation.UpdateUserValidationSchema),
    AuthControllers.updateUser,
);

// Delete user route
router.delete(
    '/:id',
    auth(USER_ROLE.admin),
    AuthControllers.deleteUser,
);


// // Password cgange user route
// router.patch(
//     '/passwordchange/:userEmail',
//     auth(USER_ROLE.user, USER_ROLE.admin),
//     validateRequest(AuthValidation.passwordChangeUserValidationSchema),
//     UserControllers.userPasswordChange,
// );

export const AuthRoutes = router;