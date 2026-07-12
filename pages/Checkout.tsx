import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { MOCK_USER_ADDRESSES, FORMATTER } from '../constants';
import { MapPin, CreditCard, Banknote, Trash2, Plus, ArrowRight, X, Home, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserAddress } from '../types';

export const Checkout: React.FC = () => {
  const { state, updateQuantity, removeItem, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, addAddress } = useUser();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(MOCK_USER_ADDRESSES[0]);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // New Address Form State
  const [newAddress, setNewAddress] = useState({
      label: 'Home',
      street: '',
      landmark: '',
      details: ''
  });

  // Pre-fill phone if logged in
  useEffect(() => {
    if (user && user.phone) {
      setPhoneNumber(user.phone);
    }
    // If user has addresses, use their first one (Simulated logic)
    if (user && user.addresses.length > 0) {
        setSelectedAddress(user.addresses[0]);
    }
  }, [user]);

  // Calculations
  const deliveryFee = 150;
  const serviceFee = 50;
  const finalTotal = cartTotal + deliveryFee + serviceFee;

  const handlePlaceOrder = () => {
    if (paymentMethod === 'mpesa' && phoneNumber.length < 10) {
        toast.error('Please enter a valid M-Pesa number');
        return;
    }

    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
        setIsProcessing(false);
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/tracking');
    }, 2000);
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeItem(itemId);
    toast.success(`${itemName} removed`, { icon: '🗑️' });
  };

  const handleClearCart = () => {
      if(window.confirm('Are you sure you want to clear your entire cart?')) {
          clearCart();
          toast('Cart cleared', { icon: '🧹' });
      }
  }

  const handleSaveAddress = (e: React.FormEvent) => {
      e.preventDefault();
      const address: UserAddress = {
          id: `addr_${Date.now()}`,
          ...newAddress
      };
      
      if (isAuthenticated) {
          addAddress(address);
      }
      
      setSelectedAddress(address);
      setShowAddressModal(false);
      setNewAddress({ label: 'Home', street: '', landmark: '', details: '' }); // Reset
      toast.success('Delivery location updated');
  };

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => navigate('/')}>Start Browsing</Button>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 pt-4 relative">
      {/* 1. Address Section */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-bold text-gray-900 uppercase text-xs tracking-wider text-gray-500">Delivery Location</h2>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-brand-orange transition-colors cursor-pointer" onClick={() => setShowAddressModal(true)}>
          <div className="flex items-start space-x-3">
            <MapPin className="w-6 h-6 text-brand-orange mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 flex items-center">
                  {selectedAddress.label}
                  <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded uppercase">{selectedAddress.details ? 'Verified' : 'Select'}</span>
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">{selectedAddress.street}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{selectedAddress.landmark}</p>
            </div>
            <span className="text-brand-orange font-bold text-sm">Change</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center">
              <span className="font-bold mr-2 text-gray-700">Note:</span> 
              {selectedAddress.details || "Add gate code or floor number..."}
          </div>
        </div>
      </section>

      {/* 2. Order Summary */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900 uppercase text-xs tracking-wider text-gray-500">Order Summary</h2>
            <div className="flex space-x-3">
                <button className="text-red-500 text-xs font-bold" onClick={handleClearCart}>Clear Cart</button>
                <button className="text-brand-orange text-sm font-medium" onClick={() => navigate('/')}>Add Items</button>
            </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{state.restaurantName}</h3>
            </div>
          {state.items.map((item) => (
            <div key={item.itemId} className="p-4 border-b border-gray-100 last:border-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="font-medium text-gray-900">{FORMATTER.format(item.totalPrice * item.quantity)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                 {Object.values(item.selectedModifiers).map((m: any) => m.name).join(', ')}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold">-</button>
                    <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold">+</button>
                </div>
                <button 
                    onClick={() => handleRemoveItem(item.itemId, item.name)} 
                    className="text-gray-400 p-2 hover:text-red-500 transition-colors flex items-center text-xs font-medium"
                >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Payment Method */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider text-gray-500">Payment Method</h2>
        <div className="space-y-3">
            {/* M-Pesa Option */}
          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 bg-white'}`}>
            <input 
                type="radio" 
                name="payment" 
                value="mpesa" 
                checked={paymentMethod === 'mpesa'} 
                onChange={() => setPaymentMethod('mpesa')}
                className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <div className="ml-3 flex-1">
                <span className="font-bold text-gray-900 block">M-Pesa</span>
                <span className="text-xs text-gray-500">Pay securely via SIM toolkit prompt</span>
            </div>
            <div className="w-8 h-8 rounded bg-green-600 text-white flex items-center justify-center font-bold text-xs">M</div>
          </label>
          
          {paymentMethod === 'mpesa' && (
              <div className="ml-4 pl-4 border-l-2 border-green-200 mb-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">M-Pesa Number</label>
                  <input 
                    type="tel" 
                    placeholder="07XX XXX XXX" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
              </div>
          )}

          <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${paymentMethod === 'cash' ? 'border-brand-orange bg-orange-50 ring-1 ring-brand-orange' : 'border-gray-200 bg-white'}`}>
            <input 
                type="radio" 
                name="payment" 
                value="cash"
                checked={paymentMethod === 'cash'} 
                onChange={() => setPaymentMethod('cash')}
                className="w-5 h-5 text-brand-orange focus:ring-brand-orange border-gray-300"
            />
             <div className="ml-3 flex-1">
                <span className="font-bold text-gray-900 block">Cash on Delivery</span>
                <span className="text-xs text-gray-500">Pay rider upon arrival</span>
            </div>
            <Banknote className="w-6 h-6 text-gray-600" />
          </label>

          <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${paymentMethod === 'card' ? 'border-brand-orange bg-orange-50 ring-1 ring-brand-orange' : 'border-gray-200 bg-white'}`}>
            <input 
                type="radio" 
                name="payment" 
                value="card"
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')}
                className="w-5 h-5 text-brand-orange focus:ring-brand-orange border-gray-300"
            />
             <div className="ml-3 flex-1">
                <span className="font-bold text-gray-900 block">Card</span>
                <span className="text-xs text-gray-500">Visa / Mastercard</span>
            </div>
            <CreditCard className="w-6 h-6 text-gray-600" />
          </label>
        </div>
      </section>

      {/* 4. Total Breakdown */}
      <section className="mt-8 border-t border-gray-200 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{FORMATTER.format(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>{FORMATTER.format(deliveryFee)}</span>
          </div>
           <div className="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span>{FORMATTER.format(serviceFee)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span>{FORMATTER.format(finalTotal)}</span>
          </div>
      </section>

      {/* Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-center z-50">
          <div className="w-full max-w-md">
            <Button 
                fullWidth 
                size="lg" 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="flex justify-between items-center bg-brand-green hover:bg-green-700" // Green for Pay/Confirm
            >
                <span className="font-bold">{isProcessing ? 'Processing...' : 'Place Order'}</span>
                <span className="font-bold">{FORMATTER.format(finalTotal)}</span>
            </Button>
          </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-extrabold text-gray-900">Select Location</h2>
                      <button onClick={() => setShowAddressModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                          <X className="w-5 h-5 text-gray-600" />
                      </button>
                  </div>

                  {/* Saved Addresses List */}
                  {user && user.addresses.length > 0 && (
                      <div className="mb-6 space-y-3">
                          <h3 className="text-xs font-bold text-gray-500 uppercase">Saved Addresses</h3>
                          {user.addresses.map(addr => (
                              <div 
                                key={addr.id}
                                onClick={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between ${selectedAddress.id === addr.id ? 'border-brand-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                              >
                                  <div className="flex items-center space-x-3">
                                      {addr.label === 'Work' ? <Briefcase className="w-5 h-5 text-gray-500"/> : <Home className="w-5 h-5 text-gray-500"/>}
                                      <div>
                                          <p className="font-bold text-gray-900">{addr.label}</p>
                                          <p className="text-xs text-gray-500">{addr.street}</p>
                                      </div>
                                  </div>
                                  {selectedAddress.id === addr.id && <div className="w-4 h-4 rounded-full bg-brand-orange" />}
                              </div>
                          ))}
                      </div>
                  )}

                  {/* Add New Address Form */}
                  <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Add New Address</h3>
                      <form onSubmit={handleSaveAddress} className="space-y-4">
                          <div className="flex space-x-3">
                              <button 
                                type="button" 
                                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newAddress.label === 'Home' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
                                onClick={() => setNewAddress({...newAddress, label: 'Home'})}
                              >
                                Home
                              </button>
                              <button 
                                type="button" 
                                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newAddress.label === 'Work' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
                                onClick={() => setNewAddress({...newAddress, label: 'Work'})}
                              >
                                Work
                              </button>
                               <button 
                                type="button" 
                                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${newAddress.label === 'Other' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
                                onClick={() => setNewAddress({...newAddress, label: 'Other'})}
                              >
                                Other
                              </button>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Street / Area Name</label>
                              <input 
                                required
                                placeholder="e.g. Muthithi Road, Westlands"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                              />
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Nearby Landmark (Required)</label>
                              <input 
                                required
                                placeholder="e.g. Near Sarit Centre, Opp. KCB Bank"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                                value={newAddress.landmark}
                                onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                              />
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Gate / Door / Instructions</label>
                              <input 
                                required
                                placeholder="e.g. Black gate, Apt 4B, Call on arrival"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none"
                                value={newAddress.details}
                                onChange={(e) => setNewAddress({...newAddress, details: e.target.value})}
                              />
                          </div>

                          <Button fullWidth type="submit" className="mt-4">
                              Confirm & Select Location
                          </Button>
                      </form>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};