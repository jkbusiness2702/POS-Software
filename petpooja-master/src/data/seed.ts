import type {
  Category,
  Customer,
  IngredientStock,
  MenuItem,
  Order,
  Outlet,
  Settings,
  Staff,
  Table,
  Vendor,
} from '../types';

const id = () => Math.random().toString(36).slice(2, 10);

export const seedCategories: Category[] = [
  { id: 'cat-starters', name: 'Starters', color: '#fb923c' },
  { id: 'cat-mains', name: 'Main Course', color: '#f97316' },
  { id: 'cat-breads', name: 'Breads', color: '#fbbf24' },
  { id: 'cat-rice', name: 'Rice & Biryani', color: '#facc15' },
  { id: 'cat-chinese', name: 'Indo-Chinese', color: '#84cc16' },
  { id: 'cat-pizza', name: 'Pizza', color: '#ef4444' },
  { id: 'cat-burger', name: 'Burger', color: '#a855f7' },
  { id: 'cat-beverages', name: 'Beverages', color: '#06b6d4' },
  { id: 'cat-desserts', name: 'Desserts', color: '#ec4899' },
];

export const seedMenu: MenuItem[] = [
  { id: 'm1', name: 'Paneer Tikka', categoryId: 'cat-starters', price: 280, veg: true, available: true, tax: 5, description: 'Cottage cheese marinated in spices, grilled' },
  { id: 'm2', name: 'Chicken Wings', categoryId: 'cat-starters', price: 320, veg: false, available: true, tax: 5 },
  { id: 'm3', name: 'Veg Spring Roll', categoryId: 'cat-starters', price: 180, veg: true, available: true, tax: 5 },
  { id: 'm4', name: 'Hara Bhara Kebab', categoryId: 'cat-starters', price: 220, veg: true, available: true, tax: 5 },

  { id: 'm10', name: 'Paneer Butter Masala', categoryId: 'cat-mains', price: 320, veg: true, available: true, tax: 5, description: 'Rich tomato gravy with paneer cubes' },
  { id: 'm11', name: 'Butter Chicken', categoryId: 'cat-mains', price: 380, veg: false, available: true, tax: 5 },
  { id: 'm12', name: 'Dal Makhani', categoryId: 'cat-mains', price: 240, veg: true, available: true, tax: 5 },
  { id: 'm13', name: 'Kadhai Vegetable', categoryId: 'cat-mains', price: 260, veg: true, available: true, tax: 5 },
  { id: 'm14', name: 'Mutton Rogan Josh', categoryId: 'cat-mains', price: 460, veg: false, available: true, tax: 5 },

  { id: 'm20', name: 'Butter Naan', categoryId: 'cat-breads', price: 50, veg: true, available: true, tax: 5 },
  { id: 'm21', name: 'Garlic Naan', categoryId: 'cat-breads', price: 70, veg: true, available: true, tax: 5 },
  { id: 'm22', name: 'Tandoori Roti', categoryId: 'cat-breads', price: 30, veg: true, available: true, tax: 5 },
  { id: 'm23', name: 'Lachha Paratha', categoryId: 'cat-breads', price: 60, veg: true, available: true, tax: 5 },

  { id: 'm30', name: 'Veg Biryani', categoryId: 'cat-rice', price: 260, veg: true, available: true, tax: 5 },
  { id: 'm31', name: 'Chicken Biryani', categoryId: 'cat-rice', price: 320, veg: false, available: true, tax: 5 },
  { id: 'm32', name: 'Jeera Rice', categoryId: 'cat-rice', price: 160, veg: true, available: true, tax: 5 },
  { id: 'm33', name: 'Hyderabadi Mutton Biryani', categoryId: 'cat-rice', price: 420, veg: false, available: true, tax: 5 },

  { id: 'm40', name: 'Veg Hakka Noodles', categoryId: 'cat-chinese', price: 200, veg: true, available: true, tax: 5 },
  { id: 'm41', name: 'Schezwan Fried Rice', categoryId: 'cat-chinese', price: 220, veg: true, available: true, tax: 5 },
  { id: 'm42', name: 'Chilli Chicken', categoryId: 'cat-chinese', price: 290, veg: false, available: true, tax: 5 },
  { id: 'm43', name: 'Manchurian Dry', categoryId: 'cat-chinese', price: 220, veg: true, available: true, tax: 5 },

  { id: 'm50', name: 'Margherita Pizza', categoryId: 'cat-pizza', price: 280, veg: true, available: true, tax: 5 },
  { id: 'm51', name: 'Farmhouse Pizza', categoryId: 'cat-pizza', price: 360, veg: true, available: true, tax: 5 },
  { id: 'm52', name: 'Chicken Tikka Pizza', categoryId: 'cat-pizza', price: 420, veg: false, available: true, tax: 5 },

  { id: 'm60', name: 'Classic Veg Burger', categoryId: 'cat-burger', price: 150, veg: true, available: true, tax: 5 },
  { id: 'm61', name: 'Cheese Burst Burger', categoryId: 'cat-burger', price: 220, veg: true, available: true, tax: 5 },
  { id: 'm62', name: 'Crispy Chicken Burger', categoryId: 'cat-burger', price: 240, veg: false, available: true, tax: 5 },

  { id: 'm70', name: 'Masala Chai', categoryId: 'cat-beverages', price: 40, veg: true, available: true, tax: 5 },
  { id: 'm71', name: 'Fresh Lime Soda', categoryId: 'cat-beverages', price: 80, veg: true, available: true, tax: 5 },
  { id: 'm72', name: 'Cold Coffee', categoryId: 'cat-beverages', price: 140, veg: true, available: true, tax: 5 },
  { id: 'm73', name: 'Mango Lassi', categoryId: 'cat-beverages', price: 120, veg: true, available: true, tax: 5 },

  { id: 'm80', name: 'Gulab Jamun', categoryId: 'cat-desserts', price: 90, veg: true, available: true, tax: 5 },
  { id: 'm81', name: 'Choco Lava Cake', categoryId: 'cat-desserts', price: 180, veg: true, available: true, tax: 5 },
  { id: 'm82', name: 'Kulfi', categoryId: 'cat-desserts', price: 100, veg: true, available: true, tax: 5 },
];

export const seedTables: Table[] = [
  { id: 't1', name: 'T1', area: 'Indoor', seats: 2, status: 'free' },
  { id: 't2', name: 'T2', area: 'Indoor', seats: 2, status: 'free' },
  { id: 't3', name: 'T3', area: 'Indoor', seats: 4, status: 'occupied' },
  { id: 't4', name: 'T4', area: 'Indoor', seats: 4, status: 'free' },
  { id: 't5', name: 'T5', area: 'Indoor', seats: 6, status: 'reserved' },
  { id: 't6', name: 'T6', area: 'Indoor', seats: 4, status: 'free' },
  { id: 't7', name: 'T7', area: 'Outdoor', seats: 2, status: 'free' },
  { id: 't8', name: 'T8', area: 'Outdoor', seats: 4, status: 'free' },
  { id: 't9', name: 'T9', area: 'Outdoor', seats: 4, status: 'cleaning' },
  { id: 't10', name: 'T10', area: 'Outdoor', seats: 6, status: 'free' },
  { id: 't11', name: 'P1', area: 'Private', seats: 8, status: 'free' },
  { id: 't12', name: 'P2', area: 'Private', seats: 10, status: 'free' },
];

export const seedCustomers: Customer[] = [
  { id: 'c1', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', loyaltyPoints: 240, visits: 12, totalSpent: 12450, lastVisit: Date.now() - 86400000 * 3 },
  { id: 'c2', name: 'Priya Mehta', phone: '9876501234', loyaltyPoints: 80, visits: 4, totalSpent: 3850, lastVisit: Date.now() - 86400000 * 7 },
  { id: 'c3', name: 'Amit Patel', phone: '9988776655', loyaltyPoints: 540, visits: 28, totalSpent: 28960, lastVisit: Date.now() - 86400000 * 1 },
  { id: 'c4', name: 'Sneha Iyer', phone: '9090909090', loyaltyPoints: 30, visits: 2, totalSpent: 1640, lastVisit: Date.now() - 86400000 * 14 },
];

export const seedIngredients: IngredientStock[] = [
  { id: 'i1', name: 'Paneer', unit: 'kg', stock: 8, minStock: 5, costPerUnit: 320, lastUpdated: Date.now() },
  { id: 'i2', name: 'Chicken', unit: 'kg', stock: 12, minStock: 6, costPerUnit: 240, lastUpdated: Date.now() },
  { id: 'i3', name: 'Basmati Rice', unit: 'kg', stock: 25, minStock: 10, costPerUnit: 110, lastUpdated: Date.now() },
  { id: 'i4', name: 'Refined Flour', unit: 'kg', stock: 15, minStock: 8, costPerUnit: 45, lastUpdated: Date.now() },
  { id: 'i5', name: 'Onion', unit: 'kg', stock: 18, minStock: 10, costPerUnit: 35, lastUpdated: Date.now() },
  { id: 'i6', name: 'Tomato', unit: 'kg', stock: 4, minStock: 8, costPerUnit: 40, lastUpdated: Date.now() },
  { id: 'i7', name: 'Butter', unit: 'kg', stock: 3, minStock: 4, costPerUnit: 480, lastUpdated: Date.now() },
  { id: 'i8', name: 'Mozzarella', unit: 'kg', stock: 6, minStock: 3, costPerUnit: 520, lastUpdated: Date.now() },
  { id: 'i9', name: 'Cooking Oil', unit: 'L', stock: 22, minStock: 10, costPerUnit: 140, lastUpdated: Date.now() },
  { id: 'i10', name: 'Milk', unit: 'L', stock: 14, minStock: 8, costPerUnit: 56, lastUpdated: Date.now() },
];

export const seedVendors: Vendor[] = [
  { id: 'v1', name: 'Fresh Farms', phone: '9000011111', category: 'Vegetables' },
  { id: 'v2', name: 'Royal Meats', phone: '9000022222', category: 'Meat & Poultry' },
  { id: 'v3', name: 'Dairy Plus', phone: '9000033333', category: 'Dairy' },
  { id: 'v4', name: 'Spice World', phone: '9000044444', category: 'Spices & Grains' },
];

export const seedStaff: Staff[] = [
  { id: 's1', name: 'Vikram Singh', role: 'admin', phone: '9123456789', email: 'vikram@petpooja.com', active: true, pin: '1234' },
  { id: 's2', name: 'Anjali Verma', role: 'manager', phone: '9123450001', active: true, pin: '2345' },
  { id: 's3', name: 'Ramesh Kumar', role: 'cashier', phone: '9123450002', active: true, pin: '3456' },
  { id: 's4', name: 'Sunita Joshi', role: 'waiter', phone: '9123450003', active: true, pin: '4567' },
  { id: 's5', name: 'Pradeep Yadav', role: 'chef', phone: '9123450004', active: true, pin: '5678' },
  { id: 's6', name: 'Manoj Singh', role: 'delivery', phone: '9123450005', active: true, pin: '6789' },
];

export const seedOutlets: Outlet[] = [
  { id: 'o1', name: 'Pet Pooja — Main Branch', address: 'Sector 17, Chandigarh', phone: '0172-2700000', gstin: '04AAAAA0000A1Z5' },
  { id: 'o2', name: 'Pet Pooja — Mall Road', address: 'Mall Road, Shimla', phone: '0177-2611111', gstin: '02BBBBB1111B1Z3' },
];

export const seedSettings: Settings = {
  restaurantName: 'Pet Pooja',
  currency: '₹',
  taxLabel: 'GST',
  defaultTax: 5,
  serviceCharge: 0,
  printerWidth: 80,
  outlets: seedOutlets,
  activeOutletId: 'o1',
  loyaltyPercent: 2,
  invoicePrefix: 'INV',
  footerNote: 'Thank you for dining with us!',
};

export const seedOrders = (): Order[] => {
  const now = Date.now();
  const dayMs = 86400000;
  const out: Order[] = [];
  let n = 1001;
  for (let d = 6; d >= 0; d--) {
    const count = 6 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const items: Order['items'] = [];
      const lineCount = 1 + Math.floor(Math.random() * 3);
      let subtotal = 0;
      for (let j = 0; j < lineCount; j++) {
        const m = seedMenu[Math.floor(Math.random() * seedMenu.length)];
        const qty = 1 + Math.floor(Math.random() * 2);
        items.push({ id: id(), menuItemId: m.id, name: m.name, price: m.price, qty, status: 'served' });
        subtotal += m.price * qty;
      }
      const taxAmount = Math.round(subtotal * 0.05);
      const total = subtotal + taxAmount;
      const types: Order['type'][] = ['dine-in', 'takeaway', 'delivery', 'online'];
      const pays: Order['payment'][] = ['cash', 'card', 'upi', 'wallet'];
      out.push({
        id: id(),
        number: n++,
        type: types[Math.floor(Math.random() * types.length)],
        items,
        status: 'completed',
        payment: pays[Math.floor(Math.random() * pays.length)],
        discount: 0,
        taxAmount,
        subtotal,
        total,
        createdAt: now - d * dayMs - Math.floor(Math.random() * dayMs),
        updatedAt: now - d * dayMs,
      });
    }
  }
  return out;
};
