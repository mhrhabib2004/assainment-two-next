
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from '../../errors/AppError';



// User Register Funtionality
const registerUser = catchAsync(async (req, res) => {

    const result = await AuthService.userRegisterDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});

// Login User
const loginUser = catchAsync(async (req, res) => {

    const result = await AuthService.loginUserWithDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Login successful',
        data: result,
    });
});

// get All User
const getAlluser = catchAsync(async (req, res) => {

    const result = await AuthService.getAllUserFromDB(req.query);
    // console.log(result);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All user get successfully',
        // meta: result?.meta,
        // data: result?.result,
        data: result
    });
});

// get All User
const getMeuser = catchAsync(async (req, res) => {
    // Extract the email from the authenticated user
    const email = req.user?.email;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email is required!');
    }

    // Fetch the user data from the database
    const result = await AuthService.getMeUserFromDB(email);

    // Send the response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

// Update user
const updateUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    // console.log(userId);

    const result = await AuthService.updateUserIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is updated succesfully',
        data: result,
    });
});


// delete user
const deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AuthService.deactiveUserFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is deleted succesfully',
        data: result,
    });
});


// // Password Changes User
// const userPasswordChange = catchAsync(async (req, res) => {

//     const userEmail = req.user?.userEmail;
    
//     const result = await AuthService.userPasswordChangeIntoDB(userEmail, req.body );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'User password changes succesfully',
//         data: result,
//     });
// });




export const AuthControllers = {
    registerUser,
    loginUser,
    getAlluser,
    updateUser,
    deleteUser,
    getMeuser,
    
}