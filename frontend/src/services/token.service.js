/**
 * Token Service
 * Manages authentication token storage using AsyncStorage
 */

// TODO: Install @react-native-async-storage/async-storage
// npm install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

const TokenService = {
  /**
   * Save the Firebase ID token
   * @param {string} token - Firebase auth token
   */
  saveToken: async (token) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  /**
   * Retrieve the stored token
   * @returns {Promise<string|null>} The stored token or null
   */
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Remove the stored token (logout)
   */
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  /**
   * Save user data object
   * @param {Object} userData - User data to persist
   */
  saveUserData: async (userData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  /**
   * Retrieve stored user data
   * @returns {Promise<Object|null>} Parsed user data or null
   */
  getUserData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  /**
   * Clear all app-related storage
   */
  clearAll: async () => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default TokenService;
