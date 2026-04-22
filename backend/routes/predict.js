const express = require('express');
const { stations } = require('../models/stations');
const { predictStationDemand, predictNetworkDemand } = require('../utils/prediction');

const router = express.Router();

/**
 * GET /api/predict/demand
 * Predicts charging demand based on time of day
 */
router.get('/demand', (req, res) => {
  const networkPrediction = predictNetworkDemand(stations);
  const stationPredictions = stations.map((station) => ({
    station_id: station.id,
    station_name: station.name,
    prediction: predictStationDemand(station),
  }));

  res.json({
    timestamp: new Date().toISOString(),
    network_prediction: networkPrediction,
    station_predictions: stationPredictions,
  });
});

/**
 * GET /api/predict/station/:id
 * Predicts demand for a specific station
 */
router.get('/station/:id', (req, res) => {
  const station = stations.find((s) => s.id === req.params.id);

  if (!station) {
    return res.status(404).json({ error: 'Station not found' });
  }

  const prediction = predictStationDemand(station);

  res.json({
    timestamp: new Date().toISOString(),
    station_id: station.id,
    station_name: station.name,
    current_state: {
      active_chargers: station.active_chargers,
      queue_length: station.queue_length,
      occupancy_rate: (station.active_chargers / station.total_chargers) * 100,
    },
    prediction,
  });
});

module.exports = router;
