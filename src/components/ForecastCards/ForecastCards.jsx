import { Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { getWeatherDescription } from '../../services/weatherApi';
import './ForecastCards.css';

const ForecastCards = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="forecast-cards">
        <h2 className="section-title">7-Day Forecast</h2>
        <div className="forecast-grid">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="forecast-item skeleton-forecast" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.daily) {
    return null;
  }

  const daily = data.daily;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const forecast = Array.from({ length: Math.min(7, daily.time.length) }, (_, i) => {
    const date = new Date(daily.time[i]);
    const isToday = date.toDateString() === now.toDateString();

    return {
      day: isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      code: daily.weather_code[i],
      precipitation: daily.precipitation_sum[i],
      isToday
    };
  });

  const getForecastIcon = (code) => {
    if (code === 0 || code === 1) return <Cloud size={36} />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={36} />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow size={36} />;
    if ([95, 96, 99].includes(code)) return <CloudLightning size={36} />;
    return <Cloud size={36} />;
  };

  return (
    <div className="forecast-cards">
      <h2 className="section-title">7-Day Forecast</h2>
      <div className="forecast-grid">
        {forecast.map((item, idx) => (
          <div
            key={idx}
            className={`forecast-item ${item.isToday ? 'forecast-item--today' : ''}`}
            style={{ '--stagger': `${idx * 50}ms` }}
          >
            <div className="forecast-day">
              <div className="forecast-day-name">{item.day}</div>
              <div className="forecast-date">{item.date}</div>
            </div>

            <div className="forecast-icon">
              {getForecastIcon(item.code)}
            </div>

            <div className="forecast-temps">
              <div className="temp-high">{item.maxTemp}°</div>
              <div className="temp-divider" />
              <div className="temp-low">{item.minTemp}°</div>
            </div>

            {item.precipitation > 0 && (
              <div className="forecast-precipitation">
                <span className="precip-label">💧</span>
                <span className="precip-value">{item.precipitation}mm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCards;
