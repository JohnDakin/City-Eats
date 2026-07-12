import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PAST_ORDERS } from '../constants';
import { Button } from '../components/ui/Button';
import { ShoppingBag, Repeat, Clock, Star, ChevronRight } from 'lucide-react';
import { FORMATTER } from '../constants';

export const Orders: React.FC = () => {
  const navigate = useNavigate();

  const handleReorder = (restaurantId: string) => {
    // In a real app, this would add items to cart. 
    // For now, we direct them to the restaurant page to choose again.
    navigate(`/restaurant/${restaurantId}`);
  };

  if (MOCK_PAST_ORDERS.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">No past orders</h2>
            <p className="text-gray-500 mt-2 mb-6">Looks like you haven't ordered anything yet.</p>
            <Button onClick={() => navigate('/')}>Find Food</Button>
        </div>
    );
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <div className="bg-white px-4 py-6 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-gray-900">Your Orders</h1>
      </div>

      <div className="p-4 space-y-4">
        {MOCK_PAST_ORDERS.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <img 
                    src={order.restaurantImage} 
                    alt={order.restaurantName} 
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                />
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{order.restaurantName}</h3>
                  <p className="text-xs text-gray-500 font-medium">{order.date}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                  {order.status}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl mb-4">
                <p className="text-sm text-gray-700 font-medium line-clamp-1">{order.itemSummary}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400 font-medium">Total</span>
                    <span className="text-sm font-bold text-gray-900">{FORMATTER.format(order.total)}</span>
                </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth 
                className="rounded-xl border-gray-200 text-gray-700"
              >
                Help
              </Button>
              <Button 
                onClick={() => handleReorder(order.restaurantId)}
                size="sm" 
                fullWidth 
                className="rounded-xl bg-brand-orange text-white flex items-center justify-center"
              >
                <Repeat className="w-4 h-4 mr-1.5" /> Reorder
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center py-4">
          <p className="text-xs text-gray-400">Only showing last 6 months</p>
      </div>
    </div>
  );
};