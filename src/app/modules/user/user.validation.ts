

import { z } from 'zod';



// Create user validation
const userValidationSchema = z.object({
    body: z.object({
        
        name: z.string({ required_error: "Name must be a string" }),
            

        email: z.string({ required_error: "Please Inpute your Email" }).email(),

        password: z
            .string({ required_error: "Please Inpute Valid password" })
            
    }),

});

export const UserValidation = {
    userValidationSchema,
};