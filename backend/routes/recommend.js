const express = require('express');
const { stations } = require('../models/stations');
const { findBestStation, getRankedStations, calculateDistanceKm } = require('../utils/optimization');

const router = express.Router();

/**
 * POST /api/recommend
 * Returns the best charging station based on optimization algorithm
 * Input: { user_location: { lat, lng } }
 */
router.post('/', (req, res) => {
  const userLocation = req.body?.user_location || { lat: 40.7128, lng: -74.006 };

  const nearestStations = stations
    .map((station) => ({
      station,
      distance_km: calculateDistanceKm(userLocation, station.location),
    }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 5)
    .map((item) => item.station);

  const result = findBestStation(nearestStations, userLocation);

  if (!result.station) {
    return res.status(503).json({
      error: 'No available stations at the moment',
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    timestamp: new Date().toISOString(),
    recommendation: {
      station_id: result.station.id,
      station_name: result.station.name,
      location: result.station.location,
      recommendation_score: result.score.toFixed(2),
      estimated_waiting_time_minutes: Math.round(result.metrics.waiting_time_minutes),
      available_chargers: result.station.total_chargers - result.station.active_chargers,
      total_chargers: result.station.total_chargers,
      current_queue: result.station.queue_length,
      distance_km: Number(result.metrics.distance_km?.toFixed(2) || 0),
      load_percentage: (
        (result.station.power_current_draw / result.station.power_capacity) *
        100
      ).toFixed(2),
      grid_status: result.metrics.is_overloaded ? 'OVERLOADED' : 'NORMAL',
    },
  });
});

/**
 * GET /api/recommend/ranked
 * Returns all stations ranked by optimization score
 */
router.get('/ranked', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const userLocation = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;

  const ranked = getRankedStations(stations, userLocation);

  res.json({
    timestamp: new Date().toISOString(),
    ranked_stations: ranked.map((item, index) => ({
      rank: index + 1,
      station_id: item.station.id,
      station_name: item.station.name,
      score: item.score.toFixed(2),
      estimated_waiting_time: Math.round(item.metrics.waiting_time_minutes),
      distance_km: item.metrics.distance_km !== null ? Number(item.metrics.distance_km.toFixed(2)) : null,
      available_chargers: item.station.total_chargers - item.station.active_chargers,
      load_percentage: (item.metrics.load_factor * 100).toFixed(2),
      recommendation: index === 0 ? 'BEST CHOICE' : '',
    })),
  });
});

module.exports = router;
