import './WeatherScene.css';

const WeatherScene = ({ sceneType = 'clear' }) => {
  return (
    <div className={`weather-scene weather-scene--${sceneType}`}>
      {sceneType === 'clear' && <ClearScene />}
      {sceneType === 'cloudy' && <CloudyScene />}
      {sceneType === 'rain' && <RainScene />}
      {sceneType === 'thunderstorm' && <ThunderstormScene />}
      {sceneType === 'snow' && <SnowScene />}
      {sceneType === 'night' && <NightScene />}
    </div>
  );
};

const ClearScene = () => (
  <div className="scene-content">
    <div className="sun">
      <div className="sun-glow" />
      <div className="sun-core" />
    </div>
    <div className="particles">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }} />
      ))}
    </div>
  </div>
);

const CloudyScene = () => (
  <div className="scene-content">
    <div className="clouds">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="cloud" style={{ '--delay': `${i * 0.5}s` }} />
      ))}
    </div>
  </div>
);

const RainScene = () => (
  <div className="scene-content">
    <div className="clouds">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="cloud cloud--rain" style={{ '--delay': `${i * 0.5}s` }} />
      ))}
    </div>
    <div className="rain">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="raindrop" style={{ '--delay': `${(i % 20) * 0.05}s` }} />
      ))}
    </div>
  </div>
);

const ThunderstormScene = () => (
  <div className="scene-content">
    <div className="lightning" />
    <div className="clouds">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="cloud cloud--storm" style={{ '--delay': `${i * 0.5}s` }} />
      ))}
    </div>
    <div className="rain">
      {[...Array(80)].map((_, i) => (
        <div key={i} className="raindrop raindrop--heavy" style={{ '--delay': `${(i % 20) * 0.02}s` }} />
      ))}
    </div>
  </div>
);

const SnowScene = () => (
  <div className="scene-content">
    <div className="snow">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i} 
          className="snowflake" 
          style={{ 
            '--delay': `${i * 0.05}s`,
            '--left': `${(i * 17) % 100}%`
          }} 
        />
      ))}
    </div>
  </div>
);

const NightScene = () => (
  <div className="scene-content">
    <div className="moon">
      <div className="moon-core" />
    </div>
    <div className="stars">
      {[...Array(100)].map((_, i) => (
        <div 
          key={i} 
          className="star" 
          style={{
            '--delay': `${Math.random() * 3}s`,
            '--top': `${Math.random() * 100}%`,
            '--left': `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  </div>
);

export default WeatherScene;
