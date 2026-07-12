import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RESTAURANTS, FORMATTER } from '../constants';
import { Star, Clock, ArrowLeft, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const RestaurantDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  
  const restaurant = RESTAURANTS.find(r => r.id === id);

  if (!restaurant) return <div className="p-10 text-center text-gray-500">Restaurant not found</div>;

  // Group items by category
  const categories = useMemo(() => {
    const cats = new Set(restaurant.menu.map(i => i.category));
    return Array.from(cats);
  }, [restaurant]);

  const handleScrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getItemQuantity = (itemId: string) => {
      const item = cartState.items.find(i => i.itemId === itemId);
      return item ? item.quantity : 0;
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      {/* Hero Image */}
      <div className="h-64 w-full relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-brand-orange px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Featured</span>
             <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-xs font-medium flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {restaurant.deliveryTime}
             </span>
          </div>
          <h1 className="text-3xl font-extrabold shadow-black drop-shadow-sm mb-1">{restaurant.name}</h1>
          <p className="text-white/80 font-medium">{restaurant.cuisine.join(' • ')} • {restaurant.location}</p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex flex-col items-center">
          <span className="flex items-center font-bold text-xl text-gray-900">
            {restaurant.rating} <Star className="w-4 h-4 ml-1 fill-brand-orange text-brand-orange" />
          </span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">Rating</span>
        </div>
        <div className="w-px bg-gray-100 h-10"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-xl text-gray-900">{restaurant.deliveryTime}</span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">Delivery</span>
        </div>
        <div className="w-px bg-gray-100 h-10"></div>
         <div className="flex flex-col items-center">
          <span className="font-bold text-xl text-gray-900">{FORMATTER.format(restaurant.deliveryFee)}</span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">Fee</span>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-14 bg-white z-30 shadow-sm overflow-x-auto no-scrollbar flex px-4 py-3 space-x-2 border-b border-gray-100">
        {categories.map((cat, idx) => (
          <button 
            key={cat} 
            onClick={() => handleScrollToCategory(`cat-${idx}`)}
            className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 focus:bg-gray-900 focus:text-white transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="px-4 py-2 space-y-8">
        {categories.map((cat, idx) => (
          <div key={cat} id={`cat-${idx}`} className="scroll-mt-36 pt-6">
            <h3 className="font-extrabold text-xl text-gray-900 mb-4 flex items-center">
                {cat}
                <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{restaurant.menu.filter(i => i.category === cat).length}</span>
            </h3>
            <div className="space-y-6">
              {restaurant.menu.filter(i => i.category === cat).map(item => {
                const qty = getItemQuantity(item.id);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => item.isAvailable && navigate(`/restaurant/${restaurant.id}/item/${item.id}`)}
                    className={`flex justify-between items-start cursor-pointer border-b border-gray-50 pb-6 last:border-0 ${!item.isAvailable ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="flex-1 pr-4 py-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{item.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
                      <p className="font-bold text-gray-900">{FORMATTER.format(item.price)}</p>
                    </div>
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl shadow-sm bg-gray-100" />
                      {!item.isAvailable ? (
                           <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                               <span className="text-white font-bold text-xs uppercase border border-white px-2 py-1 rounded">Sold Out</span>
                           </div>
                      ) : (
                        <button className={`absolute -bottom-3 right-3 shadow-lg font-bold w-10 h-10 rounded-full flex items-center justify-center border transition-transform active:scale-90 ${qty > 0 ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-brand-orange border-gray-100'}`}>
                            {qty > 0 ? <span className="text-sm">{qty}</span> : <Plus className="w-5 h-5" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

       {/* Floating Cart */}
       {cartState.items.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full flex justify-center z-40 px-4 animate-fade-in-up">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-gray-900 text-white w-full max-w-md shadow-2xl shadow-gray-900/40 rounded-2xl p-4 flex justify-between items-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-brand-orange text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
                {cartState.items.reduce((a,b) => a + b.quantity, 0)}
              </div>
              <span className="font-semibold">View Cart</span>
            </div>
            <span className="font-bold text-lg">{FORMATTER.format(cartState.items.reduce((a,b) => a + (b.totalPrice*b.quantity), 0))}</span>
          </button>
        </div>
      )}
    </div>
  );
};