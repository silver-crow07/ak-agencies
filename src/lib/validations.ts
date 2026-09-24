import { z } from 'zod';

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(12),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;

// ─── Auth Schemas ─────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  phone: z.string().max(20).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Address Schemas ──────────────────────────────────────────

export const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100).trim(),
  phone: z.string().min(1, 'Phone number is required').max(20).trim(),
  addressLine1: z.string().min(1, 'Address is required').max(200).trim(),
  addressLine2: z.string().max(200).trim().optional(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state: z.string().min(1, 'State is required').max(100).trim(),
  postalCode: z.string().min(1, 'Postal code is required').max(10).trim(),
  country: z.string().min(1, 'Country is required').max(50).trim().default('India'),
  isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ─── Admin Product Schemas ───────────────────────────────────

export const adminProductImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, 'Image URL is required').max(2000).trim(),
  alt: z.string().max(200).trim().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

export const adminProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).trim(),
  slug: z.string().min(1, 'Slug is required').max(200).trim(),
  shortDescription: z.string().max(500).trim().optional(),
  description: z.string().max(5000).trim().optional(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  badge: z.string().max(50).trim().optional().nullable(),
  inStock: z.boolean().optional().default(true),
  stockQuantity: z.coerce.number().int().min(0, 'Stock must be non-negative').optional().default(0),
  material: z.string().max(200).trim().optional().nullable(),
  colors: z.array(z.string().max(50)).optional().default([]),
  sizes: z.array(z.string().max(50)).optional().default([]),
  fabrics: z.array(z.string().max(50)).optional().default([]),
  features: z.array(z.string().max(200)).optional().default([]),
  careInstructions: z.string().max(1000).trim().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().optional().default(true),
  images: z.array(adminProductImageSchema).max(20, 'Maximum 20 images allowed').optional(),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const adminCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  slug: z.string().min(1, 'Slug is required').max(100).trim(),
  description: z.string().max(500).trim().optional().nullable(),
  imageUrl: z.string().max(500).trim().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export const adminOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export type AdminOrderStatusInput = z.infer<typeof adminOrderStatusSchema>;

// ─── Contact Submission Schemas ───────────────────────────────

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .trim()
    .refine((v) => v.length > 0, 'Name cannot be empty or whitespace'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone must be at most 20 characters')
    .trim()
    .refine((v) => v.length > 0, 'Phone cannot be empty or whitespace')
    .refine(
      (v) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')),
      'Please enter a valid Indian phone number',
    ),
  email: z
    .string()
    .max(200, 'Email must be at most 200 characters')
    .trim()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be at most 200 characters')
    .trim()
    .refine((v) => v.length > 0, 'Subject cannot be empty or whitespace'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be at most 2000 characters')
    .trim()
    .refine((v) => v.length > 0, 'Message cannot be empty or whitespace'),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

export const adminContactStatusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']),
});

export type AdminContactStatusInput = z.infer<typeof adminContactStatusSchema>;
