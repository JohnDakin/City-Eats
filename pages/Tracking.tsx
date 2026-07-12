import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, CheckCircle, Circle, MapPin, User, Clock, Star, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  { id: 'received', label: 'Order Received' },
  { id: 'preparing', label: 'Preparing Food' },
  { id: 'picking_up', label: 'Courier Picking Up' },
  { id: 'delivering', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export const Tracking: React.FC = () => {
  const navigate = useNavigate();
  const [eta, setEta] = useState(23);
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // Start at Preparing
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  // Simulate eta countdown
  useEffect(() => {
    const timer = setInterval(() => {
        setEta(prev => prev > 1 ? prev - 1 : 0);
    }, 10000); // Fast countdown for demo
    return () => clearInterval(timer);
  }, []);

  // Simulate status progression
  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentStepIndex(prev => {
              if (prev < STATUS_STEPS.length - 1) return prev + 1;
              return prev;
          });
      }, 8000); // Advance every 8 seconds for demo

      return () => clearInterval(interval);
  }, []);

  // Show rating modal when delivered
  useEffect(() => {
      if (STATUS_STEPS[currentStepIndex].id === 'delivered') {
          setTimeout(() => setShowRatingModal(true), 1500);
      }
  }, [currentStepIndex]);

  const handleSubmitReview = () => {
      toast.success('Thanks for your feedback!', { icon: '⭐' });
      setShowRatingModal(false);
      navigate('/');
  }

  return (
    <div className="flex flex-col h-screen relative">
      {/* 1. Map Area (Simulated) */}
      <div className="relative h-[55%] bg-gray-200 w-full">
         {/* Simulated Map Visuals */}
         <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-1.2641,36.7903&zoom=14&size=600x600&sensor=false&key=YOUR_KEY_HERE')] bg-cover opacity-50 grayscale" style={{ backgroundImage: 'linear-gradient(to bottom right, #e5e7eb, #d1d5db)' }}></div>
         
         {/* Map Elements */}
         <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-gray-400 font-bold text-2xl rotate-[-15deg] opacity-20">MAPBOX VIEW</span>
         </div>
         
         {/* Pins */}
         <div className="absolute top-1/4 left-1/3 flex flex-col items-center animate-bounce">
            <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold mb-1">Mama Oliech</div>
            <MapPin className="w-8 h-8 text-brand-orange fill-current" />
         </div>

         <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
            <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold mb-1">You</div>
            <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-white shadow-lg"></div>
         </div>

         {/* Courier Route Line (SVG Overlay) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <path d="M140,160 Q220,250 280,400" stroke="#FF5722" strokeWidth="4" fill="none" strokeDasharray="8 4" />
             <circle cx="210" cy="275" r="6" fill="#212121" /> {/* Courier Position */}
         </svg>
      </div>

      {/* 2. Status Card */}
      <div className="flex-1 bg-white -mt-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] relative z-10 px-6 pt-8 pb-4 flex flex-col overflow-y-auto">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-end mb-8">
            <div>
                <p className="text-gray-500 text-sm font-medium">Estimated Arrival</p>
                <h1 className="text-3xl font-bold text-gray-900">{STATUS_STEPS[currentStepIndex].id === 'delivered' ? 'Arrived!' : `${eta} mins`}</h1>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <Clock className="w-4 h-4 mr-1" /> On Time
            </div>
        </div>

        {/* Timeline */}
        <div className="mb-8 relative pl-4 border-l-2 border-gray-100 space-y-8">
            {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                
                return (
                    <div key={step.id} className="relative transition-all duration-500">
                        <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-300'} flex items-center justify-center transition-colors`}>
                            {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <p className={`text-sm transition-colors ${isCompleted ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                        </p>
                        {isCurrent && step.id !== 'delivered' && step.id !== 'received' && (
                            <p className="text-xs text-brand-orange animate-pulse font-medium mt-1">Processing...</p>
                        )}
                    </div>
                )
            })}
        </div>

        {/* Courier Info */}
        <div className="mt-auto bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                    <p className="font-bold text-gray-900">James Kamau</p>
                    <p className="text-xs text-gray-500">Motorbike • KDC 123X</p>
                </div>
            </div>
            <div className="flex space-x-3">
                <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm active:scale-90 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                </button>
                 <button className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                    <Phone className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      {/* RATING MODAL */}
      {showRatingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center relative">
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-100 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="mt-10">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Delivered!</h2>
                    <p className="text-gray-500 mb-6">Enjoy your meal from <span className="font-bold text-gray-900">Mama Oliech</span>. How was the delivery?</p>
                    
                    <div className="flex justify-center space-x-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star}
                                onClick={() => setRating(star)}
                                className="transform transition-transform active:scale-110 focus:outline-none"
                            >
                                <Star 
                                    className={`w-10 h-10 ${star <= rating ? 'fill-brand-orange text-brand-orange' : 'text-gray-300'}`} 
                                    strokeWidth={1.5}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <Button fullWidth onClick={handleSubmitReview} disabled={rating === 0}>
                            Submit Feedback
                        </Button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="text-gray-400 font-bold text-sm hover:text-gray-600"
                        >
                            Skip
                        </button>
                    </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};