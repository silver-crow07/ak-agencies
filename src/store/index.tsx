'use client';

import React, { createContext, useContext, useState, useEffect, useReducer, useCallback, ReactNode } from 'react';
import { Product, CartItem, WishlistItem } from '@/types';

const CART_STORAGE_KEY = 'ak_guest_cart';

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

function computeTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

function cartReducer(state: CartState, action: CartAction): CartState {
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

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number, color?: string, size?: string, fabric?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  loaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // localStorage full or unavailable — silent
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fetch cart from API on mount if authenticated; otherwise load guest cart from localStorage
  useEffect(() => {
    async function initCart() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (!meData.success) {
          // Guest: restore from localStorage
          const guestItems = loadGuestCart();
          if (guestItems.length > 0) {
            dispatch({ type: 'SET_CART', items: guestItems, ...computeTotals(guestItems) });
          }
          setLoaded(true);
          return;
        }

        setAuthenticated(true);

        // Fetch server cart
        const res = await fetch('/api/account/cart');
        const data = await res.json();
        if (data.success && data.data) {
          const apiItems = mapApiItems(data.data.items);
          dispatch({ type: 'SET_CART', items: apiItems, total: data.data.subtotal, itemCount: data.data.itemCount });

          // Merge any guest items that aren't already in the server cart
          const guestItems = loadGuestCart();
          if (guestItems.length > 0) {
            const serverIds = new Set(apiItems.map((i) => i.product.id));
            const unsyncedItems = guestItems.filter((gi) => !serverIds.has(gi.product.id));
            for (const guestItem of unsyncedItems) {
              await fetch('/api/account/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: guestItem.product.id, quantity: guestItem.quantity }),
              });
            }
            // Re-fetch merged cart
            if (unsyncedItems.length > 0) {
              const mergedRes = await fetch('/api/account/cart');
              const mergedData = await mergedRes.json();
              if (mergedData.success && mergedData.data) {
                const mergedItems = mapApiItems(mergedData.data.items);
                dispatch({ type: 'SET_CART', items: mergedItems, total: mergedData.data.subtotal, itemCount: mergedData.data.itemCount });
              }
            }
            // Clear guest localStorage after merge
            saveGuestCart([]);
          }
        }
      } catch {
        // silent — stays empty
      } finally {
        setLoaded(true);
      }
    }
    initCart();
  }, []);

  const addItem = useCallback(
    async (product: Product, quantity?: number, color?: string, size?: string, fabric?: string) => {
      if (!authenticated) {
        // Guest: use local state + persist to localStorage
        dispatch({ type: 'ADD_ITEM', product, quantity, color, size, fabric });
        return;
      }

      // Optimistic local update
      dispatch({ type: 'ADD_ITEM', product, quantity, color, size, fabric });

      try {
        const res = await fetch('/api/account/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: quantity || 1 }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          // Sync with server state
          const apiItems = mapApiItems(data.data.items);
          dispatch({ type: 'SET_CART', items: apiItems, total: data.data.subtotal, itemCount: data.data.itemCount });
        }
      } catch {
        // Revert on network error
        dispatch({ type: 'REMOVE_ITEM', productId: product.id });
      }
    },
    [authenticated]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!authenticated) {
        dispatch({ type: 'REMOVE_ITEM', productId });
        return;
      }

      // Optimistic local update
      dispatch({ type: 'REMOVE_ITEM', productId });

      try {
        const res = await fetch(`/api/account/cart/items/${productId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success && data.data) {
          const apiItems = mapApiItems(data.data.items);
          dispatch({ type: 'SET_CART', items: apiItems, total: data.data.subtotal, itemCount: data.data.itemCount });
        }
      } catch {
        // Revert — re-fetch cart
        const listRes = await fetch('/api/account/cart');
        const listData = await listRes.json();
        if (listData.success && listData.data) {
          const apiItems = mapApiItems(listData.data.items);
          dispatch({ type: 'SET_CART', items: apiItems, total: listData.data.subtotal, itemCount: listData.data.itemCount });
        }
      }
    },
    [authenticated]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!authenticated) {
        dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
        return;
      }

      // Optimistic local update
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });

      try {
        const res = await fetch(`/api/account/cart/items/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const apiItems = mapApiItems(data.data.items);
          dispatch({ type: 'SET_CART', items: apiItems, total: data.data.subtotal, itemCount: data.data.itemCount });
        }
      } catch {
        // Revert — re-fetch cart
        const listRes = await fetch('/api/account/cart');
        const listData = await listRes.json();
        if (listData.success && listData.data) {
          const apiItems = mapApiItems(listData.data.items);
          dispatch({ type: 'SET_CART', items: apiItems, total: listData.data.subtotal, itemCount: listData.data.itemCount });
        }
      }
    },
    [authenticated]
  );

  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    saveGuestCart([]);

    if (authenticated) {
      try {
        await fetch('/api/account/cart', { method: 'DELETE' });
      } catch {
        // silent
      }
    }
  }, [authenticated]);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = state.items.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  // Persist guest cart to localStorage on every state change (only when not authenticated)
  useEffect(() => {
    if (!authenticated && loaded) {
      saveGuestCart(state.items);
    }
  }, [state.items, authenticated, loaded]);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, getItemQuantity, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch wishlist from API on mount
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (!meData.success) {
          setLoaded(true);
          return;
        }

        const res = await fetch('/api/account/wishlist');
        const data = await res.json();
        if (data.success && data.data) {
          setItems(data.data.map((item: { product: Product }) => ({ product: item.product })));
        }
      } catch {
        // silent — stays empty
      } finally {
        setLoaded(true);
      }
    }
    fetchWishlist();
  }, []);

  const addItem = useCallback(async (product: Product) => {
    // Optimistic local update
    setItems((prev) => {
      if (prev.some((item) => item.product.id === product.id)) return prev;
      return [...prev, { product }];
    });

    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setItems((prev) => prev.filter((item) => item.product.id !== product.id));
      }
    } catch {
      // Revert on network error
      setItems((prev) => prev.filter((item) => item.product.id !== product.id));
    }
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    // Optimistic local update
    setItems((prev) => prev.filter((item) => item.product.id !== productId));

    try {
      const res = await fetch(`/api/account/wishlist/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure — re-fetch to restore state
        const listRes = await fetch('/api/account/wishlist');
        const listData = await listRes.json();
        if (listData.success && listData.data) {
          setItems(listData.data.map((item: { product: Product }) => ({ product: item.product })));
        }
      }
    } catch {
      // Revert on network error — re-fetch
      const listRes = await fetch('/api/account/wishlist');
      const listData = await listRes.json();
      if (listData.success && listData.data) {
        setItems(listData.data.map((item: { product: Product }) => ({ product: item.product })));
      }
    }
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, loaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isMobileFilterOpen: boolean;
}

type UIAction =
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_MOBILE_FILTER' }
  | { type: 'CLOSE_ALL' };

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen, isSearchOpen: false, isCartOpen: false };
    case 'TOGGLE_SEARCH':
      return { ...state, isSearchOpen: !state.isSearchOpen, isMobileMenuOpen: false, isCartOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen, isMobileMenuOpen: false, isSearchOpen: false };
    case 'TOGGLE_MOBILE_FILTER':
      return { ...state, isMobileFilterOpen: !state.isMobileFilterOpen };
    case 'CLOSE_ALL':
      return { isMobileMenuOpen: false, isSearchOpen: false, isCartOpen: false, isMobileFilterOpen: false };
    default:
      return state;
  }
}

interface UIContextType {
  state: UIState;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  toggleCart: () => void;
  toggleMobileFilter: () => void;
  closeAll: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, {
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isCartOpen: false,
    isMobileFilterOpen: false,
  });

  const toggleMobileMenu = useCallback(() => dispatch({ type: 'TOGGLE_MOBILE_MENU' }), []);
  const toggleSearch = useCallback(() => dispatch({ type: 'TOGGLE_SEARCH' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const toggleMobileFilter = useCallback(() => dispatch({ type: 'TOGGLE_MOBILE_FILTER' }), []);
  const closeAll = useCallback(() => dispatch({ type: 'CLOSE_ALL' }), []);

  return (
    <UIContext.Provider value={{ state, toggleMobileMenu, toggleSearch, toggleCart, toggleMobileFilter, closeAll }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}
