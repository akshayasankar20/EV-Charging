import React from 'react';
import './StationList.css';
import StationCard from './StationCard';

function StationList({ stations, onSelectStation, recommendedStationId, userLocation }) {
  return (
    <div className="station-list-container">
      <h2>🔌 Charging Stations</h2>
      <div className="station-list">
        {stations.length === 0 ? (
          <p className="no-data">Loading stations...</p>
        ) : (
          stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isRecommended={station.id === recommendedStationId}
              onSelectStation={onSelectStation}
              userLocation={userLocation}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StationList;
