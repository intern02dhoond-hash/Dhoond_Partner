/**
 * Location Service
 * Handles device location tracking for the partner app
 */

// TODO: Install expo-location or react-native-geolocation-service
// expo install expo-location

const LocationService = {
  /**
   * Request location permissions from the user
   * @returns {Promise<boolean>} Whether permission was granted
   */
  requestPermission: async () => {
    // Placeholder: Replace with actual permission request
    // Example using expo-location:
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // return status === 'granted';
    console.log('Location permission requested');
    return true;
  },

  /**
   * Get the current device location
   * @returns {Promise<Object>} { latitude, longitude }
   */
  getCurrentLocation: async () => {
    // Placeholder: Replace with actual location fetch
    // Example using expo-location:
    // const location = await Location.getCurrentPositionAsync({});
    // return { latitude: location.coords.latitude, longitude: location.coords.longitude };
    console.log('Fetching current location...');
    return { latitude: 0, longitude: 0 };
  },

  /**
   * Start watching location in the background
   * @param {Function} callback - Called with { latitude, longitude } on each update
   * @returns {Object} Subscription to stop watching
   */
  startWatching: (callback) => {
    // Placeholder: Replace with actual location watcher
    console.log('Started location watching');
    const subscription = { remove: () => console.log('Stopped watching') };
    return subscription;
  },
};

export default LocationService;
