/**
 * Order Store
 * Manages order-related state
 */

let orderState = {
  orders: [],
  activeOrder: null,
  broadcasts: [],
  isLoading: false,
};

const listeners = new Set();

const OrderStore = {
  getState: () => ({ ...orderState }),

  setOrders: (orders) => {
    orderState = { ...orderState, orders, isLoading: false };
    OrderStore._notifyListeners();
  },

  setActiveOrder: (order) => {
    orderState = { ...orderState, activeOrder: order };
    OrderStore._notifyListeners();
  },

  setBroadcasts: (broadcasts) => {
    orderState = { ...orderState, broadcasts };
    OrderStore._notifyListeners();
  },

  setLoading: (loading) => {
    orderState = { ...orderState, isLoading: loading };
    OrderStore._notifyListeners();
  },

  clearOrders: () => {
    orderState = { orders: [], activeOrder: null, broadcasts: [], isLoading: false };
    OrderStore._notifyListeners();
  },

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  _notifyListeners: () => {
    listeners.forEach((listener) => listener(orderState));
  },
};

export default OrderStore;
