import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/Button';
import { User, MapPin, CreditCard, Bell, Settings, LogOut, ChevronRight, History } from 'lucide-react';
import { FORMATTER } from '../constants';

export const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-brand-orange" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
        <p className="text-gray-500 mb-8">Log in or sign up to save your addresses, track orders, and get personalized recommendations.</p>
        <Button fullWidth onClick={() => navigate('/login')} className="mb-3">Log In / Sign Up</Button>
      </div>
    );
  }

  const menuItems = [
    { icon: History, label: 'Order History', sub: 'Reorder your favorites' },
    { icon: MapPin, label: 'Delivery Addresses', sub: `${user.addresses.length} saved locations` },
    { icon: CreditCard, label: 'Payment Methods', sub: 'M-Pesa, Visa •••• 4242' },
    { icon: Bell, label: 'Notifications', sub: 'Offers & Order updates' },
    { icon: Settings, label: 'Settings', sub: 'Privacy, Security' },
  ];

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header Profile Card */}
      <div className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm mb-6">
        <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-200">
                {user.name.charAt(0)}
            </div>
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
                <div className="mt-2 inline-flex bg-orange-50 text-brand-orange px-3 py-1 rounded-full text-xs font-bold">
                    Gold Member
                </div>
            </div>
        </div>
        
        <div className="flex space-x-3">
            <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Orders</p>
                <p className="text-xl font-extrabold text-gray-900">12</p>
            </div>
            <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Saved</p>
                <p className="text-xl font-extrabold text-gray-900">{FORMATTER.format(4500)}</p>
            </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-4 space-y-4">
        {menuItems.map((item, idx) => (
            <button key={idx} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-700">
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 font-medium">{item.sub}</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
        ))}

        <button 
            onClick={logout}
            className="w-full bg-white p-4 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-red-500 font-bold mt-8 active:scale-[0.98] transition-transform"
        >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
        </button>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8 font-medium">CityEats v1.0.4 (Kenya)</p>
    </div>
  );
};