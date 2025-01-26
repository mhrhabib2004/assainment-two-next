

// const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
//     const result = await AcademicDepartment.create(payload);
//     return result;
// };

import { TUser } from "./user.model";

// User Creat Function
const createUserIntoDB = async ( payload: TUser) => {

    const result = await User.create(payload);

    
    return result;

    // // create a user object
    // const userData: Partial<TUser> = {};

    // //if password is not given , use deafult password
    // userData.password = password || (config.default_password as string);

    // //set student role
    // userData.role = 'admin';

    // const session = await mongoose.startSession();

    // try {
    //     session.startTransaction();
    //     //set  generated id
    //     userData.id = await generateAdminId();

    //     // create a user (transaction-1)
    //     const newUser = await User.create([userData], { session });

    //     //create a admin
    //     if (!newUser.length) {
    //         throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    //     }
    //     // set id , _id as user
    //     payload.id = newUser[0].id;
    //     payload.user = newUser[0]._id; //reference _id

    //     // create a admin (transaction-2)
    //     const newAdmin = await Admin.create([payload], { session });

    //     if (!newAdmin.length) {
    //         throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    //     }

    //     await session.commitTransaction();
    //     await session.endSession();

    //     return newAdmin;
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } catch (err: any) {
    //     await session.abortTransaction();
    //     await session.endSession();
    //     throw new Error(err);
    // }
};

export const UserServices = {
    createUserIntoDB,
};
