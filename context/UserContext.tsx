import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserAddress } from '../types';
import { MOCK_USER_ADDRESSES } from '../constants';
import toast from 'react-hot-toast';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: UserAddress) => void;
  // New Features
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  searchHistory: string[];
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load data from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cityeats_user');
    const storedFavs = localStorage.getItem('cityeats_favorites');
    const storedHistory = localStorage.getItem('cityeats_search_history');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Mock successful login
          const mockUser: UserProfile = {
            id: 'u_123',
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), // Fake name from email
            email: email,
            phone: '0712 345 678',
            addresses: MOCK_USER_ADDRESSES,
            joinedDate: new Date().toISOString(),
          };
          setUser(mockUser);
          localStorage.setItem('cityeats_user', JSON.stringify(mockUser));
          toast.success(`Welcome back, ${mockUser.name}!`);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: UserProfile = {
          id: `u_${Date.now()}`,
          name: name,
          email: email,
          phone: '',
          addresses: [],
          joinedDate: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('cityeats_user', JSON.stringify(newUser));
        toast.success('Account created successfully!');
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cityeats_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('cityeats_user', JSON.stringify(updatedUser));
      toast.success('Profile updated');
    }
  };

  const addAddress = (address: UserAddress) => {
      if (user) {
          const updatedAddresses = [...user.addresses, address];
          updateProfile({ addresses: updatedAddresses });
      }
  };

  // --- New Features Logic ---

  const toggleFavorite = (restaurantId: string) => {
    let newFavorites;
    if (favorites.includes(restaurantId)) {
      newFavorites = favorites.filter(id => id !== restaurantId);
      toast('Removed from favorites', { icon: '💔' });
    } else {
      newFavorites = [...favorites, restaurantId];
      toast('Added to favorites', { icon: '❤️' });
    }
    setFavorites(newFavorites);
    localStorage.setItem('cityeats_favorites', JSON.stringify(newFavorites));
  };

  const addSearchTerm = (term: string) => {
    if (!term.trim()) return;
    // Remove if exists, add to top, limit to 5
    const newHistory = [term, ...searchHistory.filter(t => t !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('cityeats_search_history', JSON.stringify(newHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('cityeats_search_history');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      updateProfile,
      addAddress,
      favorites,
      toggleFavorite,
      searchHistory,
      addSearchTerm,
      clearSearchHistory
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};