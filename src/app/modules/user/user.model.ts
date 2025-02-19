/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import { Model, model, Schema } from "mongoose";

import config from '../../config';
import { TUser } from './user.interface';

// Specific filter interface data
interface UserModel extends Model<TUser> {
    getAuthUserData(userId:string): Promise<TUser | null>;
    getPublicUserData(userId:string): Promise<Pick<TUser, '_id' | 'name' | 'email' | 'isdeactive' |'role' >>;
}
                                           
// user Model
const userSchema = new Schema<TUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxlength: 20,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            validate: {
                validator: function (value: string) {
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
                },
                message: '{VALUE} is not a valid email',
            },
            immutable: true,
        },
        password: {
            type: String,
            required: [true, 'Password is Required'],
            select: false
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: '{VALUE} is not valid, please provide a valid role',
            },
            default: 'user',
            required: true,
        },
        isdeactive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Password hashing function
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(
            user.password,
            Number(config.bcrypt_salt_rounds),
        );
    }
    next();
});

// Clear password after saving
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// Get specific user data for authentication
userSchema.statics.getAuthUserData = function (userId: string) {
    return this.findById(userId).select('+password _id name email role isBlocked');
};

// Get public user data
userSchema.statics.getPublicUserData = function (userId: string) {
    return this.findById(userId).select('_id name email');
};

// Export User model
export const User = model<TUser, UserModel>('User', userSchema);
