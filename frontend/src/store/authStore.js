/**
 * Auth Store
 * Manages authentication state across the app
 */

// Simple in-memory auth store
// TODO: Replace with Zustand or Redux if needed for complex state
let authState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Listeners for state changes
const listeners = new Set();

const AuthStore = {
  /**
   * Get the current auth state
   */
  getState: () => ({ ...authState }),

  /**
   * Set user data after login
   * @param {Object} user - User/partner data
   * @param {string} token - Auth token
   */
  setUser: (user, token) => {
    authState = {
      ...authState,
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    };
    AuthStore._notifyListeners();
  },

  /**
   * Clear user data on logout
   */
  clearUser: () => {
    authState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
    AuthStore._notifyListeners();
  },

  /**
   * Set loading state
   * @param {boolean} loading
   */
  setLoading: (loading) => {
    authState = { ...authState, isLoading: loading };
    AuthStore._notifyListeners();
  },

  /**
   * Subscribe to state changes
   * @param {Function} listener - Callback on state change
   * @returns {Function} Unsubscribe function
   */
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Notify all listeners */
  _notifyListeners: () => {
    listeners.forEach((listener) => listener(authState));
  },
};

export default AuthStore;
