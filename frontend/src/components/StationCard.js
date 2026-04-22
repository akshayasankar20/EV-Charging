import React from 'react';
import './StationCard.css';

function StationCard({ station, isRecommended, onSelectStation, userLocation }) {
  const availableChargers = station.total_chargers - station.active_chargers;
  const occupancyRate = (station.active_chargers / station.total_chargers) * 100;
  const loadPercentage = (station.power_current_draw / station.power_capacity) * 100;

  const getStatusColor = () => {
    if (loadPercentage > 85) return '#ef4444'; // red
    if (loadPercentage > 70) return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  const openDirections = () => {
    const destination = `${station.location.lat},${station.location.lng}`;
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : null;

    const mapsUrl = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
      : `https://www.google.com/maps/search/?api=1&query=${destination}`;

    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`station-card ${isRecommended ? 'recommended' : ''}`}>
      {isRecommended && <div className="recommended-badge">✨ RECOMMENDED</div>}

      <div className="card-header">
        <h3>{station.name}</h3>
        <span className="card-id">{station.id}</span>
      </div>

      <div className="card-content">
        <div className="info-row">
          <span className="label">Chargers:</span>
          <span className="value">
            {availableChargers}/{station.total_chargers} <small>available</small>
          </span>
        </div>

        <div className="info-row">
          <span className="label">Occupancy:</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${occupancyRate}%`,
                backgroundColor: getStatusColor(),
              }}
            />
            <span className="progress-text">{Math.round(occupancyRate)}%</span>
          </div>
        </div>

        <div className="info-row">
          <span className="label">Queue:</span>
          <span className="value queue-badge">{station.queue_length}</span>
        </div>

        <div className="info-row">
          <span className="label">Load:</span>
          <span
            className="value"
            style={{ color: getStatusColor() }}
          >
            {Math.round(loadPercentage)}%
          </span>
        </div>

        <div className="info-row">
          <span className="label">Avg Charge:</span>
          <span className="value">{station.avg_charging_time} min</span>
        </div>

        {typeof station.distance_km === 'number' && (
          <div className="info-row">
            <span className="label">Distance:</span>
            <span className="value">{station.distance_km.toFixed(2)} km</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button
          className="btn-book"
          onClick={() => onSelectStation(station)}
          disabled={availableChargers === 0}
        >
          📍 {availableChargers === 0 ? 'Fully Booked' : 'Book Now'}
        </button>
        <button className="btn-direction" onClick={openDirections}>
          🧭 Show Way
        </button>
      </div>
    </div>
  );
}

export default StationCard;
