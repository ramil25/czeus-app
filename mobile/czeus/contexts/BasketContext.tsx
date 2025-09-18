import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BasketItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  size: string;
  image?: string;
}

interface BasketContextType {
  items: BasketItem[];
  addToBasket: (item: Omit<BasketItem, 'quantity' | 'selected'>) => void;
  removeFromBasket: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleItemSelection: (id: number) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  clearBasket: () => void;
  getSelectedItems: () => BasketItem[];
  getTotalPrice: () => number;
  getSelectedTotalPrice: () => number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = '@czeus_basket';

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  // Load basket from storage on app start
  useEffect(() => {
    loadBasketFromStorage();
  }, []);

  // Save basket to storage whenever items change
  useEffect(() => {
    saveBasketToStorage();
  }, [items]);

  const loadBasketFromStorage = async () => {
    try {
      const savedBasket = await AsyncStorage.getItem(BASKET_STORAGE_KEY);
      if (savedBasket) {
        const parsedBasket = JSON.parse(savedBasket);
        setItems(parsedBasket);
      }
    } catch (error) {
      console.error('Error loading basket from storage:', error);
    }
  };

  const saveBasketToStorage = async () => {
    try {
      await AsyncStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving basket to storage:', error);
    }
  };

  const addToBasket = (newItem: Omit<BasketItem, 'quantity' | 'selected'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with default quantity 1 and selected true
        return [...prevItems, { ...newItem, quantity: 1, selected: true }];
      }
    });
  };

  const removeFromBasket = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(id);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const toggleItemSelection = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAllItems = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: true }))
    );
  };

  const deselectAllItems = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: false }))
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const getSelectedItems = (): BasketItem[] => {
    return items.filter(item => item.selected);
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedTotalPrice = (): number => {
    return items
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const contextValue: BasketContextType = {
    items,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    clearBasket,
    getSelectedItems,
    getTotalPrice,
    getSelectedTotalPrice,
  };

  return (
    <BasketContext.Provider value={contextValue}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}