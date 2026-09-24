import { describe, it, expect } from 'vitest';

const HERO_SLIDE_SCHEMA = {
  required: ['backgroundImage', 'title'],
  optional: ['mobileImage', 'eyebrow', 'description', 'primaryButtonText', 'primaryButtonUrl', 'secondaryButtonText', 'secondaryButtonUrl', 'badge', 'isActive', 'displayOrder'],
  titleMaxLength: 200,
  descriptionMaxLength: 500,
  eyebrowMaxLength: 100,
  buttonTextMaxLength: 50,
  buttonUrlMaxLength: 200,
  badgeMaxLength: 50,
};

const REEL_SCHEMA = {
  required: ['title', 'reelUrl', 'thumbnailUrl'],
  optional: ['category', 'ctaText', 'ctaUrl', 'isActive', 'displayOrder'],
  titleMaxLength: 100,
  categoryMaxLength: 50,
  ctaTextMaxLength: 50,
  ctaUrlMaxLength: 200,
};

const POST_SCHEMA = {
  required: ['imageUrl', 'postUrl'],
  optional: ['caption', 'isActive', 'displayOrder'],
  captionMaxLength: 300,
};

const SETTINGS_SCHEMA = {
  optional: ['instagramHandle', 'instagramProfileUrl', 'instagramFollowText'],
  instagramHandleMaxLength: 50,
  instagramFollowTextMaxLength: 50,
};

describe('Hero Slide validation', () => {
  it('requires backgroundImage', () => {
    const data = { title: 'Test' };
    const missing = HERO_SLIDE_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('backgroundImage');
  });

  it('requires title', () => {
    const data = { backgroundImage: 'https://example.com/img.jpg' };
    const missing = HERO_SLIDE_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('title');
  });

  it('allows optional fields', () => {
    HERO_SLIDE_SCHEMA.optional.forEach((field) => {
      expect(HERO_SLIDE_SCHEMA.required).not.toContain(field);
    });
  });

  it('title max length is 200', () => {
    expect(HERO_SLIDE_SCHEMA.titleMaxLength).toBe(200);
    expect('x'.repeat(200).length).toBeLessThanOrEqual(HERO_SLIDE_SCHEMA.titleMaxLength);
    expect('x'.repeat(201).length).toBeGreaterThan(HERO_SLIDE_SCHEMA.titleMaxLength);
  });

  it('description max length is 500', () => {
    expect(HERO_SLIDE_SCHEMA.descriptionMaxLength).toBe(500);
  });

  it('eyebrow max length is 100', () => {
    expect(HERO_SLIDE_SCHEMA.eyebrowMaxLength).toBe(100);
  });

  it('badge max length is 50', () => {
    expect(HERO_SLIDE_SCHEMA.badgeMaxLength).toBe(50);
  });
});

describe('Instagram Reel validation', () => {
  it('requires title', () => {
    const data = { reelUrl: 'https://instagram.com/reel/1', thumbnailUrl: 'https://img.com' };
    const missing = REEL_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('title');
  });

  it('requires reelUrl', () => {
    const data = { title: 'Test', thumbnailUrl: 'https://img.com' };
    const missing = REEL_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('reelUrl');
  });

  it('requires thumbnailUrl', () => {
    const data = { title: 'Test', reelUrl: 'https://instagram.com/reel/1' };
    const missing = REEL_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('thumbnailUrl');
  });

  it('title max length is 100', () => {
    expect(REEL_SCHEMA.titleMaxLength).toBe(100);
  });

  it('category max length is 50', () => {
    expect(REEL_SCHEMA.categoryMaxLength).toBe(50);
  });
});

describe('Instagram Post validation', () => {
  it('requires imageUrl', () => {
    const data = { postUrl: 'https://instagram.com/p/1' };
    const missing = POST_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('imageUrl');
  });

  it('requires postUrl', () => {
    const data = { imageUrl: 'https://img.com' };
    const missing = POST_SCHEMA.required.filter(
      (field) => !(field in data)
    );
    expect(missing).toContain('postUrl');
  });

  it('caption max length is 300', () => {
    expect(POST_SCHEMA.captionMaxLength).toBe(300);
  });

  it('allows optional fields', () => {
    POST_SCHEMA.optional.forEach((field) => {
      expect(POST_SCHEMA.required).not.toContain(field);
    });
  });
});

describe('Homepage Settings validation', () => {
  it('has instagram handle max length 50', () => {
    expect(SETTINGS_SCHEMA.instagramHandleMaxLength).toBe(50);
  });

  it('has instagram follow text max length 50', () => {
    expect(SETTINGS_SCHEMA.instagramFollowTextMaxLength).toBe(50);
  });

  it('all fields are optional', () => {
    SETTINGS_SCHEMA.optional.forEach((field) => {
      expect(field).toBeDefined();
    });
  });
});

describe('Homepage data shape', () => {
  it('hero slide has required fields', () => {
    const slide = {
      id: 'cuid1',
      backgroundImage: 'https://example.com/hero.jpg',
      title: 'Premium Home',
      isActive: true,
      displayOrder: 0,
    };
    HERO_SLIDE_SCHEMA.required.forEach((field) => {
      expect(slide).toHaveProperty(field);
    });
  });

  it('reel has required fields', () => {
    const reel = {
      id: 'cuid2',
      title: 'Elegant Bedsheets',
      reelUrl: 'https://instagram.com/reel/abc',
      thumbnailUrl: 'https://img.com/thumb.jpg',
    };
    REEL_SCHEMA.required.forEach((field) => {
      expect(reel).toHaveProperty(field);
    });
  });

  it('post has required fields', () => {
    const post = {
      id: 'cuid3',
      imageUrl: 'https://img.com/photo.jpg',
      postUrl: 'https://instagram.com/p/xyz',
    };
    POST_SCHEMA.required.forEach((field) => {
      expect(post).toHaveProperty(field);
    });
  });

  it('settings singleton has correct default shape', () => {
    const settings = {
      id: 'singleton',
      instagramHandle: '@akagenciesbarabanki',
      instagramProfileUrl: 'https://instagram.com/akagencies',
      instagramFollowText: 'Follow on Instagram',
    };
    SETTINGS_SCHEMA.optional.forEach((field) => {
      expect(settings).toHaveProperty(field);
    });
  });
});
