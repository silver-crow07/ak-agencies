import { describe, it, expect } from 'vitest';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

function canTransition(from: string, to: string): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return !!allowed && allowed.includes(to);
}

describe('Order status transitions', () => {
  it('PENDING -> CONFIRMED is valid', () => {
    expect(canTransition('PENDING', 'CONFIRMED')).toBe(true);
  });

  it('PENDING -> CANCELLED is valid', () => {
    expect(canTransition('PENDING', 'CANCELLED')).toBe(true);
  });

  it('PENDING -> SHIPPED is invalid (skips steps)', () => {
    expect(canTransition('PENDING', 'SHIPPED')).toBe(false);
  });

  it('CONFIRMED -> PROCESSING is valid', () => {
    expect(canTransition('CONFIRMED', 'PROCESSING')).toBe(true);
  });

  it('CONFIRMED -> CANCELLED is valid', () => {
    expect(canTransition('CONFIRMED', 'CANCELLED')).toBe(true);
  });

  it('CONFIRMED -> DELIVERED is invalid (skips steps)', () => {
    expect(canTransition('CONFIRMED', 'DELIVERED')).toBe(false);
  });

  it('PROCESSING -> SHIPPED is valid', () => {
    expect(canTransition('PROCESSING', 'SHIPPED')).toBe(true);
  });

  it('PROCESSING -> CANCELLED is valid', () => {
    expect(canTransition('PROCESSING', 'CANCELLED')).toBe(true);
  });

  it('SHIPPED -> DELIVERED is valid', () => {
    expect(canTransition('SHIPPED', 'DELIVERED')).toBe(true);
  });

  it('SHIPPED -> CANCELLED is invalid', () => {
    expect(canTransition('SHIPPED', 'CANCELLED')).toBe(false);
  });

  it('DELIVERED -> any is invalid (terminal state)', () => {
    expect(canTransition('DELIVERED', 'SHIPPED')).toBe(false);
    expect(canTransition('DELIVERED', 'CANCELLED')).toBe(false);
  });

  it('CANCELLED -> any is invalid (terminal state)', () => {
    expect(canTransition('CANCELLED', 'PENDING')).toBe(false);
    expect(canTransition('CANCELLED', 'CONFIRMED')).toBe(false);
  });

  it('unknown status -> any is invalid', () => {
    expect(canTransition('UNKNOWN', 'CONFIRMED')).toBe(false);
  });
});
