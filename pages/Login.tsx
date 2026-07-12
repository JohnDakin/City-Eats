import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 pb-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-brand-orange mb-2">CityEats</h1>
        <p className="text-gray-500 font-medium">
          {isLogin ? 'Welcome back! Ready for lunch?' : 'Create an account to get started'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-brand-orange/20 outline-none font-medium"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-brand-orange/20 outline-none font-medium"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-brand-orange/20 outline-none font-medium"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <Button 
          fullWidth 
          size="lg" 
          type="submit" 
          disabled={loading}
          className="mt-4 shadow-xl shadow-brand-orange/20"
        >
          {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-brand-orange font-bold mt-1 text-sm hover:underline"
        >
          {isLogin ? 'Register now' : 'Log in here'}
        </button>
      </div>

      {isLogin && (
          <div className="mt-8">
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-bold uppercase">Or continue with</span>
                <div className="flex-grow border-t border-gray-100"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
                <button type="button" className="flex items-center justify-center px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                </button>
                <button type="button" className="flex items-center justify-center px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5 w-5" alt="Facebook" />
                </button>
            </div>
          </div>
      )}

      <button 
        onClick={() => navigate('/')} 
        className="mt-8 flex items-center justify-center text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
      >
        Skip for now <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};