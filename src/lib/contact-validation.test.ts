import { describe, it, expect } from 'vitest';
import {
  contactSubmissionSchema,
  adminContactStatusSchema,
} from '@/lib/validations';

describe('contactSubmissionSchema', () => {
  const validSubmission = {
    name: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya@example.com',
    subject: 'Product inquiry',
    message: 'I would like to know more about your curtain collection.',
  };

  it('accepts a valid submission', () => {
    const result = contactSubmissionSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it('accepts submission without email', () => {
    const { email: _, ...noEmail } = validSubmission;
    const result = contactSubmissionSchema.safeParse(noEmail);
    expect(result.success).toBe(true);
  });

  it('accepts submission with +91 phone prefix', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: '+919876543210',
    });
    expect(result.success).toBe(true);
  });

  it('accepts phone with spaces and dashes', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: '98765 43210',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const { name: _, ...noName } = validSubmission;
    const result = contactSubmissionSchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only name', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing phone', () => {
    const { phone: _, ...noPhone } = validSubmission;
    const result = contactSubmissionSchema.safeParse(noPhone);
    expect(result.success).toBe(false);
  });

  it('rejects empty phone', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only phone', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone (too short)', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone (letters)', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: 'abcdefghij',
    });
    expect(result.success).toBe(false);
  });

  it('rejects phone not starting with 6-9 (Indian)', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      phone: '5123456789',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing subject', () => {
    const { subject: _, ...noSubject } = validSubmission;
    const result = contactSubmissionSchema.safeParse(noSubject);
    expect(result.success).toBe(false);
  });

  it('rejects empty subject', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      subject: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only subject', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      subject: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing message', () => {
    const { message: _, ...noMessage } = validSubmission;
    const result = contactSubmissionSchema.safeParse(noMessage);
    expect(result.success).toBe(false);
  });

  it('rejects empty message', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only message', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      message: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects email without domain', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      email: 'user@',
    });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from fields', () => {
    const result = contactSubmissionSchema.safeParse({
      name: '  Priya Sharma  ',
      phone: '  9876543210  ',
      email: '  priya@example.com  ',
      subject:  '  Product inquiry  ',
      message: '  Hello there  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Priya Sharma');
      expect(result.data.phone).toBe('9876543210');
      expect(result.data.email).toBe('priya@example.com');
      expect(result.data.subject).toBe('Product inquiry');
      expect(result.data.message).toBe('Hello there');
    }
  });

  it('rejects name exceeding max length', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects message exceeding max length', () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      message: 'A'.repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe('adminContactStatusSchema', () => {
  it('accepts all valid statuses', () => {
    const statuses = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'];
    for (const status of statuses) {
      const result = adminContactStatusSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const result = adminContactStatusSchema.safeParse({ status: 'PENDING' });
    expect(result.success).toBe(false);
  });

  it('rejects missing status', () => {
    const result = adminContactStatusSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
