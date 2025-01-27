

import { z } from 'zod';



// Create user validation
const userValidationSchema = z.object({
    body: z.object({
        
        name: z.string({ required_error: "Name must be a string" })
            .max(20, { message: "Name must be less than 20 characters" }),

        email: z.string({ required_error: "Please Inpute your Email" }).email(),

        password: z
            .string({ required_error: "Please Inpute Valid password" })
            .min(6, { message: 'Password must be at least 6 characters' })
            .max(20, { message: 'Password must be less than 20 characters' }),
    }),

});

export const UserValidation = {
    userValidationSchema,
};