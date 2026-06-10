import axios from 'axios';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air_quality';

/**
 * Search for cities using Open-Meteo Geocoding API
 * @param {string} query - City name to search
 * @returns {Promise<Array>} Array of cities with coordinates
 */
export const searchCities = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const response = await axios.get(GEOCODING_API, {
      params: {
        name: query,
        count: 5,
        language: 'en',
        format: 'json'
      },
      timeout: 8000
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error('Failed to search cities. Please try again.');
  }
};

/**
 * Get current weather and forecast for coordinates
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Weather data
 */
export const getCurrentWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(WEATHER_API, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,weather_code,is_day',
        hourly: 'temperature_2m,weather_code,relative_humidity_2m,precipitation,precipitation_probability',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,uv_index_max,wind_speed_10m_max',
        timezone: 'auto',
        forecast_days: 7
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
};

/**
 * Get air quality data for coordinates
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Air quality data
 */
export const getAirQuality = async (latitude, longitude) => {
  try {
    const response = await axios.get(AIR_QUALITY_API, {
      params: {
        latitude,
        longitude,
        current: 'us_aqi',
        timezone: 'auto'
      },
      timeout: 8000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    // Return empty data instead of throwing - this is secondary data
    return { current: { us_aqi: null } };
  }
};

/**
 * Get combined weather and air quality data
 */
export const getLocationWeather = async (latitude, longitude) => {
  try {
    const [weatherData, airQualityData] = await Promise.all([
      getCurrentWeather(latitude, longitude),
      getAirQuality(latitude, longitude)
    ]);
    
    return {
      ...weatherData,
      air_quality: airQualityData
    };
  } catch (error) {
    console.error('Error fetching location weather:', error);
    throw error;
  }
};

/**
 * Get weather code description
 */
export const getWeatherDescription = (code, isDay = true) => {
  const weatherCodes = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Heavy Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail'
  };
  
  return weatherCodes[code] || 'Unknown';
};

/**
 * Determine weather scene type based on weather code
 */
export const getWeatherScene = (weatherCode, isDay = true) => {
  if (!isDay) return 'night';
  
  if (weatherCode === 0 || weatherCode === 1) return 'clear';
  if (weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48) return 'cloudy';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'snow';
  if ([95, 96, 99].includes(weatherCode)) return 'thunderstorm';
  
  return 'clear';
};

/**
 * Get AQI category and color
 */
export const getAQICategory = (aqi) => {
  if (aqi <= 50) return { category: 'Good', color: '#10b981' };
  if (aqi <= 100) return { category: 'Moderate', color: '#f59e0b' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#f97316' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ef4444' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#d946ef' };
  return { category: 'Hazardous', color: '#7c2d12' };
};
