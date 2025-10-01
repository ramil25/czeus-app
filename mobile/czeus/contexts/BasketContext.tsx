import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BasketItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  points: number;
}

interface BasketContextType {
  basketItems: BasketItem[];
  addToBasket: (item: Omit<BasketItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeFromBasket: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearBasket: () => Promise<void>;
  removeSelectedItems: (ids: number[]) => Promise<void>;
  loading: boolean;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = '@czeus_basket';

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load basket from AsyncStorage on mount
  useEffect(() => {
    loadBasket();
  }, []);

  const loadBasket = async () => {
    try {
      const storedBasket = await AsyncStorage.getItem(BASKET_STORAGE_KEY);
      if (storedBasket) {
        setBasketItems(JSON.parse(storedBasket));
      }
    } catch (error) {
      console.error('Error loading basket:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBasket = async (items: BasketItem[]) => {
    try {
      await AsyncStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
      setBasketItems(items);
    } catch (error) {
      console.error('Error saving basket:', error);
      throw error;
    }
  };

  const addToBasket = async (item: Omit<BasketItem, 'quantity'> & { quantity?: number }) => {
    const newItems = [...basketItems];
    const existingIndex = newItems.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      // Update existing item quantity
      newItems[existingIndex].quantity += item.quantity || 1;
    } else {
      // Add new item with auto-incremented id
      const maxId = newItems.length > 0 ? Math.max(...newItems.map(i => i.id)) : 0;
      newItems.push({
        id: maxId + 1,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        points: item.points,
      });
    }

    await saveBasket(newItems);
  };

  const removeFromBasket = async (id: number) => {
    const newItems = basketItems.filter(item => item.id !== id);
    await saveBasket(newItems);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromBasket(id);
      return;
    }

    const newItems = basketItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    await saveBasket(newItems);
  };

  const clearBasket = async () => {
    await saveBasket([]);
  };

  const removeSelectedItems = async (ids: number[]) => {
    const newItems = basketItems.filter(item => !ids.includes(item.id));
    await saveBasket(newItems);
  };

  return (
    <BasketContext.Provider
      value={{
        basketItems,
        addToBasket,
        removeFromBasket,
        updateQuantity,
        clearBasket,
        removeSelectedItems,
        loading,
      }}
    >
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
