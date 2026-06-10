import { Cloud, Wind, Gauge, Eye, Sun, Droplets } from 'lucide-react';
import './WeatherHighlights.css';

const WeatherHighlights = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="weather-highlights">
        <h2 className="section-title">Weather Highlights</h2>
        <div className="highlights-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="highlight-card skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.current) {
    return null;
  }

  const current = data.current;
  const daily = data.daily;

  const highlights = [
    {
      title: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      description: 'Relative humidity',
      icon: Droplets,
      color: '#3b82f6'
    },
    {
      title: 'Wind Speed',
      value: `${Math.round(current.wind_speed_10m)} km/h`,
      description: 'Wind speed',
      icon: Wind,
      color: '#06b6d4'
    },
    {
      title: 'Pressure',
      value: `${Math.round(current.pressure_msl)} hPa`,
      description: 'Atmospheric pressure',
      icon: Gauge,
      color: '#8b5cf6'
    },
    {
      title: 'Visibility',
      value: `${Math.round(10)} km`,
      description: 'Visibility distance',
      icon: Eye,
      color: '#ec4899'
    },
    {
      title: 'UV Index',
      value: daily.uv_index_max[0] ? Math.round(daily.uv_index_max[0]) : 'N/A',
      description: daily.uv_index_max[0] ? getUVDescription(daily.uv_index_max[0]) : 'Not available',
      icon: Sun,
      color: '#f59e0b'
    },
    {
      title: 'Precipitation',
      value: `${Math.round(daily.precipitation_sum[0] || 0)} mm`,
      description: 'Daily precipitation',
      icon: Cloud,
      color: '#10b981'
    }
  ];

  return (
    <div className="weather-highlights">
      <h2 className="section-title">Weather Highlights</h2>
      <div className="highlights-grid">
        {highlights.map((highlight, idx) => (
          <HighlightCard
            key={idx}
            {...highlight}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};

const HighlightCard = ({ title, value, description, icon: Icon, color, index }) => {
  return (
    <div
      className="highlight-card"
      style={{
        '--stagger': `${index * 50}ms`,
        '--color': color
      }}
    >
      <div className="highlight-icon">
        <Icon size={28} style={{ color }} />
      </div>
      <div className="highlight-content">
        <h3 className="highlight-title">{title}</h3>
        <p className="highlight-value">{value}</p>
        <p className="highlight-description">{description}</p>
      </div>
    </div>
  );
};

function getUVDescription(uvIndex) {
  if (uvIndex < 3) return 'Low';
  if (uvIndex < 6) return 'Moderate';
  if (uvIndex < 8) return 'High';
  if (uvIndex < 11) return 'Very High';
  return 'Extreme';
}

export default WeatherHighlights;
