import React, { useState } from 'react';
import { MapPin, Search, Star, Clock, ChevronRight, Utensils, Heart, History, X } from 'lucide-react';
import { LOCATIONS, RESTAURANTS, FORMATTER, CUISINE_IMAGES, PROMOS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const FILTERS = ['Open Now', 'Free Delivery', 'Halal', 'Vegetarian Friendly', 'Top Rated'];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { state: cartState } = useCart();
  const { user, isAuthenticated, favorites, toggleFavorite, searchHistory, addSearchTerm, clearSearchHistory } = useUser();

  // 1. Filter Restaurants
  const filteredRestaurants = RESTAURANTS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? r.cuisine.includes(selectedCategory) : true;
    
    let matchesFilter = true;
    if (activeFilter) {
        if (activeFilter === 'Open Now') matchesFilter = r.isOpen;
        else if (activeFilter === 'Free Delivery') matchesFilter = r.deliveryFee === 0;
        else if (activeFilter === 'Top Rated') matchesFilter = r.rating >= 4.5;
        else matchesFilter = r.tags?.includes(activeFilter) || false;
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  // 2. Discover Dishes
  const discoveredDishes = RESTAURANTS.flatMap(restaurant => 
    restaurant.menu
      .filter(item => {
        if (searchTerm) {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 item.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (selectedCategory) {
           return item.category === selectedCategory || restaurant.cuisine.includes(selectedCategory);
        }
        return false;
      })
      .map(item => ({ ...item, restaurantName: restaurant.name, restaurantId: restaurant.id }))
  );

  const visibleDishes = discoveredDishes.slice(0, 5);

  const handleSearchSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if(searchTerm) {
          addSearchTerm(searchTerm);
          setIsSearchFocused(false);
      }
  }

  const handleHistoryClick = (term: string) => {
      setSearchTerm(term);
      addSearchTerm(term); // Move to top
      setIsSearchFocused(false);
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen" onClick={() => setIsSearchFocused(false)}>
      {/* Header */}
      <div className="bg-brand-orange px-4 pt-12 pb-8 text-white rounded-b-[2.5rem] shadow-orange-500/20 shadow-xl relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-orange-100 font-medium uppercase tracking-wide">Delivering to</span>
                <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent font-bold text-lg focus:outline-none appearance-none cursor-pointer text-white"
                aria-label="Select delivery location"
                >
                {LOCATIONS.map(loc => <option key={loc} value={loc} className="text-gray-900">{loc}, Nairobi</option>)}
                </select>
            </div>
            </div>
            
            {!isAuthenticated && (
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                    Log In
                </button>
            )}
        </div>

        <div className="mb-6">
            <h1 className="text-3xl font-extrabold mb-1">
                {getGreeting()}{isAuthenticated ? `, ${user?.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-orange-100 font-medium opacity-90">What are you craving today?</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative transform translate-y-2">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search food, restaurants..." 
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-2xl py-3.5 pl-12 pr-4 shadow-lg shadow-black/5 focus:ring-4 focus:ring-orange-300/30 focus:outline-none transition-all placeholder:text-gray-400 font-medium"
          />
          {/* Search History Dropdown */}
          {isSearchFocused && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl mt-2 p-2 z-50 animate-fade-in-up border border-gray-100">
                  <div className="flex justify-between items-center px-3 py-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">Recent Searches</span>
                      <button type="button" onClick={clearSearchHistory} className="text-xs text-brand-orange font-bold">Clear</button>
                  </div>
                  {searchHistory.map((term, idx) => (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleHistoryClick(term)} 
                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg flex items-center text-sm font-medium text-gray-700"
                      >
                          <History className="w-4 h-4 mr-3 text-gray-300" />
                          {term}
                      </button>
                  ))}
              </div>
          )}
        </form>
      </div>

      {/* Promos Carousel */}
      {!searchTerm && !selectedCategory && !activeFilter && (
          <div className="mt-8 px-4 overflow-x-auto no-scrollbar flex space-x-4 pb-2">
              {PROMOS.map(promo => (
                  <div key={promo.id} className={`flex-none w-72 ${promo.color} rounded-2xl p-4 relative overflow-hidden shadow-lg h-36 flex flex-col justify-center`}>
                      <div className="relative z-10 w-2/3">
                        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">Promo</span>
                        <h3 className="text-white font-extrabold text-xl leading-tight mb-1">{promo.title}</h3>
                        <p className="text-white/90 text-xs font-medium">{promo.subtitle}</p>
                      </div>
                      <img src={promo.image} alt="" className="absolute right-[-20px] top-0 h-full w-48 object-cover rounded-l-full transform skew-x-[-10deg] border-l-4 border-white/20" />
                  </div>
              ))}
          </div>
      )}

      {/* Filter Chips */}
      <div className="pl-4 mt-6 flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                className={`flex-none px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                    activeFilter === filter 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                  {filter}
              </button>
          ))}
      </div>

      {/* Categories */}
      <div className="pl-4 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
        <div className="flex space-x-5 overflow-x-auto no-scrollbar pr-4 pb-2">
          <button 
             onClick={() => setSelectedCategory(null)}
             className={`flex-none flex flex-col items-center space-y-2 group ${!selectedCategory ? 'opacity-100' : 'opacity-60'}`}
          >
             <div className={`w-16 h-16 rounded-2xl bg-brand-orange shadow-sm flex items-center justify-center overflow-hidden border-2 ${!selectedCategory ? 'border-brand-orange ring-2 ring-orange-200' : 'border-transparent'}`}>
                 <Utensils className="text-white w-6 h-6" />
             </div>
             <span className={`text-xs font-bold ${!selectedCategory ? 'text-brand-orange' : 'text-gray-600'}`}>All</span>
          </button>
          {Object.entries(CUISINE_IMAGES).map(([cat, img]) => {
            const isSelected = selectedCategory === cat;
            return (
                <button key={cat} onClick={() => setSelectedCategory(isSelected ? null : cat)} className={`flex-none flex flex-col items-center space-y-2 group ${isSelected ? 'opacity-100' : 'opacity-100'}`}>
                <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border-2 transition-all p-1 ${isSelected ? 'border-brand-orange ring-2 ring-orange-200' : 'border-transparent group-hover:border-brand-orange'}`}>
                    <img src={img} alt={cat} className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className={`text-xs font-bold ${isSelected ? 'text-brand-orange' : 'text-gray-600'}`}>{cat}</span>
                </button>
            );
          })}
        </div>
      </div>

      {/* DISH DISCOVERY SECTION */}
      {(selectedCategory || searchTerm) && visibleDishes.length > 0 && (
          <div className="px-4 mt-8">
             <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-orange-100 text-brand-orange p-1 rounded-lg mr-2"><Utensils className="w-4 h-4" /></span>
                Dishes in {selectedCategory || 'Search'}
             </h2>
             <div className="grid grid-cols-2 gap-4">
                {visibleDishes.map(item => (
                    <div 
                        key={`${item.restaurantId}-${item.id}`}
                        onClick={() => navigate(`/restaurant/${item.restaurantId}/item/${item.id}`)}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
                    >
                        <div className="relative h-28 mb-3 rounded-xl overflow-hidden">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-[10px] font-bold truncate">{item.restaurantName}</p>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-bold text-brand-orange">{FORMATTER.format(item.price)}</span>
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
      )}

      {/* Restaurant List */}
      <div className="px-4 mt-8 mb-24">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
            {selectedCategory ? `Restaurants serving ${selectedCategory}` : 'All Restaurants'}
        </h2>
        {filteredRestaurants.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-gray-500">No restaurants found matching your criteria.</p>
                <button onClick={() => {setSearchTerm(''); setSelectedCategory(null); setActiveFilter(null)}} className="text-brand-orange font-bold mt-2">Clear Filters</button>
            </div>
        ) : (
            <div className="space-y-6">
            {filteredRestaurants.map((restaurant) => {
                const isFav = favorites.includes(restaurant.id);
                return (
                    <div 
                    key={restaurant.id} 
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-all hover:shadow-lg relative"
                    >
                    {/* Favorite Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(restaurant.id); }}
                        className="absolute top-4 right-4 z-30 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition-colors"
                    >
                        <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>

                    <div className="relative h-48">
                        <img src={restaurant.image} alt={restaurant.name} loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -rotate-6">Currently Closed</span>
                        </div>
                        )}
                        
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                        {restaurant.deliveryTime}
                        </div>
                    </div>
                    
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                        <h3 className="font-extrabold text-xl text-gray-900 leading-tight">{restaurant.name}</h3>
                        <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-bold">
                            <span className="mr-1">{restaurant.rating}</span>
                            <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-4 font-medium">{restaurant.cuisine.join(' • ')}</p>
                        
                        {/* Tags */}
                        {restaurant.tags && restaurant.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {restaurant.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 border-t border-gray-50 pt-4">
                        <div className="flex items-center mr-6">
                            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                            <span className="truncate max-w-[100px]">{restaurant.location}</span>
                        </div>
                        <div className="flex items-center text-brand-orange font-bold bg-orange-50 px-3 py-1 rounded-full">
                            {FORMATTER.format(restaurant.deliveryFee)} Delivery
                        </div>
                        </div>
                    </div>
                    </div>
                )
            })}
            </div>
        )}
      </div>

      {/* Floating Cart Indicator */}
      {cartState.items.length > 0 && (
        <div className="fixed bottom-20 left-0 w-full flex justify-center z-40 px-4 animate-fade-in-up">
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