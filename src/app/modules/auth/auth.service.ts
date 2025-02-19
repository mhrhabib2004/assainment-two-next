


import bcrypt from 'bcrypt';
import { createToken } from "./auth.utils";
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../config';




// User Register function
const userRegisterDB = async (payload: TUser) => {
    const publicUserData = await User.create(payload);
    const result = await User.getPublicUserData(publicUserData._id);

    return result
}

// Login user
const loginUserWithDB = async (payload: { email: string; password: string }) => {

    // checking if the user is exist
    const user = await User.findOne({ email: payload?.email }).select('+password');

    if (!user) {
        throw new Error('This user is not found !')
    }

    // checking if the user is Blocked
    const isdeactive = user?.isdeactive

    if (isdeactive) {
        throw new Error('This user is deactive! !')
    }

    //checking if the password is correct
    const isPasswordMatched = await bcrypt.compare(
        payload?.password,
        user?.password
    )

    if (!isPasswordMatched) {
        throw new Error('Your Password is Wrong.   Please inpute Corect password')
    }

    //create token and sent to the  client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const token = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return { token };
    
}

export const AuthService = {
    userRegisterDB,
    loginUserWithDB
}