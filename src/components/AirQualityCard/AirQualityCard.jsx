import { Wind } from 'lucide-react';
import { getAQICategory } from '../../services/weatherApi';
import './AirQualityCard.css';

const AirQualityCard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="air-quality-card">
        <h2 className="section-title">Air Quality</h2>
        <div className="aqi-loading" />
      </div>
    );
  }

  if (!data || !data.air_quality || data.air_quality.current.us_aqi === null) {
    return null;
  }

  const aqi = Math.round(data.air_quality.current.us_aqi);
  const { category, color } = getAQICategory(aqi);

  const getAQIDescription = (category) => {
    const descriptions = {
      'Good': 'Air quality is satisfactory. Enjoy outdoor activities.',
      'Moderate': 'Air quality is acceptable. Sensitive groups should limit outdoor activities.',
      'Unhealthy for Sensitive Groups': 'Members of sensitive groups may experience health effects.',
      'Unhealthy': 'Everyone may begin to experience health effects.',
      'Very Unhealthy': 'Health alert: The entire population is likely to be affected.',
      'Hazardous': 'Health warning of emergency conditions: The entire population is likely to be affected.'
    };
    return descriptions[category] || 'Air quality data unavailable';
  };

  return (
    <div className="air-quality-card">
      <div className="aqi-header">
        <h2 className="section-title">Air Quality</h2>
        <Wind size={24} className="aqi-icon" />
      </div>

      <div className="aqi-content">
        <div className="aqi-indicator">
          <svg className="aqi-circle" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={`${(aqi / 500) * 565.4} 565.4`}
              strokeLinecap="round"
              className="aqi-progress"
            />
          </svg>
          <div className="aqi-value">{aqi}</div>
        </div>

        <div className="aqi-info">
          <h3 className="aqi-category" style={{ color }}>{category}</h3>
          <p className="aqi-description">{getAQIDescription(category)}</p>

          <div className="aqi-scale">
            <div className="scale-item">
              <span className="scale-label">Good</span>
              <span className="scale-range">0-50</span>
            </div>
            <div className="scale-item">
              <span className="scale-label">Moderate</span>
              <span className="scale-range">51-100</span>
            </div>
            <div className="scale-item">
              <span className="scale-label">Unhealthy*</span>
              <span className="scale-range">101-150</span>
            </div>
            <div className="scale-item">
              <span className="scale-label">Unhealthy</span>
              <span className="scale-range">151-200</span>
            </div>
            <div className="scale-item">
              <span className="scale-label">Very Unhealthy</span>
              <span className="scale-range">201-300</span>
            </div>
            <div className="scale-item">
              <span className="scale-label">Hazardous</span>
              <span className="scale-range">301+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;
