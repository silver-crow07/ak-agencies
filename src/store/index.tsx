'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Product, CartItem, WishlistItem } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number; color?: string; size?: string; fabric?: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
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
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, total, itemCount };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.product.id !== action.productId);
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, total, itemCount };
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter((item) => item.product.id !== action.productId);
        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        return { items: newItems, total, itemCount };
      }
      const newItems = state.items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, total, itemCount };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number, color?: string, size?: string, fabric?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  const addItem = useCallback(
    (product: Product, quantity?: number, color?: string, size?: string, fabric?: string) => {
      dispatch({ type: 'ADD_ITEM', product, quantity, color, size, fabric });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = state.items.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, getItemQuantity }}>
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
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function wishlistReducer(state: WishlistItem[], action: { type: 'ADD' | 'REMOVE'; product?: Product; productId?: string }): WishlistItem[] {
  switch (action.type) {
    case 'ADD': {
      if (!action.product) return state;
      if (state.some((item) => item.product.id === action.product!.id)) return state;
      return [...state, { product: action.product }];
    }
    case 'REMOVE':
      return state.filter((item) => item.product.id !== action.productId);
    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(wishlistReducer, []);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD', product });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE', productId });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist }}>
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
