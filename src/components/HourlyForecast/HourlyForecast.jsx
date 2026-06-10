import { Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { getWeatherDescription } from '../../services/weatherApi';
import './HourlyForecast.css';

const HourlyForecast = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="hourly-forecast">
        <h2 className="section-title">Next 24 Hours</h2>
        <div className="hourly-scroll">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="hourly-card skeleton-hourly" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.hourly) {
    return null;
  }

  const hourly = data.hourly;
  const now = new Date();
  const currentHour = now.getHours();
  
  // Get next 24 hours of data
  const forecast = Array.from({ length: 24 }, (_, i) => {
    const hourOffset = i;
    const hour = (currentHour + hourOffset) % 24;
    const timeIndex = hourOffset;
    
    if (timeIndex >= hourly.time.length) return null;
    
    return {
      time: new Date(new Date().setHours(hour, 0, 0, 0)).toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: true
      }),
      temp: Math.round(hourly.temperature_2m[timeIndex]),
      code: hourly.weather_code[timeIndex],
      humidity: hourly.relative_humidity_2m[timeIndex]
    };
  }).filter(Boolean);

  const getHourlyWeatherIcon = (code) => {
    if (code === 0 || code === 1) return <Cloud size={32} />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={32} />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow size={32} />;
    if ([95, 96, 99].includes(code)) return <CloudLightning size={32} />;
    return <Cloud size={32} />;
  };

  return (
    <div className="hourly-forecast">
      <h2 className="section-title">Next 24 Hours</h2>
      <div className="hourly-scroll">
        {forecast.map((hour, idx) => (
          <div
            key={idx}
            className="hourly-card"
            style={{ '--stagger': `${idx * 50}ms` }}
          >
            <div className="hourly-time">{hour.time}</div>
            <div className="hourly-icon">
              {getHourlyWeatherIcon(hour.code)}
            </div>
            <div className="hourly-temp">{hour.temp}°</div>
            <div className="hourly-humidity">{hour.humidity}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
