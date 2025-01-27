
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";


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




export const AuthControllers = {
    registerUser,
    loginUser
}