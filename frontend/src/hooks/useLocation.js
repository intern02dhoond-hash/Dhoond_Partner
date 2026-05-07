/**
 * useLocation Hook
 * Manages location permissions and tracking
 */

import { useState, useEffect } from 'react';
import LocationService from '../services/location.service';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Request location permission on mount
   */
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await LocationService.requestPermission();
      setHasPermission(granted);
    };
    checkPermission();
  }, []);

  /**
   * Fetch the current location once
   */
  const getCurrentLocation = async () => {
    if (!hasPermission) {
      console.warn('Location permission not granted');
      return null;
    }

    setIsLoading(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      setLocation(coords);
      return coords;
    } catch (error) {
      console.error('Location error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    hasPermission,
    isLoading,
    getCurrentLocation,
  };
};

export default useLocation;
