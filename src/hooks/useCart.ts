import { useState, useEffect, useCallback } from 'react';
import type { CartState, Product } from '../types';

const CART_STORAGE_KEY = 'shopping-cart';
const TAX_RATE = 0.08; 
const SHIPPING_COST = 9.99;

const initialCartState: CartState = {
  items: [],
  discountCode: '',
  discountAmount: 0,
  totals: {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  },
  isLoading: false,
  errors: [],
};

export const useCart = () => {
  const [cart, setCart] = useState<CartState>(initialCartState);
  const [undoStack, setUndoStack] = useState<CartState[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(prev => ({
          ...prev,
          items: parsedCart.items || [],
          discountCode: parsedCart.discountCode || '',
          discountAmount: parsedCart.discountAmount || 0,
        }));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Calculate totals whenever cart changes
  useEffect(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const shipping = cart.items.length > 0 ? SHIPPING_COST : 0;
    const total = subtotal + tax + shipping - cart.discountAmount;

    setCart(prev => ({
      ...prev,
      totals: {
        subtotal,
        tax,
        shipping,
        total: Math.max(0, total),
      },
    }));
  }, [cart.items, cart.discountAmount]);

  useEffect(() => {
    const cartToSave = {
      items: cart.items,
      discountCode: cart.discountCode,
      discountAmount: cart.discountAmount,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
  }, [cart.items, cart.discountCode, cart.discountAmount]);

  const saveToUndoStack = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-9), cart]); 
  }, [cart]);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    saveToUndoStack();
    setCart(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setCart(prev => {
        const existingItem = prev.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            ...prev,
            items: prev.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isLoading: false,
          };
        } else {
          return {
            ...prev,
            items: [...prev.items, {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.image,
            }],
            isLoading: false,
          };
        }
      });
    } catch (error) {
      setCart(prev => ({
        ...prev,
        isLoading: false,
        errors: ['Failed to add item to cart'],
      }));
    }
  }, [saveToUndoStack]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    saveToUndoStack();
    setCart(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      setCart(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ),
        isLoading: false,
      }));
    } catch (error) {
      setCart(prev => ({
        ...prev,
        isLoading: false,
        errors: ['Failed to update quantity'],
      }));
    }
  }, [saveToUndoStack]);

  const removeItem = useCallback(async (itemId: string) => {
    saveToUndoStack();
    setCart(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId),
        isLoading: false,
      }));
    } catch (error) {
      setCart(prev => ({
        ...prev,
        isLoading: false,
        errors: ['Failed to remove item'],
      }));
    }
  }, [saveToUndoStack]);

  const applyDiscount = useCallback(async (code: string) => {
    setCart(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock discount validation
      const discounts: Record<string, number> = {
        'SAVE10': 10,
        'WELCOME20': 20,
        'STUDENT15': 15,
      };

      const discountAmount = discounts[code.toUpperCase()];

      if (discountAmount) {
        setCart(prev => ({
          ...prev,
          discountCode: code.toUpperCase(),
          discountAmount,
          isLoading: false,
        }));
      } else {
        setCart(prev => ({
          ...prev,
          isLoading: false,
          errors: ['Invalid discount code'],
        }));
      }
    } catch (error) {
      setCart(prev => ({
        ...prev,
        isLoading: false,
        errors: ['Failed to apply discount'],
      }));
    }
  }, []);

  const clearCart = useCallback(() => {
    saveToUndoStack();
    setCart(initialCartState);
  }, [saveToUndoStack]);

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setCart(previousState);
      setUndoStack(prev => prev.slice(0, -1));
    }
  }, [undoStack]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    applyDiscount,
    clearCart,
    undo,
    canUndo: undoStack.length > 0,
  };
};