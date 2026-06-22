const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  role: z.enum(['admin', 'manager', 'user']).optional().default('user'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .optional(),
  role: z.enum(['admin', 'manager', 'user']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  avatar: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .max(128, 'New password cannot exceed 128 characters'),
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
};

module.exports = {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  validate,
};
