import { Suspense } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import './styles/variables.css';
import './index.css';
import './App.css';

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Dashboard />
    </Suspense>
  );
}

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-spinner">
      <div className="spinner" />
    </div>
    <p>Loading weather data...</p>
  </div>
);

export default App;
