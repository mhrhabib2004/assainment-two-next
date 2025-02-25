import { z } from 'zod';

// Define the order status enum
export const TOrderStatusSchema = z.enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled']);

// Schema for validating the product object in the order
const productSchema = z.object({
    product: z.string({ required_error: 'Product ID is required' }), // Product ID as a string
    quantity: z
        .number({ required_error: 'Quantity is required' })
        .positive({ message: 'Quantity must be a positive number' }), // Quantity must be positive
});

// Schema for validating the creation of an order
export const createOrderValidationSchema = z.object({
    body: z.object({
        products: z
            .array(productSchema, { required_error: 'Products are required' })
            .nonempty({ message: 'At least one product is required' }), // Ensure the array is not empty
    }),
});

// Schema for validating the update of an order
export const updateOrderValidationSchema = z.object({
    body: z.object({
        products: z
            .array(
                z.object({
                    product: z.string({ required_error: 'Product ID is required' }), // Product ID as a string
                    quantity: z
                        .number({ required_error: 'Quantity is required' })
                        .positive({ message: 'Quantity must be a positive number' }), // Quantity must be positive
                })
            )
            .optional(), // Products array is optional during update
        status: TOrderStatusSchema.optional(), // Status is optional during update
    }),
});

// Export all validation schemas
export const OrderValidations = {
    createOrderValidationSchema,
    updateOrderValidationSchema,
};