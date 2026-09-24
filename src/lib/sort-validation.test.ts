import { describe, it, expect } from 'vitest';

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'price', 'stockQuantity', 'updatedAt'] as const;
type AllowedSortField = (typeof ALLOWED_SORT_FIELDS)[number];

function parseSortParam(sort: string): { field: AllowedSortField; direction: 'asc' | 'desc' } {
  const [rawField, rawDirection] = sort.split('-');
  const field: AllowedSortField = ALLOWED_SORT_FIELDS.includes(rawField as AllowedSortField)
    ? (rawField as AllowedSortField)
    : 'createdAt';
  const direction = rawDirection === 'asc' ? 'asc' : 'desc';
  return { field, direction };
}

describe('parseSortParam', () => {
  it('parses valid sort "createdAt-desc"', () => {
    expect(parseSortParam('createdAt-desc')).toEqual({ field: 'createdAt', direction: 'desc' });
  });

  it('parses valid sort "name-asc"', () => {
    expect(parseSortParam('name-asc')).toEqual({ field: 'name', direction: 'asc' });
  });

  it('parses valid sort "price-asc"', () => {
    expect(parseSortParam('price-asc')).toEqual({ field: 'price', direction: 'asc' });
  });

  it('parses valid sort "stockQuantity-desc"', () => {
    expect(parseSortParam('stockQuantity-desc')).toEqual({ field: 'stockQuantity', direction: 'desc' });
  });

  it('falls back to createdAt for unknown field', () => {
    expect(parseSortParam('passwordHash-asc')).toEqual({ field: 'createdAt', direction: 'asc' });
  });

  it('falls back to desc for unknown direction', () => {
    expect(parseSortParam('name-random')).toEqual({ field: 'name', direction: 'desc' });
  });

  it('falls back to createdAt for completely invalid input', () => {
    expect(parseSortParam('')).toEqual({ field: 'createdAt', direction: 'desc' });
  });

  it('falls back for SQL injection attempt', () => {
    expect(parseSortParam('1=1--asc')).toEqual({ field: 'createdAt', direction: 'desc' });
  });

  it('handles sort string without direction', () => {
    expect(parseSortParam('name')).toEqual({ field: 'name', direction: 'desc' });
  });
});
