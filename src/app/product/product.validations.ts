import { z } from "zod";

// Define the Category enum schema
export const ProductCategorySchema = z.enum([
    'Writing',
    'Office Supplies',
    'Art Supplies',
    'Educational',
    'Technology',
]);

// Create Product Zod Route Validation
export const createProductValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        brand: z.string(),
        image: z.string().url(),
        price: z.number().positive(),
        category: ProductCategorySchema,
        description: z.string(),
        quantity: z.number().int().nonnegative(),
        inStock: z.boolean(),
    })
});

// Update Product Zod Route Validation
export const updateProductValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        brand: z.string().optional(),
        image: z.string().url().optional(),
        price: z.number().positive().optional(),
        category: ProductCategorySchema.optional(),
        description: z.string().optional(),
        quantity: z.number().int().nonnegative().optional(),
        inStock: z.boolean().optional(),
    })
});

// Export the validation schemas
export const ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema
};