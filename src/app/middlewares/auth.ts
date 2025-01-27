import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
// import { TUserRole } from "../modules/user/user.interface";
// import { User } from "../modules/user/user.model";
// import catchAsync from "../utils/catchAsync"
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from "../utils/catchAsync";


const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {

        // const bearerToken = req.headers.authorization;
        // console.log(bearerToken);
        
        
        const token = req.headers.authorization?.split(' ')[1];
        // console.log(token);
        

        // checking if the token is missing
        if (!token) {
            throw new Error('You are not authorized')
        }

        // checking if the given token is valid
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,

        ) as JwtPayload;

        const { role, userId } = decoded;

        // checking if the user is exist
        const user = await User.getAuthUserData(userId);


        if (!user) {
            throw new Error('This user is not found !')
        }

        // checking if the user is Blocked
        const  isdeactive= user?.isdeactive

        if (isdeactive!) {
            throw new Error('This user is blocked !')
        }

        // jwt.verify(
        //     token,
        //     config.jwt_access_secret as string,
        //     function (err, decoded) {
        //         if (err) {
        //             throw new Error('Your token is invalid')
        //         }

        //         const role = (decoded as JwtPayload).role

        //         if (requiredRoles && !requiredRoles.includes(role)) {
        //             throw new Error('You are not authorized')
        //         }

        //         req.user = decoded as JwtPayload;
        //         next();
        //     });


        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new Error('You are not authorized')
        }

        req.user = decoded as JwtPayload;
        next();
    })
}

export default auth;