import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { searchCities } from '../../services/weatherApi';
import { useRecentSearches } from '../../hooks/useWeather';
import './SearchBar.css';

const SearchBar = ({ onCitySelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { searches, addSearch, clearSearches } = useRecentSearches();

  const handleSearch = async (value) => {
    setQuery(value);
    
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const cities = await searchCities(value);
      setResults(cities);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCity = (city) => {
    const cityData = {
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude
    };
    
    addSearch(cityData);
    onCitySelect(cityData);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search city..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          disabled={isLoading}
        />
        {query && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-dropdown">
          {searching && (
            <div className="search-loading">
              <div className="spinner" />
              <span>Searching...</span>
            </div>
          )}

          {!searching && results.length > 0 && (
            <ul className="search-results">
              {results.map((city, idx) => (
                <li key={idx}>
                  <button
                    className="search-result-item"
                    onClick={() => handleSelectCity(city)}
                  >
                    <div className="result-name">{city.name}</div>
                    <div className="result-meta">
                      {city.admin1 && <span>{city.admin1}</span>}
                      <span>{city.country}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!searching && query && results.length === 0 && (
            <div className="search-empty">
              <div>No cities found</div>
              <span className="text-secondary">Try searching for another city</span>
            </div>
          )}

          {!query && searches.length > 0 && (
            <div className="recent-searches">
              <div className="recent-header">
                <div className="recent-title">
                  <Clock size={16} />
                  <span>Recent Searches</span>
                </div>
                <button
                  className="clear-recent"
                  onClick={clearSearches}
                  title="Clear history"
                >
                  Clear
                </button>
              </div>
              <ul className="recent-list">
                {searches.map((search, idx) => (
                  <li key={idx}>
                    <button
                      className="recent-item"
                      onClick={() => handleSelectCity(search)}
                    >
                      <div className="recent-name">{search.name}</div>
                      <div className="recent-country">{search.country}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
