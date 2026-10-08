import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Category,
  Customer,
  ID,
  IngredientStock,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Settings,
  Staff,
  Table,
  Vendor,
  TableStatus,
  OrderType,
} from '../types';
import {
  seedCategories,
  seedCustomers,
  seedIngredients,
  seedMenu,
  seedOrders,
  seedSettings,
  seedStaff,
  seedTables,
  seedVendors,
} from '../data/seed';

const uid = () => Math.random().toString(36).slice(2, 10);

interface CartLine {
  id: ID;
  menuItemId: ID;
  qty: number;
  notes?: string;
}

interface State {
  // Data
  categories: Category[];
  menu: MenuItem[];
  tables: Table[];
  customers: Customer[];
  ingredients: IngredientStock[];
  vendors: Vendor[];
  staff: Staff[];
  orders: Order[];
  settings: Settings;

  // Session
  currentUserId: ID | null;
  cart: CartLine[];
  cartType: OrderType;
  cartTableId?: ID;
  cartCustomerId?: ID;
  cartDiscount: number;
  orderCounter: number;

  // Auth
  login: (pin: string) => Staff | null;
  logout: () => void;

  // Cart
  addToCart: (menuItemId: ID, qty?: number) => void;
  updateCartQty: (lineId: ID, qty: number) => void;
  removeFromCart: (lineId: ID) => void;
  setCartNotes: (lineId: ID, notes: string) => void;
  setCartType: (t: OrderType) => void;
  setCartTable: (id?: ID) => void;
  setCartCustomer: (id?: ID) => void;
  setCartDiscount: (d: number) => void;
  clearCart: () => void;
  placeOrder: (payment: PaymentMethod) => Order | null;
  saveAsKOT: () => Order | null;

  // Orders
  updateOrderStatus: (id: ID, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: ID, itemId: ID, status: NonNullable<OrderItem['status']>) => void;
  addItemsToOrder: (orderId: ID, items: OrderItem[]) => void;
  payOrder: (id: ID, method: PaymentMethod) => void;
  cancelOrder: (id: ID) => void;

  // Tables
  setTableStatus: (id: ID, status: TableStatus) => void;
  upsertTable: (t: Table) => void;
  deleteTable: (id: ID) => void;

  // Menu
  upsertCategory: (c: Category) => void;
  deleteCategory: (id: ID) => void;
  upsertMenuItem: (m: MenuItem) => void;
  deleteMenuItem: (id: ID) => void;
  toggleAvailability: (id: ID) => void;

  // Customers
  upsertCustomer: (c: Customer) => Customer;
  deleteCustomer: (id: ID) => void;

  // Inventory
  upsertIngredient: (i: IngredientStock) => void;
  deleteIngredient: (id: ID) => void;
  adjustStock: (id: ID, delta: number) => void;

  // Vendors
  upsertVendor: (v: Vendor) => void;
  deleteVendor: (id: ID) => void;

  // Staff
  upsertStaff: (s: Staff) => void;
  deleteStaff: (id: ID) => void;

  // Settings
  updateSettings: (patch: Partial<Settings>) => void;

  // Reset
  resetDemoData: () => void;
}

const initialOrders = seedOrders();
const initialCounter = (initialOrders[initialOrders.length - 1]?.number || 1000) + 1;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      categories: seedCategories,
      menu: seedMenu,
      tables: seedTables,
      customers: seedCustomers,
      ingredients: seedIngredients,
      vendors: seedVendors,
      staff: seedStaff,
      orders: initialOrders,
      settings: seedSettings,

      currentUserId: 's1',
      cart: [],
      cartType: 'dine-in',
      cartTableId: undefined,
      cartCustomerId: undefined,
      cartDiscount: 0,
      orderCounter: initialCounter,

      login: (pin) => {
        const user = get().staff.find((s) => s.pin === pin && s.active);
        if (user) set({ currentUserId: user.id });
        return user || null;
      },
      logout: () => set({ currentUserId: null }),

      addToCart: (menuItemId, qty = 1) => {
        const cart = [...get().cart];
        const idx = cart.findIndex((l) => l.menuItemId === menuItemId);
        if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
        else cart.push({ id: uid(), menuItemId, qty });
        set({ cart });
      },
      updateCartQty: (lineId, qty) =>
        set({
          cart: get()
            .cart.map((l) => (l.id === lineId ? { ...l, qty: Math.max(1, qty) } : l))
            .filter((l) => l.qty > 0),
        }),
      removeFromCart: (lineId) => set({ cart: get().cart.filter((l) => l.id !== lineId) }),
      setCartNotes: (lineId, notes) =>
        set({ cart: get().cart.map((l) => (l.id === lineId ? { ...l, notes } : l)) }),
      setCartType: (t) => set({ cartType: t, cartTableId: t === 'dine-in' ? get().cartTableId : undefined }),
      setCartTable: (id) => set({ cartTableId: id }),
      setCartCustomer: (id) => set({ cartCustomerId: id }),
      setCartDiscount: (d) => set({ cartDiscount: Math.max(0, d) }),
      clearCart: () => set({ cart: [], cartTableId: undefined, cartCustomerId: undefined, cartDiscount: 0, cartType: 'dine-in' }),

      placeOrder: (payment) => {
        const s = get();
        if (s.cart.length === 0) return null;
        const items: OrderItem[] = s.cart.map((l) => {
          const m = s.menu.find((x) => x.id === l.menuItemId)!;
          return { id: l.id, menuItemId: m.id, name: m.name, price: m.price, qty: l.qty, notes: l.notes, status: 'served' };
        });
        const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
        const discounted = Math.max(0, subtotal - s.cartDiscount);
        const taxAmount = Math.round((discounted * s.settings.defaultTax) / 100);
        const total = discounted + taxAmount;
        const order: Order = {
          id: uid(),
          number: s.orderCounter,
          type: s.cartType,
          tableId: s.cartTableId,
          customerId: s.cartCustomerId,
          items,
          status: 'completed',
          payment,
          discount: s.cartDiscount,
          taxAmount,
          subtotal,
          total,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          servedBy: s.currentUserId || undefined,
        };
        // update tables
        const tables = s.tables.map((t) => (t.id === s.cartTableId ? { ...t, status: 'free' as TableStatus, currentOrderId: undefined } : t));
        // update customer
        let customers = s.customers;
        if (s.cartCustomerId) {
          customers = customers.map((c) =>
            c.id === s.cartCustomerId
              ? {
                  ...c,
                  visits: c.visits + 1,
                  totalSpent: c.totalSpent + total,
                  loyaltyPoints: c.loyaltyPoints + Math.floor((total * s.settings.loyaltyPercent) / 100),
                  lastVisit: Date.now(),
                }
              : c
          );
        }
        // deplete inventory by recipe
        const ingredients = [...s.ingredients];
        items.forEach((it) => {
          const m = s.menu.find((x) => x.id === it.menuItemId);
          m?.recipe?.forEach((r) => {
            const idx = ingredients.findIndex((g) => g.id === r.ingredientId);
            if (idx >= 0) ingredients[idx] = { ...ingredients[idx], stock: Math.max(0, ingredients[idx].stock - r.quantity * it.qty) };
          });
        });
        set({
          orders: [order, ...s.orders],
          orderCounter: s.orderCounter + 1,
          tables,
          customers,
          ingredients,
          cart: [],
          cartTableId: undefined,
          cartCustomerId: undefined,
          cartDiscount: 0,
        });
        return order;
      },

      saveAsKOT: () => {
        const s = get();
        if (s.cart.length === 0) return null;
        const items: OrderItem[] = s.cart.map((l) => {
          const m = s.menu.find((x) => x.id === l.menuItemId)!;
          return { id: l.id, menuItemId: m.id, name: m.name, price: m.price, qty: l.qty, notes: l.notes, status: 'new' };
        });
        const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
        const discounted = Math.max(0, subtotal - s.cartDiscount);
        const taxAmount = Math.round((discounted * s.settings.defaultTax) / 100);
        const total = discounted + taxAmount;
        const order: Order = {
          id: uid(),
          number: s.orderCounter,
          type: s.cartType,
          tableId: s.cartTableId,
          customerId: s.cartCustomerId,
          items,
          status: 'preparing',
          payment: 'unpaid',
          discount: s.cartDiscount,
          taxAmount,
          subtotal,
          total,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          servedBy: s.currentUserId || undefined,
        };
        const tables = s.tables.map((t) =>
          t.id === s.cartTableId ? { ...t, status: 'occupied' as TableStatus, currentOrderId: order.id } : t
        );
        set({
          orders: [order, ...s.orders],
          orderCounter: s.orderCounter + 1,
          tables,
          cart: [],
          cartTableId: undefined,
          cartCustomerId: undefined,
          cartDiscount: 0,
        });
        return order;
      },

      updateOrderStatus: (id, status) =>
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status, updatedAt: Date.now() } : o)),
        }),

      updateOrderItemStatus: (orderId, itemId, status) =>
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? { ...o, items: o.items.map((it) => (it.id === itemId ? { ...it, status } : it)), updatedAt: Date.now() }
              : o
          ),
        }),

      addItemsToOrder: (orderId, items) =>
        set({
          orders: get().orders.map((o) => {
            if (o.id !== orderId) return o;
            const merged = [...o.items, ...items];
            const subtotal = merged.reduce((a, b) => a + b.price * b.qty, 0);
            const discounted = Math.max(0, subtotal - o.discount);
            const taxAmount = Math.round((discounted * get().settings.defaultTax) / 100);
            return { ...o, items: merged, subtotal, taxAmount, total: discounted + taxAmount, updatedAt: Date.now() };
          }),
        }),

      payOrder: (id, method) => {
        const s = get();
        const order = s.orders.find((o) => o.id === id);
        if (!order) return;
        const tables = s.tables.map((t) =>
          t.currentOrderId === id ? { ...t, status: 'cleaning' as TableStatus, currentOrderId: undefined } : t
        );
        let customers = s.customers;
        if (order.customerId) {
          customers = customers.map((c) =>
            c.id === order.customerId
              ? {
                  ...c,
                  visits: c.visits + 1,
                  totalSpent: c.totalSpent + order.total,
                  loyaltyPoints: c.loyaltyPoints + Math.floor((order.total * s.settings.loyaltyPercent) / 100),
                  lastVisit: Date.now(),
                }
              : c
          );
        }
        set({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, payment: method, status: 'completed', updatedAt: Date.now() } : o
          ),
          tables,
          customers,
        });
      },

      cancelOrder: (id) => {
        const s = get();
        const tables = s.tables.map((t) =>
          t.currentOrderId === id ? { ...t, status: 'free' as TableStatus, currentOrderId: undefined } : t
        );
        set({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: 'cancelled', updatedAt: Date.now() } : o)),
          tables,
        });
      },

      setTableStatus: (id, status) =>
        set({ tables: get().tables.map((t) => (t.id === id ? { ...t, status } : t)) }),

      upsertTable: (t) => {
        const arr = get().tables;
        const exists = arr.find((x) => x.id === t.id);
        set({ tables: exists ? arr.map((x) => (x.id === t.id ? t : x)) : [...arr, t] });
      },
      deleteTable: (id) => set({ tables: get().tables.filter((t) => t.id !== id) }),

      upsertCategory: (c) => {
        const arr = get().categories;
        const exists = arr.find((x) => x.id === c.id);
        set({ categories: exists ? arr.map((x) => (x.id === c.id ? c : x)) : [...arr, c] });
      },
      deleteCategory: (id) =>
        set({
          categories: get().categories.filter((c) => c.id !== id),
          menu: get().menu.filter((m) => m.categoryId !== id),
        }),

      upsertMenuItem: (m) => {
        const arr = get().menu;
        const exists = arr.find((x) => x.id === m.id);
        set({ menu: exists ? arr.map((x) => (x.id === m.id ? m : x)) : [...arr, m] });
      },
      deleteMenuItem: (id) => set({ menu: get().menu.filter((m) => m.id !== id) }),
      toggleAvailability: (id) =>
        set({ menu: get().menu.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) }),

      upsertCustomer: (c) => {
        const arr = get().customers;
        const exists = arr.find((x) => x.id === c.id);
        const next = exists ? arr.map((x) => (x.id === c.id ? c : x)) : [...arr, c];
        set({ customers: next });
        return c;
      },
      deleteCustomer: (id) => set({ customers: get().customers.filter((c) => c.id !== id) }),

      upsertIngredient: (i) => {
        const arr = get().ingredients;
        const exists = arr.find((x) => x.id === i.id);
        set({ ingredients: exists ? arr.map((x) => (x.id === i.id ? i : x)) : [...arr, i] });
      },
      deleteIngredient: (id) => set({ ingredients: get().ingredients.filter((i) => i.id !== id) }),
      adjustStock: (id, delta) =>
        set({
          ingredients: get().ingredients.map((i) =>
            i.id === id ? { ...i, stock: Math.max(0, i.stock + delta), lastUpdated: Date.now() } : i
          ),
        }),

      upsertVendor: (v) => {
        const arr = get().vendors;
        const exists = arr.find((x) => x.id === v.id);
        set({ vendors: exists ? arr.map((x) => (x.id === v.id ? v : x)) : [...arr, v] });
      },
      deleteVendor: (id) => set({ vendors: get().vendors.filter((v) => v.id !== id) }),

      upsertStaff: (s) => {
        const arr = get().staff;
        const exists = arr.find((x) => x.id === s.id);
        set({ staff: exists ? arr.map((x) => (x.id === s.id ? s : x)) : [...arr, s] });
      },
      deleteStaff: (id) => set({ staff: get().staff.filter((s) => s.id !== id) }),

      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

      resetDemoData: () => {
        const orders = seedOrders();
        set({
          categories: seedCategories,
          menu: seedMenu,
          tables: seedTables,
          customers: seedCustomers,
          ingredients: seedIngredients,
          vendors: seedVendors,
          staff: seedStaff,
          orders,
          settings: seedSettings,
          orderCounter: (orders[orders.length - 1]?.number || 1000) + 1,
          cart: [],
          cartTableId: undefined,
          cartCustomerId: undefined,
          cartDiscount: 0,
          cartType: 'dine-in',
        });
      },
    }),
    { name: 'petpooja-store-v1' }
  )
);

export const newId = uid;
