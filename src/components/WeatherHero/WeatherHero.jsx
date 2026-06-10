import { Cloud, CloudRain, CloudSnow, CloudLightning, Eye } from 'lucide-react';
import { getWeatherDescription } from '../../services/weatherApi';
import './WeatherHero.css';

const WeatherHero = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="weather-hero">
        <div className="weather-hero-loading">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-temp" />
          <div className="skeleton skeleton-desc" />
        </div>
      </div>
    );
  }

  if (!data || !data.current) {
    return null;
  }

  const current = data.current;
  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const humidity = current.relative_humidity_2m;
  const windSpeed = Math.round(current.wind_speed_10m);
  const description = getWeatherDescription(current.weather_code, current.is_day);
  const city = data.cityName || 'Unknown Location';

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const getWeatherIcon = () => {
    const code = current.weather_code;
    if (code === 0 || code === 1) return <Cloud className="weather-icon" size={60} />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="weather-icon" size={60} />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className="weather-icon" size={60} />;
    if ([95, 96, 99].includes(code)) return <CloudLightning className="weather-icon" size={60} />;
    return <Cloud className="weather-icon" size={60} />;
  };

  return (
    <div className="weather-hero">
      <div className="weather-hero-content">
        <div className="location-header">
          <h1 className="city-name">{city}</h1>
          <p className="date-time">
            <span>{date}</span>
            <span className="separator">•</span>
            <span>{time}</span>
          </p>
        </div>

        <div className="temperature-section">
          <div className="temp-display">
            <div className="weather-icon-wrapper">
              {getWeatherIcon()}
            </div>
            <div className="temp-value">
              <span className="current-temp">{temp}</span>
              <span className="degree-symbol">°</span>
            </div>
          </div>
          <p className="weather-description">{description}</p>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">{feelsLike}°</span>
          </div>
          <div className="detail-divider" />
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
          <div className="detail-divider" />
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHero;
