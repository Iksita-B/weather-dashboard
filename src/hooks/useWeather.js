import { useState, useCallback, useEffect } from 'react';
import { getLocationWeather } from '../services/weatherApi';

/**
 * Custom hook for weather data management
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} cityName - City name for display
 */
export const useWeather = (latitude, longitude, cityName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!latitude || !longitude) return;

    setLoading(true);
    setError(null);

    try {
      const weatherData = await getLocationWeather(latitude, longitude);
      setData({
        ...weatherData,
        cityName
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, cityName]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeather
  };
};

/**
 * Custom hook for managing recent searches in localStorage
 */
export const useRecentSearches = () => {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  const addSearch = useCallback((search) => {
    setSearches(prevSearches => {
      const filtered = prevSearches.filter(
        s => !(s.latitude === search.latitude && s.longitude === search.longitude)
      );
      const updated = [search, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  return {
    searches,
    addSearch,
    clearSearches
  };
};
