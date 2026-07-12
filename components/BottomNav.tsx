import React from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-brand-orange' : 'text-gray-500'}`}
          >
            <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
