/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../config';

import QueryBuilder from '../../Builder/QueryBuilder';

// User Register function
const userRegisterDB = async (payload: TUser) => {
    try {
        // Check if user already exists (for unique constraint)
        const existingUser = await User.findOne({ email: payload.email });
        if (existingUser) {
            throw new AppError(400, 'Email is already in use!');
        }

        // Create the user
        const publicUserData = await User.create(payload);
        const result = await User.getPublicUserData(publicUserData._id);
        return result;
    } catch (error) {
        throw new AppError(400, 'Error registering user. Please try again!');
    }
};

// Login user
const loginUserWithDB = async (payload: { email: string; password: string }) => {
    // Validate that email and password are present
    if (!payload.email || !payload.password) {
        throw new AppError(400, 'Email and password are required!');
    }

    // Check if the user exists
    const user = await User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError(404, 'User not found!');
    }

    // Check if the user is blocked
    if (user.isdeactive) {
        throw new AppError(403, 'This user is deactivated!');
    }

    // Check if the password is correct
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(401, 'Incorrect password!');
    }

    // Create token and send to the client
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

// Get all users with query
const getAllUserFromDB = async (query: Record<string, unknown>) => {
    try {
        const userQuery = new QueryBuilder(User.find(), query)
            .search(['name', 'email', '_id'])
            .filter()
            .sort()
            .paginate()
            .fields();

        const meta = await userQuery.countTotal();
        const result = await userQuery.modelQuery;

        return {
            meta,
            result,
        };

    } catch (error) {
        throw new AppError(500, 'Error fetching users');
    }
};

// Get logged-in user details (by email)
import AppError from '../../errors/AppError'; // Adjust the import path

const getMeUserFromDB = async (email: string) => {
    try {
        console.log("Fetching user for email:", email);

        if (!email) {
            throw new AppError(400, 'Email is required!');
        }

        // Fetch user from the database (excluding the password field)
        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            throw new AppError(404, 'User not found!');
        }

        console.log("User found:", user);
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw new AppError(500, 'Error fetching user data');
    }
};


// Update user details
const updateUserIntoDB = async (userId: string, payload: Partial<TUser>) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: userId },
            payload,
            { new: true }
        );
        if (!result) {
            throw new AppError(404, 'User not found!');
        }
        return result;
    } catch (error) {
        throw new AppError(500, 'Error updating user');
    }
};

// Deactivate (soft-delete) user
const deactiveUserFromDB = async (userId: string) => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            { isdeactive: true },
            { new: true }
        );
        if (!result) {
            throw new AppError(404, 'User not found!');
        }
        return result;
    } catch (error) {
        throw new AppError(500, 'Error deactivating user');
    }
};

// Export all the functions as AuthService
export const AuthService = {
    userRegisterDB,
    loginUserWithDB,
    getAllUserFromDB,
    updateUserIntoDB,
    deactiveUserFromDB,
    getMeUserFromDB,
};
