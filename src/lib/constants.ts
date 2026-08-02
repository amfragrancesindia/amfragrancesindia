export const PRODUCT_CATEGORIES = [
  { value: 'ALL', label: 'All Products' },
  { value: 'EAU_DE_PARFUM', label: 'Eau de Parfum' },
  { value: 'EAU_DE_TOILETTE', label: 'Eau de Toilette' },
  { value: 'EAU_DE_COLOGNE', label: 'Eau de Cologne' },
  { value: 'PERFUME_OIL', label: 'Perfume Oils' },
  { value: 'ATTAR', label: 'Attars' },
  { value: 'LUXURY_COLLECTION', label: 'Luxury Collection' },
  { value: 'GIFT_COLLECTION', label: 'Gift Collections' },
  { value: 'DISCOVERY_SET', label: 'Discovery Sets' },
];

export const GENDERS = [
  { value: 'MEN', label: 'Men' },
  { value: 'WOMEN', label: 'Women' },
  { value: 'UNISEX', label: 'Unisex' },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

export const OCCASIONS = [
  'Everyday', 'Office', 'Evening', 'Party', 'Special Occasion', 'Wedding',
  'Date Night', 'Formal', 'Casual', 'Travel'
];

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

export const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'
];

export const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI', icon: '📱' },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
  { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
  { value: 'WALLET', label: 'Wallet', icon: '👛' },
  { value: 'EMI', label: 'EMI', icon: '📊' },
  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { value: 'GIFT_CARD', label: 'Gift Card', icon: '🎁' },
];
