import { z } from "zod"

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Please inpute your email",
        }).email(),
        password: z.string({ required_error: 'Password is required' }),
    }),
})

const UpdateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        isdeactive: z.boolean().optional(),
        role: z.enum(['admin' , 'user']).optional(),

    }),
});

export const AuthValidation = {
    loginValidationSchema,
    UpdateUserValidationSchema
}