
import httpStatus from 'http-status';
import sendResponse from "../../utils/sendResponse";
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';



// User Create Funtionality
const createUser = catchAsync(async (req, res) => {
  const { user } = await req.body;
console.log({user})
  const result = await UserServices.createUserIntoDB(user);
  console.log(result)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created succesfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
};