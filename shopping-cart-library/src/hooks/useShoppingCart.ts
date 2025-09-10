import { useState, useCallback, useMemo } from 'react';
import { CartItem, Cart } from '../types';

export interface UseShoppingCartReturn {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
}

export const useShoppingCart = (initialItems: CartItem[] = []): UseShoppingCartReturn => {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const cart = useMemo((): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
    };
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  }, []);

  const updateItem = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback((id: string) => {
    const item = items.find(item => item.id === id);
    return item ? item.quantity : 0;
  }, [items]);

  const isInCart = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  return {
    cart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemQuantity,
    isInCart,
  };
};

export default useShoppingCart;
