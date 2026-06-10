import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import './TemperatureChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const TemperatureChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="temperature-chart">
        <h2 className="section-title">Temperature Trend</h2>
        <div className="chart-loading" style={{ height: '300px' }} />
      </div>
    );
  }

  if (!data || !data.hourly) {
    return null;
  }

  const hourly = data.hourly;
  const now = new Date();
  const currentHour = now.getHours();

  // Get next 24 hours
  const labels = Array.from({ length: 24 }, (_, i) => {
    const hour = (currentHour + i) % 24;
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });
  });

  const temperatures = Array.from({ length: 24 }, (_, i) => {
    if (i >= hourly.temperature_2m.length) return null;
    return hourly.temperature_2m[i];
  }).filter(Boolean);

  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const avgTemp = (minTemp + maxTemp) / 2;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: 'rgba(0, 212, 255, 0.8)',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(0, 212, 255, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgba(0, 212, 255, 1)',
        clip: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 20, 25, 0.9)',
        titleColor: '#ffffff',
        bodyColor: 'rgba(160, 169, 201, 1)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${Math.round(context.parsed.y)}°C`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: 'rgba(160, 169, 201, 0.6)',
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(160, 169, 201, 0.6)',
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          callback: function(value) {
            return value + '°';
          }
        },
        min: Math.floor(minTemp - 2),
        max: Math.ceil(maxTemp + 2)
      }
    }
  };

  return (
    <div className="temperature-chart">
      <div className="chart-header">
        <h2 className="section-title">Temperature Trend</h2>
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">High</span>
            <span className="stat-value">{Math.round(maxTemp)}°</span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg</span>
            <span className="stat-value">{Math.round(avgTemp)}°</span>
          </div>
          <div className="stat">
            <span className="stat-label">Low</span>
            <span className="stat-value">{Math.round(minTemp)}°</span>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TemperatureChart;
