import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RestaurantDetails } from './pages/Restaurant';
import { ItemDetail } from './pages/ItemDetail';
import { Checkout } from './pages/Checkout';
import { Tracking } from './pages/Tracking';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <UserProvider>
      <CartProvider>
        <MemoryRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/restaurant/:id/item/:itemId" element={<ItemDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster position="bottom-center" />
        </MemoryRouter>
      </CartProvider>
    </UserProvider>
  );
};

export default App;