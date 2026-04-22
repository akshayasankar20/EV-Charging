const express = require('express');
const { getStationById, updateStation } = require('../models/stations');

const router = express.Router();

/**
 * POST /api/book
 * Books a charging slot at a station
 * Input: { station_id, user_id, vehicle_type }
 */
router.post('/', (req, res) => {
  const { station_id, user_id, vehicle_type } = req.body;
  const usdToInrRate = Number(process.env.USD_TO_INR_RATE) || 83.5;

  if (!station_id || !user_id) {
    return res.status(400).json({
      error: 'station_id and user_id are required',
    });
  }

  const station = getStationById(station_id);

  if (!station) {
    return res.status(404).json({ error: 'Station not found' });
  }

  // Check if station is at full capacity
  if (station.active_chargers >= station.total_chargers) {
    return res.status(503).json({
      error: 'Station at full capacity',
      station_id,
    });
  }

  // Add to queue
  const updatedStation = updateStation(station_id, {
    queue_length: station.queue_length + 1,
  });

  const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const estimatedCostUsd = Number((updatedStation.avg_charging_time * 0.5).toFixed(2));
  const estimatedCostInr = Number((estimatedCostUsd * usdToInrRate).toFixed(2));

  res.status(201).json({
    timestamp: new Date().toISOString(),
    booking: {
      booking_id: bookingId,
      station_id,
      user_id,
      vehicle_type: vehicle_type || 'unknown',
      queue_position: updatedStation.queue_length,
      estimated_waiting_time_minutes: Math.round(
        (updatedStation.queue_length / updatedStation.total_chargers) *
          updatedStation.avg_charging_time
      ),
      estimated_cost_usd: estimatedCostUsd,
      estimated_cost_inr: estimatedCostInr,
      currency: 'INR',
      status: 'BOOKED',
    },
  });
});

/**
 * POST /api/book/cancel
 * Cancels a booking
 * Input: { booking_id, station_id }
 */
router.post('/cancel', (req, res) => {
  const { booking_id, station_id } = req.body;

  if (!booking_id || !station_id) {
    return res.status(400).json({
      error: 'booking_id and station_id are required',
    });
  }

  const station = getStationById(station_id);

  if (!station) {
    return res.status(404).json({ error: 'Station not found' });
  }

  // Decrease queue length
  if (station.queue_length > 0) {
    updateStation(station_id, {
      queue_length: Math.max(0, station.queue_length - 1),
    });
  }

  res.json({
    timestamp: new Date().toISOString(),
    status: 'CANCELLED',
    booking_id,
    station_id,
  });
});

module.exports = router;
