import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RESTAURANTS, FORMATTER } from '../constants';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const ItemDetail: React.FC = () => {
  const { id, itemId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const restaurant = RESTAURANTS.find(r => r.id === id);
  const item = restaurant?.menu.find(i => i.id === itemId);

  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<{[key: string]: any}>({});
  const [instructions, setInstructions] = useState('');

  if (!restaurant || !item) return null;

  const toggleModifier = (group: any, option: any) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [group.id]: option
    }));
  };

  const calculateTotal = () => {
    let total = item.price;
    Object.values(selectedModifiers).forEach((opt: any) => {
      total += opt.price;
    });
    return total;
  };

  const isValid = () => {
    if (!item.modifiers) return true;
    return item.modifiers.every(group => {
      if (group.required) return !!selectedModifiers[group.id];
      return true;
    });
  };

  const handleAddToCart = () => {
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      restaurantId: restaurant.id,
      selectedModifiers,
      specialInstructions: instructions,
      totalPrice: calculateTotal()
    }, restaurant);
    
    toast.success(`${item.name} added to cart!`, {
        icon: '😋',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    });
    navigate(-1);
  };

  const currentTotal = calculateTotal() * quantity;

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <div className="relative h-80">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent lg:hidden" />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      <div className="px-5 py-6 bg-white -mt-6 rounded-t-[2rem] relative z-10 shadow-sm min-h-[50vh]">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{item.name}</h1>
        <p className="text-gray-500 leading-relaxed mb-4 text-base">{item.description}</p>
        <div className="text-2xl font-bold text-brand-orange mb-8">{FORMATTER.format(item.price)}</div>

        <div className="h-px bg-gray-100 w-full mb-8"></div>

        {/* Modifiers */}
        {item.modifiers?.map(group => (
          <div key={group.id} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-gray-900">{group.name}</h3>
              {group.required && <span className="bg-brand-orange/10 text-brand-orange text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Required</span>}
            </div>
            <div className="space-y-3">
              {group.options.map(option => {
                const isSelected = selectedModifiers[group.id]?.id === option.id;
                return (
                  <label 
                    key={option.id} 
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? 'border-brand-orange bg-orange-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${isSelected ? 'border-brand-orange' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-brand-orange" />}
                      </div>
                      <input 
                        type="radio" 
                        name={group.id} 
                        className="hidden"
                        checked={isSelected}
                        onChange={() => toggleModifier(group, option)}
                      />
                      <span className={`font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{option.name}</span>
                    </div>
                    {option.price > 0 && <span className="text-gray-500 font-medium">+{FORMATTER.format(option.price)}</span>}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Special Instructions */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Special Instructions</h3>
          <textarea
            placeholder="e.g. No onions, extra napkins..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 h-32 focus:ring-2 focus:ring-brand-orange/20 text-gray-900 font-medium placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Quantity */}
        <div className="flex justify-center items-center space-x-8 mb-4">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <Minus className="w-6 h-6 stroke-[3px]" />
          </button>
          <span className="text-3xl font-extrabold w-12 text-center text-gray-900">{quantity}</span>
           <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 flex justify-center z-50">
        <div className="w-full max-w-md">
          <Button 
            fullWidth 
            size="lg" 
            disabled={!isValid()}
            onClick={handleAddToCart}
            className="flex justify-between items-center rounded-2xl h-14 text-lg shadow-xl shadow-brand-orange/20"
          >
            <span className="font-bold">Add to Cart</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-base font-bold">{FORMATTER.format(currentTotal)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};