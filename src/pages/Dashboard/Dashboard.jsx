import { useState } from 'react';
import WeatherScene from '../../components/WeatherScene/WeatherScene';
import SearchBar from '../../components/SearchBar/SearchBar';
import WeatherHero from '../../components/WeatherHero/WeatherHero';
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast';
import TemperatureChart from '../../components/TemperatureChart/TemperatureChart';
import WeatherHighlights from '../../components/WeatherHighlights/WeatherHighlights';
import AirQualityCard from '../../components/AirQualityCard/AirQualityCard';
import ForecastCards from '../../components/ForecastCards/ForecastCards';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherScene } from '../../services/weatherApi';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState({
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.0060
  });

  const { data: weatherData, loading, error } = useWeather(
    selectedCity.latitude,
    selectedCity.longitude,
    selectedCity.name
  );

  const sceneType = weatherData?.current
    ? getWeatherScene(weatherData.current.weather_code, weatherData.current.is_day)
    : 'clear';

  const handleCitySelect = (city) => {
    setSelectedCity({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude
    });
  };

  return (
    <div className="dashboard">
      <WeatherScene sceneType={sceneType} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="app-title">Weather</h1>
            <SearchBar onCitySelect={handleCitySelect} isLoading={loading} />
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        <div className="dashboard-content">
          <WeatherHero data={weatherData} loading={loading} />

          <div className="dashboard-section">
            <HourlyForecast data={weatherData} loading={loading} />
          </div>

          <div className="dashboard-section">
            <TemperatureChart data={weatherData} loading={loading} />
          </div>

          <div className="dashboard-section">
            <WeatherHighlights data={weatherData} loading={loading} />
          </div>

          <div className="dashboard-grid">
            <div className="grid-item">
              <AirQualityCard data={weatherData} loading={loading} />
            </div>
            <div className="grid-item">
              <ForecastCards data={weatherData} loading={loading} />
            </div>
          </div>
        </div>

        <div className="dashboard-footer">
          <p>Weather data powered by Open-Meteo</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
