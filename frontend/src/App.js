import React, { useState, useEffect } from 'react';
import './App.css';
import StationList from './components/StationList';
import RecommendationPanel from './components/RecommendationPanel';
import BookingPanel from './components/BookingPanel';
import DemandChart from './components/DemandChart';
import { fetchStations, getRecommendation, predictDemand } from './services/api';

function App() {
  const [loginRole, setLoginRole] = useState('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRole, setActiveRole] = useState('user');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [stations, setStations] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [demandData, setDemandData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [stationViewLimit, setStationViewLimit] = useState('5');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError('');
      },
      () => {
        setLocationError('Location permission denied. Showing default stations.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Fetch stations on mount and every 5 seconds
  useEffect(() => {
    const loadStations = async () => {
      try {
        const limitToUse = stationViewLimit === 'all' ? 'all' : Number(stationViewLimit);
        const data = await fetchStations(userLocation, limitToUse);
        setStations(data.stations || []);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };

    loadStations();
    const interval = setInterval(loadStations, 5000);
    return () => clearInterval(interval);
  }, [userLocation, stationViewLimit]);

  // Fetch demand prediction
  useEffect(() => {
    const loadDemand = async () => {
      try {
        const data = await predictDemand();
        setDemandData(data);
      } catch (error) {
        console.error('Error fetching demand:', error);
      }
    };

    loadDemand();
    const interval = setInterval(loadDemand, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFindBestStation = async () => {
    setLoading(true);
    try {
      const locationToUse = userLocation || { lat: 12.9716, lng: 77.5946 };
      const data = await getRecommendation(locationToUse);
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (loginRole === 'owner') {
      if (loginForm.username !== 'owner' || loginForm.password !== 'owner123') {
        setLoginError('Owner login failed. Use username: owner and password: owner123');
        return;
      }
    } else {
      if (loginForm.username.trim().length < 2 || loginForm.password.trim().length < 4) {
        setLoginError('User login failed. Enter a valid username and password.');
        return;
      }
    }

    setLoginError('');
    setActiveRole(loginRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveRole('user');
    setLoginRole('user');
    setLoginForm({ username: '', password: '' });
    setLoginError('');
    setRecommendation(null);
    setSelectedStation(null);
  };

  const totalAvailable = stations.reduce(
    (sum, station) => sum + (station.total_chargers - station.active_chargers),
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="app auth-app">
        <div className="login-card">
          <h1>⚡ EV Charging Portal</h1>
          <p>Select your role and login</p>

          <div className="login-role-switch">
            <button
              className={loginRole === 'user' ? 'role-btn active' : 'role-btn'}
              onClick={() => {
                setLoginRole('user');
                setLoginError('');
              }}
            >
              User Login
            </button>
            <button
              className={loginRole === 'owner' ? 'role-btn active' : 'role-btn'}
              onClick={() => {
                setLoginRole('owner');
                setLoginError('');
              }}
            >
              Owner Login
            </button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder={loginRole === 'owner' ? 'owner' : 'Enter username'}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder={loginRole === 'owner' ? 'owner123' : 'Enter password'}
            />

            {loginError && <p className="login-error">{loginError}</p>}

            <button type="submit" className="login-submit">
              Continue as {loginRole === 'user' ? 'User' : 'Owner'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ Smart EV Charging Optimization</h1>
        <p>Real-time station optimization & demand prediction</p>
        <div className="session-bar">
          <span className="role-pill">Logged in as: {activeRole.toUpperCase()}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        {userLocation && (
          <p>
            Using your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
        )}
        {!userLocation && locationError && <p>{locationError}</p>}
        <div className="limit-filter">
          <label htmlFor="station-limit">Show:</label>
          <select
            id="station-limit"
            value={stationViewLimit}
            onChange={(e) => setStationViewLimit(e.target.value)}
          >
            <option value="5">Nearest 5</option>
            <option value="10">Nearest 10</option>
            <option value="all">All Stations</option>
          </select>
        </div>
      </header>

      <main className="app-main">
        {activeRole === 'owner' && (
          <section className="owner-summary">
            <div className="owner-stat">
              <span>Total Stations</span>
              <strong>{stations.length}</strong>
            </div>
            <div className="owner-stat">
              <span>Available Chargers</span>
              <strong>{totalAvailable}</strong>
            </div>
            <div className="owner-stat">
              <span>Active Chargers</span>
              <strong>{stations.reduce((sum, station) => sum + station.active_chargers, 0)}</strong>
            </div>
          </section>
        )}

        <div className="container">
          {/* Left Panel */}
          <div className="left-panel">
            {activeRole === 'user' ? (
              <RecommendationPanel
                recommendation={recommendation}
                onFindBest={handleFindBestStation}
                loading={loading}
                userLocation={userLocation}
              />
            ) : (
              <div className="owner-panel">
                <h2>Owner Dashboard</h2>
                <p>
                  You are in owner mode. Monitor network performance, demand prediction,
                  and station health in real time.
                </p>
              </div>
            )}

            {selectedStation && activeRole === 'user' && (
              <BookingPanel
                station={selectedStation}
                userLocation={userLocation}
                onClose={() => setSelectedStation(null)}
              />
            )}

            {demandData && <DemandChart data={demandData} />}
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <StationList
              stations={stations}
              onSelectStation={setSelectedStation}
              recommendedStationId={recommendation?.station_id}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
