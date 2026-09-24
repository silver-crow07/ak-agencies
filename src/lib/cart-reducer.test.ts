import { describe, it, expect } from 'vitest';
import { Product, CartItem } from '@/types';

// ─── Extracted from store/index.tsx for testability ───────────

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number; color?: string; size?: string; fabric?: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; items: CartItem[]; total: number; itemCount: number };

export function computeTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { items: action.items, total: action.total, itemCount: action.itemCount };
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.product.id &&
          item.selectedColor === action.color &&
          item.selectedSize === action.size &&
          item.selectedFabric === action.fabric
      );
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + (action.quantity || 1) } : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity || 1,
            selectedColor: action.color,
            selectedSize: action.size,
            selectedFabric: action.fabric,
          },
        ];
      }
      return { items: newItems, ...computeTotals(newItems) };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.product.id !== action.productId);
      return { items: newItems, ...computeTotals(newItems) };
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter((item) => item.product.id !== action.productId);
        return { items: newItems, ...computeTotals(newItems) };
      }
      const newItems = state.items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item
      );
      return { items: newItems, ...computeTotals(newItems) };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    default:
      return state;
  }
}

// ─── Test fixtures ────────────────────────────────────────────

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Silk Curtain',
    slug: 'silk-curtain',
    category: 'Curtains',
    categorySlug: 'curtains',
    price: 1500,
    description: 'Premium silk curtain',
    shortDescription: 'Silk curtain',
    image: '/images/test.jpg',
    rating: 4.5,
    reviewCount: 10,
    inStock: true,
    ...overrides,
  };
}

const emptyState: CartState = { items: [], total: 0, itemCount: 0 };

// ─── Tests ────────────────────────────────────────────────────

describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('adds a new item to an empty cart', () => {
      const product = makeProduct();
      const result = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product.id).toBe('prod-1');
      expect(result.items[0].quantity).toBe(1);
      expect(result.total).toBe(1500);
      expect(result.itemCount).toBe(1);
    });

    it('increments quantity for the same product (same options)', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1 });
      state = cartReducer(state, { type: 'ADD_ITEM', product, quantity: 2 });

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
      expect(state.total).toBe(4500);
      expect(state.itemCount).toBe(3);
    });

    it('creates separate lines for same product with different color', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1, color: 'Red' });
      state = cartReducer(state, { type: 'ADD_ITEM', product, quantity: 1, color: 'Blue' });

      expect(state.items).toHaveLength(2);
      expect(state.items[0].selectedColor).toBe('Red');
      expect(state.items[1].selectedColor).toBe('Blue');
      expect(state.itemCount).toBe(2);
    });

    it('creates separate lines for same product with different size', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1, size: 'L' });
      state = cartReducer(state, { type: 'ADD_ITEM', product, quantity: 1, size: 'XL' });

      expect(state.items).toHaveLength(2);
      expect(state.items[0].selectedSize).toBe('L');
      expect(state.items[1].selectedSize).toBe('XL');
    });

    it('increments quantity for same product+color+size+fabric combo', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1, color: 'Red', size: 'L', fabric: 'Cotton' });
      state = cartReducer(state, { type: 'ADD_ITEM', product, quantity: 3, color: 'Red', size: 'L', fabric: 'Cotton' });

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(4);
    });

    it('defaults quantity to 1 when not provided', () => {
      const product = makeProduct();
      const result = cartReducer(emptyState, { type: 'ADD_ITEM', product });

      expect(result.items[0].quantity).toBe(1);
    });
  });

  describe('REMOVE_ITEM', () => {
    it('removes the correct item', () => {
      const p1 = makeProduct({ id: 'p1', price: 100 });
      const p2 = makeProduct({ id: 'p2', price: 200 });
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product: p1, quantity: 2 });
      state = cartReducer(state, { type: 'ADD_ITEM', product: p2, quantity: 1 });

      state = cartReducer(state, { type: 'REMOVE_ITEM', productId: 'p1' });

      expect(state.items).toHaveLength(1);
      expect(state.items[0].product.id).toBe('p2');
      expect(state.total).toBe(200);
      expect(state.itemCount).toBe(1);
    });

    it('handles removing from empty cart gracefully', () => {
      const result = cartReducer(emptyState, { type: 'REMOVE_ITEM', productId: 'nonexistent' });
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.itemCount).toBe(0);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('updates quantity for the correct item', () => {
      const product = makeProduct({ price: 500 });
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1 });

      state = cartReducer(state, { type: 'UPDATE_QUANTITY', productId: 'prod-1', quantity: 5 });

      expect(state.items[0].quantity).toBe(5);
      expect(state.total).toBe(2500);
      expect(state.itemCount).toBe(5);
    });

    it('removes item when quantity is set to 0', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 3 });

      state = cartReducer(state, { type: 'UPDATE_QUANTITY', productId: 'prod-1', quantity: 0 });

      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
    });

    it('removes item when quantity is negative', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 1 });

      state = cartReducer(state, { type: 'UPDATE_QUANTITY', productId: 'prod-1', quantity: -1 });

      expect(state.items).toHaveLength(0);
    });
  });

  describe('CLEAR_CART', () => {
    it('empties the entire cart', () => {
      const product = makeProduct();
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product, quantity: 5 });

      state = cartReducer(state, { type: 'CLEAR_CART' });

      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
      expect(state.itemCount).toBe(0);
    });
  });

  describe('SET_CART', () => {
    it('replaces cart state entirely', () => {
      const p1 = makeProduct({ id: 'p1', price: 100 });
      let state = cartReducer(emptyState, { type: 'ADD_ITEM', product: p1, quantity: 1 });

      const newItems: CartItem[] = [
        { product: makeProduct({ id: 'new-1', price: 500 }), quantity: 2 },
        { product: makeProduct({ id: 'new-2', price: 750 }), quantity: 1 },
      ];
      state = cartReducer(state, { type: 'SET_CART', items: newItems, total: 1750, itemCount: 3 });

      expect(state.items).toHaveLength(2);
      expect(state.total).toBe(1750);
      expect(state.itemCount).toBe(3);
      expect(state.items[0].product.id).toBe('new-1');
    });
  });

  describe('computeTotals', () => {
    it('calculates totals correctly for multiple items', () => {
      const items: CartItem[] = [
        { product: makeProduct({ price: 100 }), quantity: 3 },
        { product: makeProduct({ id: 'p2', price: 250 }), quantity: 2 },
      ];

      const { total, itemCount } = computeTotals(items);

      expect(total).toBe(800); // 300 + 500
      expect(itemCount).toBe(5);
    });

    it('returns 0 for empty cart', () => {
      const { total, itemCount } = computeTotals([]);
      expect(total).toBe(0);
      expect(itemCount).toBe(0);
    });
  });
});

describe('API cart item mapping', () => {
  // Replicates the mapApiItems logic from the store
  type ApiCartItem = {
    productId: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    quantity: number;
    image: string;
    inStock: boolean;
    category: string;
    categorySlug: string;
  };

  function mapApiItems(apiItems: ApiCartItem[]): CartItem[] {
    return apiItems.map((item) => ({
      product: {
        id: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        originalPrice: item.compareAtPrice,
        description: '',
        shortDescription: '',
        image: item.image,
        category: item.category,
        categorySlug: item.categorySlug,
        rating: 0,
        reviewCount: 0,
        inStock: item.inStock,
      },
      quantity: item.quantity,
    }));
  }

  it('maps API cart items to CartItem[] correctly', () => {
    const apiItems: ApiCartItem[] = [
      {
        productId: 'abc-123',
        name: 'Cotton Bedsheet',
        slug: 'cotton-bedsheet',
        price: 1200,
        compareAtPrice: 1500,
        quantity: 2,
        image: '/images/bedsheet.jpg',
        inStock: true,
        category: 'Bedsheets',
        categorySlug: 'bedsheets',
      },
    ];

    const result = mapApiItems(apiItems);

    expect(result).toHaveLength(1);
    expect(result[0].product.id).toBe('abc-123');
    expect(result[0].product.price).toBe(1200);
    expect(result[0].product.originalPrice).toBe(1500);
    expect(result[0].quantity).toBe(2);
    expect(result[0].product.inStock).toBe(true);
  });

  it('handles missing compareAtPrice', () => {
    const apiItems: ApiCartItem[] = [
      {
        productId: 'xyz',
        name: 'Towel',
        slug: 'towel',
        price: 500,
        quantity: 1,
        image: '/images/towel.jpg',
        inStock: true,
        category: 'Towels',
        categorySlug: 'towels',
      },
    ];

    const result = mapApiItems(apiItems);
    expect(result[0].product.originalPrice).toBeUndefined();
  });
});
