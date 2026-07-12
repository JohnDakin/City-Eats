import React from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Routes where we show the bottom nav
  const showNav = ['/', '/orders', '/profile'].includes(location.pathname);
  // Routes where we show a back button header
  const isDetailPage = location.pathname.includes('/restaurant/') || location.pathname.includes('/checkout') || location.pathname.includes('/tracking');

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative pb-20">
        
        {isDetailPage && (
          <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="ml-2 font-semibold text-lg truncate">
                {location.pathname.includes('checkout') ? 'Checkout' : 
                 location.pathname.includes('tracking') ? 'Order Status' : ''}
            </h1>
          </header>
        )}

        <main className="animate-fade-in">
          {children}
        </main>

        {showNav && <BottomNav />}
      </div>
    </div>
  );
};
