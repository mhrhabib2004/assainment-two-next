import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../config';
import AppError from '../../errors/AppError';


// User Register function
const userRegisterDB = async (payload: TUser) => {
    try {
        const publicUserData = await User.create(payload);
        const result = await User.getPublicUserData(publicUserData._id);
        return result;
    } catch (error) {
        throw new AppError(400, 'Error registering user. Please try again!');
    }
};

// Login user
const loginUserWithDB = async (payload: { email: string; password: string }) => {
    // checking if the user exists
    const user = await User.findOne({ email: payload?.email }).select('+password');
    if (!user) {
        throw new AppError(404, 'User not found!');
    }

    // checking if the user is blocked
    if (user?.isdeactive) {
        throw new AppError(403, 'This user is deactivated!');
    }

    // checking if the password is correct
    const isPasswordMatched = await bcrypt.compare(payload?.password, user?.password);
    if (!isPasswordMatched) {
        throw new AppError(401, 'Incorrect password!');
    }

    // create token and send to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const token = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    // Return token and user details
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    };
};

export const AuthService = {
    userRegisterDB,
    loginUserWithDB,
};
