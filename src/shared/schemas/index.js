import { z } from "zod";

// Base schemas that can be reused
export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username too long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  created_at: z.string().datetime().optional(),
});

export const CategorySchema = z.object({
  id: z.number().int().positive().optional(),
  user_id: z.number().int().positive(),
  name: z.string().min(1, "Category name is required").max(100),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be income or expense" }),
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export const TransactionSchema = z.object({
  id: z.number().int().positive().optional(),
  user_id: z.number().int().positive(),
  category_id: z.number().int().positive().nullable(),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be income or expense" }),
  }),
  description: z.string().min(1, "Description is required").max(255),
  place: z.string().max(100).optional(),
  date: z.string().datetime("Invalid date format"),
  notes: z.string().max(500).optional(),
  method: z.string().max(50).optional(),
  created_at: z.string().datetime().optional(),
});

// Request schemas - compose from base schemas
export const CreateUserRequest = UserSchema.pick({
  username: true,
  email: true,
  password: true,
});

export const LoginRequest = UserSchema.pick({
  email: true,
  password: true,
});

export const CreateCategoryRequest = CategorySchema.omit({
  id: true,
  user_id: true, // Will be added from session
  created_at: true,
});

export const UpdateCategoryRequest = CategorySchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true,
});

export const CreateTransactionRequest = TransactionSchema.omit({
  id: true,
  user_id: true, // Will be added from session
  created_at: true,
});

export const UpdateTransactionRequest = TransactionSchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true,
});

// Array schemas for bulk operations
export const CreateTransactionsRequest = z
  .array(CreateTransactionRequest)
  .min(1, "At least one transaction is required");

export const CreateCategoriesRequest = z
  .array(CreateCategoryRequest)
  .min(1, "At least one category is required");

// Query parameter schemas
export const PaginationQuery = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0, "Page must be positive")
    .default("1"),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, "Limit must be 1-100")
    .default("10"),
});

export const TransactionFilterQuery = PaginationQuery.extend({
  category_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  type: z.enum(["income", "expense"]).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export const MonthYearQuery = z.object({
  month: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/)
    .optional(),
  year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
});
