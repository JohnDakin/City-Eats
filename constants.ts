import { Restaurant, UserAddress, PastOrder } from './types';

export const FORMATTER = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  minimumFractionDigits: 0,
});

export const LOCATIONS = ['Westlands', 'Kilimani', 'CBD', 'Parklands', 'Karen', 'Langata'];

export const PROMOS = [
  {
    id: 1,
    title: "Free Delivery",
    subtitle: "On all orders above KES 1,000",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    color: "bg-blue-600"
  },
  {
    id: 2,
    title: "50% Off Lunch",
    subtitle: "Use code: LUNCH50",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    color: "bg-brand-orange"
  },
  {
    id: 3,
    title: "New: Swahili Dishes",
    subtitle: "Try the best Pilau in town",
    image: "https://images.unsplash.com/photo-1594970921226-407604314d18?w=800&q=80",
    color: "bg-green-600"
  }
];

export const MOCK_USER_ADDRESSES: UserAddress[] = [
  {
    id: 'addr_1',
    label: 'Home',
    street: 'Muthithi Road',
    landmark: 'Near Sarit Centre',
    details: 'Apartment 4B, Gate Code 1234',
  },
  {
    id: 'addr_2',
    label: 'Work',
    street: 'Mama Ngina St',
    landmark: 'IMAX Building',
    details: 'Floor 5, Reception',
  },
];

export const MOCK_PAST_ORDERS: PastOrder[] = [
  {
    id: 'ord_x92',
    restaurantId: 'rest_002',
    restaurantName: 'Mama Oliech Restaurant',
    restaurantImage: 'https://images.unsplash.com/photo-1601356616077-695291ea36d7?w=200&h=200&fit=crop',
    date: 'Yesterday, 1:30 PM',
    itemSummary: '1x Whole Fried Fish, 2x Ugali',
    total: 1650,
    status: 'Delivered',
    rating: 5
  },
  {
    id: 'ord_x88',
    restaurantId: 'rest_003',
    restaurantName: 'Burger & Pizza Hub',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
    date: 'Mon, 7:15 PM',
    itemSummary: '1x BBQ Chicken Pizza, 1x Soda',
    total: 1250,
    status: 'Delivered',
  },
  {
    id: 'ord_x45',
    restaurantId: 'rest_001',
    restaurantName: 'Nyama Choma Palace',
    restaurantImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
    date: 'Last Week',
    itemSummary: '1x Mixed Grill Platter',
    total: 2600,
    status: 'Cancelled',
  }
];

export const CUISINE_IMAGES: Record<string, string> = {
  'Kenyan': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
  'Fast Food': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop',
  'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=200&h=200&fit=crop',
  'Swahili': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=200&fit=crop',
  'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&h=200&fit=crop',
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest_001',
    name: 'Nyama Choma Palace',
    rating: 4.8,
    deliveryTime: '30-45 min',
    deliveryFee: 150,
    cuisine: ['Kenyan', 'BBQ'],
    tags: ['Halal', 'Meat Lovers', 'Group Meals'],
    location: 'Westlands',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=500&fit=crop',
    isOpen: true,
    menu: [
      {
        id: 'item_01',
        name: 'Mixed Grill Platter',
        description: '1kg Goat meat, chicken wings, and sausages. Serves 2-3 people.',
        price: 2500,
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=500&fit=crop',
        isAvailable: true,
        modifiers: [
          {
            id: 'mod_side',
            name: 'Choose a Side',
            required: true,
            options: [
              { id: 'opt_ugali', name: 'Ugali', price: 0 },
              { id: 'opt_chips', name: 'Chips (Fries)', price: 100 },
              { id: 'opt_mukimo', name: 'Mukimo', price: 150 },
            ],
          },
          {
            id: 'mod_spice',
            name: 'Kachumbari Spice Level',
            required: true,
            options: [
              { id: 'spice_mild', name: 'Mild', price: 0 },
              { id: 'spice_hot', name: 'Hot (Pilipili)', price: 0 },
            ],
          },
        ],
      },
      {
        id: 'item_02',
        name: 'Wet Fry Tilapia',
        description: 'Fresh lake fish cooked in rich tomato gravy with traditional herbs.',
        price: 1200,
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop',
        isAvailable: true,
        modifiers: [],
      },
      {
        id: 'item_drink_1',
        name: 'Cold Tusker Lager',
        description: '500ml Local Beer.',
        price: 350,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1629247492985-1d4cb800843e?w=500&h=500&fit=crop',
        isAvailable: true,
      },
    ],
  },
  {
    id: 'rest_002',
    name: 'Mama Oliech Restaurant',
    rating: 4.6,
    deliveryTime: '40-55 min',
    deliveryFee: 120,
    cuisine: ['Kenyan', 'Fish', 'Swahili'],
    tags: ['Halal', 'Authentic', 'Popular'],
    location: 'Kilimani',
    image: 'https://images.unsplash.com/photo-1601356616077-695291ea36d7?w=800&h=500&fit=crop',
    isOpen: true,
    menu: [
        {
        id: 'item_03',
        name: 'Whole Fried Fish',
        description: 'Crispy fried fish served with brown ugali and sukuma wiki.',
        price: 1500,
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=500&h=500&fit=crop',
        isAvailable: true,
      },
      {
        id: 'item_swahili_1',
        name: 'Coconut Beans (Maharagwe)',
        description: 'Kidney beans cooked in rich coconut milk.',
        price: 450,
        category: 'Swahili',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop',
        isAvailable: true,
      }
    ],
  },
  {
    id: 'rest_003',
    name: 'Burger & Pizza Hub',
    rating: 4.2,
    deliveryTime: '25-35 min',
    deliveryFee: 100,
    cuisine: ['Fast Food', 'Pizza'],
    tags: ['Fast Food', 'Late Night'],
    location: 'CBD',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop',
    isOpen: true,
    menu: [
      {
        id: 'item_pizza_1',
        name: 'BBQ Chicken Pizza',
        description: 'Large pizza with bbq sauce, chicken, onions and cilantro.',
        price: 1100,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
        isAvailable: true,
      },
      {
        id: 'item_burger_1',
        name: 'Double Cheese Burger',
        description: 'Two beef patties, cheddar cheese, lettuce, tomato.',
        price: 850,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
        isAvailable: true,
      }
    ],
  },
  {
    id: 'rest_004',
    name: 'Haandi Restaurant',
    rating: 4.9,
    deliveryTime: '35-50 min',
    deliveryFee: 200,
    cuisine: ['Indian', 'Curry'],
    tags: ['Vegetarian Friendly', 'Premium', 'Spicy'],
    location: 'Westlands',
    image: 'https://images.unsplash.com/photo-1517244683847-7454b94eefa4?w=800&h=500&fit=crop',
    isOpen: true,
    menu: [
      {
        id: 'item_ind_1',
        name: 'Butter Chicken',
        description: 'Tender chicken in a rich, creamy tomato curry sauce.',
        price: 1600,
        category: 'Indian',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop',
        isAvailable: true,
      },
      {
        id: 'item_ind_2',
        name: 'Garlic Naan',
        description: 'Oven-baked flatbread topped with garlic butter.',
        price: 250,
        category: 'Indian',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&h=500&fit=crop',
        isAvailable: true,
      }
    ],
  },
];