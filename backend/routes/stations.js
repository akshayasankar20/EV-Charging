const express = require('express');
const { stations } = require('../models/stations');
const { calculateDistanceKm } = require('../utils/optimization');

const router = express.Router();

/**
 * GET /api/stations
 * Returns all charging stations with real-time data
 */
router.get('/', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const hasUserLocation = Number.isFinite(lat) && Number.isFinite(lng);
  const requestedLimit = req.query.limit;
  const parsedLimit = Number(requestedLimit);
  const limit = requestedLimit === 'all'
    ? stations.length
    : (Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : (hasUserLocation ? 5 : stations.length));

  let stationsWithMetrics = stations.map((station) => ({
    ...station,
    available_chargers: station.total_chargers - station.active_chargers,
    occupancy_rate: (station.active_chargers / station.total_chargers) * 100,
    load_percentage: (station.power_current_draw / station.power_capacity) * 100,
    distance_km: hasUserLocation
      ? calculateDistanceKm({ lat, lng }, station.location)
      : null,
  }));

  if (hasUserLocation) {
    stationsWithMetrics = stationsWithMetrics
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, Math.max(1, limit));
  }

  res.json({
    timestamp: new Date().toISOString(),
    user_location: hasUserLocation ? { lat, lng } : null,
    total_stations: stationsWithMetrics.length,
    stations: stationsWithMetrics,
  });
});

/**
 * GET /api/stations/:id
 * Returns details of a specific station
 */
router.get('/:id', (req, res) => {
  const station = stations.find((s) => s.id === req.params.id);

  if (!station) {
    return res.status(404).json({ error: 'Station not found' });
  }

  res.json({
    timestamp: new Date().toISOString(),
    station: {
      ...station,
      available_chargers: station.total_chargers - station.active_chargers,
      occupancy_rate: (station.active_chargers / station.total_chargers) * 100,
      load_percentage: (station.power_current_draw / station.power_capacity) * 100,
    },
  });
});

module.exports = router;
