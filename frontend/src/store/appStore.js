/**
 * App Store
 * Manages global app-level state (duty status, connectivity, etc.)
 */

let appState = {
  dutyStatus: 'offline', // 'online' or 'offline'
  isConnected: true,
  appReady: false,
};

const listeners = new Set();

const AppStore = {
  getState: () => ({ ...appState }),

  setDutyStatus: (status) => {
    appState = { ...appState, dutyStatus: status };
    AppStore._notifyListeners();
  },

  setConnected: (isConnected) => {
    appState = { ...appState, isConnected };
    AppStore._notifyListeners();
  },

  setAppReady: (ready) => {
    appState = { ...appState, appReady: ready };
    AppStore._notifyListeners();
  },

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  _notifyListeners: () => {
    listeners.forEach((listener) => listener(appState));
  },
};

export default AppStore;
