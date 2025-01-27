import { z } from "zod"

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Please inpute your email",
        }).email(),
        password: z.string({ required_error: 'Password is required' }),
    }),
})

export const AuthValidation = {
    loginValidationSchema,
}