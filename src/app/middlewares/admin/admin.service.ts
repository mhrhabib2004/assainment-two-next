import { User } from "../../modules/user/user.model";

// Blocked user
const userDeactiveWithAdminFromDB = async (userId: string) => {

    const user = await User.findById(userId);

    // Check User Find 
    if (!user) {
        throw new Error('This user is not found !')
    }

    // Check User Admin
    if (user.role === 'admin') {
        throw new Error('This user is an admin. Not Alow to make Deactive')
    }

    // Check User Already Blocked
    if (user.isdeactive) {
        throw new Error('User is already Deactive!')
    }

    const result = await User.findOneAndUpdate(
        { _id: userId },
        { isdeactive: true },
        {
            new: true,
        },
    )
    return result;
};

// unBlocked user
const userActiveWithAdminFromDB = async (userId: string) => {

    const user = await User.findById(userId);

    // Check User Find 
    if (!user) {
        throw new Error('This user is not found !')
    }

    // Check User Admin
    if (user.role === 'admin') {
        throw new Error('This user is an admin. Not Alow make Deactive')
    }

    // Check User Already Blocked
    if (!user.isdeactive!) {
        throw new Error('User is already Deactive!')
    }

    const result = await User.findOneAndUpdate(
        { _id: userId },
        { isdeactive: false },
        {
            new: true,
        },
    )
    return result;
};

// // Delete Blog By Admin
// const deleteBlogByAdminFromDB = async (id: string) => {

//     const blog = await Blogs.findById(id);

//     // Check blog Exist
//     if (!blog) {
//         throw new Error('This blog is already deleted !')
//     }

//     const result = Blogs.findByIdAndDelete(id)
//     return result;
// };



export const AdminServices = {
   userActiveWithAdminFromDB,
   userDeactiveWithAdminFromDB

};