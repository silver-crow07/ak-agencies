import { describe, it, expect } from 'vitest';
import {
  adminProductSchema,
  adminProductImageSchema,
  adminOrderStatusSchema,
} from '@/lib/validations';

describe('adminProductImageSchema', () => {
  it('accepts valid image with url only', () => {
    const result = adminProductImageSchema.safeParse({ url: 'https://example.com/img.jpg' });
    expect(result.success).toBe(true);
  });

  it('accepts valid image with all fields', () => {
    const result = adminProductImageSchema.safeParse({
      id: 'abc123',
      url: 'https://example.com/img.jpg',
      alt: 'Product image',
      sortOrder: 2,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty url', () => {
    const result = adminProductImageSchema.safeParse({ url: '' });
    expect(result.success).toBe(false);
  });

  it('rejects url exceeding max length', () => {
    const result = adminProductImageSchema.safeParse({ url: 'x'.repeat(2001) });
    expect(result.success).toBe(false);
  });
});

describe('adminProductSchema images field', () => {
  it('accepts product with no images field', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: 100,
      categoryId: 'cat1',
    });
    expect(result.success).toBe(true);
  });

  it('accepts product with empty images array', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: 100,
      categoryId: 'cat1',
      images: [],
    });
    expect(result.success).toBe(true);
  });

  it('accepts product with valid images', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: 100,
      categoryId: 'cat1',
      images: [
        { url: 'https://example.com/1.jpg', alt: 'Image 1', sortOrder: 0 },
        { url: 'https://example.com/2.jpg', alt: 'Image 2', sortOrder: 1 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than 20 images', () => {
    const images = Array.from({ length: 21 }, (_, i) => ({
      url: `https://example.com/${i}.jpg`,
    }));
    const result = adminProductSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: 100,
      categoryId: 'cat1',
      images,
    });
    expect(result.success).toBe(false);
  });

  it('rejects image with empty url in array', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: 100,
      categoryId: 'cat1',
      images: [{ url: '' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('adminProductSchema validation', () => {
  it('rejects missing name', () => {
    const result = adminProductSchema.safeParse({
      slug: 'test',
      price: 0,
      categoryId: 'c',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test',
      slug: 'test',
      price: -1,
      categoryId: 'c',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative stockQuantity', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test',
      slug: 'test',
      price: 0,
      categoryId: 'c',
      stockQuantity: -5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects fractional stockQuantity', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test',
      slug: 'test',
      price: 0,
      categoryId: 'c',
      stockQuantity: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid minimal product', () => {
    const result = adminProductSchema.safeParse({
      name: 'Test',
      slug: 'test',
      price: 0,
      categoryId: 'c',
    });
    expect(result.success).toBe(true);
  });
});

describe('adminOrderStatusSchema', () => {
  it('accepts all valid statuses', () => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    for (const status of statuses) {
      const result = adminOrderStatusSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const result = adminOrderStatusSchema.safeParse({ status: 'SHIPPED' });
    expect(result.success).toBe(true);
    const result2 = adminOrderStatusSchema.safeParse({ status: 'PAID' });
    expect(result2.success).toBe(false);
  });

  it('rejects missing status', () => {
    const result = adminOrderStatusSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
