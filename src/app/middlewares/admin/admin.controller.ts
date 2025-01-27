import httpStatus from 'http-status';
import { AdminServices } from "./admin.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';

// import { AdminServices } from "./admin.service";

// Blocked user
const userDeactive = catchAsync(async (req, res) => {

    const userId = req.params.userId;

    await AdminServices.userDeactiveWithAdminFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User userDeactive successfully',
        data: undefined,
    });
});

// User userDeactive Route
const userActive = catchAsync(async (req, res) => {

    const userId = req.params.userId;

    await AdminServices.userActiveWithAdminFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User userActive successfully',
        data: undefined,
    });
});

// // Delete Blog Data By Admin
// const deleteBlogByAdmin = catchAsync(async (req, res) => {
//     const id = req.params.id;

//     await AdminServices.deleteBlogByAdminFromDB(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Blog deleted succesfully',
//         data: undefined
//     });
// });


export const AdminControllers = {
  userDeactive,
  userActive

};