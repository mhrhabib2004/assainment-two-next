import httpStatus from 'http-status';
import { AdminServices } from "./admin.service";
import catchAsync from "../app/utils/catchAsync";
import sendResponse from '../app/utils/sendResponse';

// import { AdminServices } from "./admin.service";

// Blocked user
const userDeactive = catchAsync(async (req, res) => {

    const id = req.params._id;

    console.log(id,"ddddd");

    await AdminServices.userDeactiveWithAdminFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User userDeactive successfully',
        data: undefined,
    });
});

// User userDeactive Route
const userActive = catchAsync(async (req, res) => {

    const id = req.user;
    console.log(id)

    await AdminServices.userActiveWithAdminFromDB(id);

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