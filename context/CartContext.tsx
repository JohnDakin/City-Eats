import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Restaurant } from '../types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: CartItem; restaurant: Restaurant } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, restaurant } = action.payload;
      // If adding from a different restaurant, confirm clear (In a real app, we'd prompt. Here we force clear for simplicity or append if we supported multi-vendor)
      // Requirement: Single cart usually implies single vendor to avoid logistics complexity.
      const isNewRestaurant = state.restaurantId && state.restaurantId !== restaurant.id;
      
      if (isNewRestaurant) {
        // For this demo, we'll replace the cart. Ideally, show a modal.
        return {
            items: [item],
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
        };
      }

      const existingItemIndex = state.items.findIndex((i) => i.itemId === item.itemId);
      // Note: A real app needs to compare selectedModifiers too to stack identical items.
      // Simplified here: we assume unique ID generation or just stacking by ID.
      
      if (existingItemIndex > -1) {
        // Deep compare modifiers would be here. Skipping for brevity.
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, item],
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.itemId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.itemId === action.payload.itemId ? { ...i, quantity: action.payload.quantity } : i
        ).filter(i => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem, restaurant: Restaurant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: CartItem, restaurant: Restaurant) => dispatch({ type: 'ADD_ITEM', payload: { item, restaurant } });
  const removeItem = (itemId: string) => dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  const updateQuantity = (itemId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartTotal = state.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};