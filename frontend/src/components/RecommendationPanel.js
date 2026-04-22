import React from 'react';
import './RecommendationPanel.css';

function RecommendationPanel({ recommendation, onFindBest, loading, userLocation }) {
  const openDirections = () => {
    if (!recommendation?.location) return;

    const destination = `${recommendation.location.lat},${recommendation.location.lng}`;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : null;

    const mapsUrl = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
      : `https://www.google.com/maps/search/?api=1&query=${destination}`;

    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="recommendation-panel">
      <h2>🎯 Find Best Station</h2>

      <button
        className="btn-find-best"
        onClick={onFindBest}
        disabled={loading}
      >
        {loading ? '⏳ Finding...' : '🔍 Find Best Station'}
      </button>

      {recommendation && (
        <div className="recommendation-result">
          <div className="result-header">
            <h3>Selected: {recommendation.station_name}</h3>
            <span className="score-badge">{recommendation.recommendation_score}</span>
          </div>

          <div className="result-details">
            <div className="detail-item">
              <span className="detail-label">⏱ Wait Time</span>
              <span className="detail-value">
                {recommendation.estimated_waiting_time_minutes} min
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">🔌 Available</span>
              <span className="detail-value">
                {recommendation.available_chargers}/{recommendation.total_chargers}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">👥 Queue</span>
              <span className="detail-value">{recommendation.current_queue}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">⚡ Grid Load</span>
              <span className="detail-value" style={{
                color: recommendation.grid_status === 'OVERLOADED' ? '#ef4444' : '#10b981'
              }}>
                {recommendation.load_percentage}%
              </span>
            </div>

            {typeof recommendation.distance_km === 'number' && (
              <div className="detail-item">
                <span className="detail-label">📍 Distance</span>
                <span className="detail-value">{recommendation.distance_km} km</span>
              </div>
            )}

            <div className="detail-item">
              <span className="detail-label">🔋 Status</span>
              <span className={`detail-value status-${recommendation.grid_status.toLowerCase()}`}>
                {recommendation.grid_status}
              </span>
            </div>
          </div>

          <div className="result-message">
            <p>✅ This station optimizes your charging while maintaining grid stability.</p>
          </div>

          <button className="btn-direction-recommend" onClick={openDirections}>
            🧭 Show Way to Recommended Station
          </button>
        </div>
      )}

      {!recommendation && !loading && (
        <div className="empty-state">
          <p>Click "Find Best Station" to get personalized recommendations</p>
        </div>
      )}
    </div>
  );
}

export default RecommendationPanel;
