import { z } from "zod";


export const TOrderStatusSchema = z.enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"]);

// Create Zod Route Validation
// export const createOrderValidationSchema = z.object({
//     body: z.object({
//         product: z.string(),
//         quantity: z.number().positive(),
//     })
// });

export const createOrderValidationSchema = z.object({
    body: z.object({
        products: z.array(
            z.object({
                product: z.string(), // Product ID as a string (will be converted to ObjectId)
                quantity: z.number().positive(), // Quantity must be a positive number
            })
        ),
    }),
});


// Update Zod Route Validation
export const updateOrderValidationSchema = z.object({
    body: z.object({
        quantity: z.number().positive().optional(),
        status: TOrderStatusSchema.optional()
    })
});


export const OrderValidations = {
    createOrderValidationSchema,
    updateOrderValidationSchema
};