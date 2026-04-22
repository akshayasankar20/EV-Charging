import React, { useState } from 'react';
import { bookStation } from '../services/api';
import './BookingPanel.css';

function BookingPanel({ station, onClose }) {
  const [userId, setUserId] = useState('');
  const [vehicleType, setVehicleType] = useState('Tesla');
  const [loading, setLoading] = useState(false);
  const [bookingConfirm, setBookingConfirm] = useState(null);
  const usdToInrRate = Number(process.env.REACT_APP_USD_TO_INR) || 83.5;

  const formatInr = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);

  const handleBook = async () => {
    if (!userId) {
      alert('Please enter User ID');
      return;
    }

    setLoading(true);
    try {
      const result = await bookStation(station.id, userId, vehicleType);
      setBookingConfirm(result.booking);
    } catch (error) {
      alert('Booking failed: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirm) {
    const amountInr =
      typeof bookingConfirm.estimated_cost_inr === 'number'
        ? bookingConfirm.estimated_cost_inr
        : Number((bookingConfirm.estimated_cost_usd || 0) * usdToInrRate);

    return (
      <div className="booking-panel booking-success">
        <h3>✅ Booking Confirmed!</h3>
        <div className="booking-details">
          <p>
            <strong>Booking ID:</strong> {bookingConfirm.booking_id}
          </p>
          <p>
            <strong>Station:</strong> {station.name}
          </p>
          <p>
            <strong>Queue Position:</strong> #{bookingConfirm.queue_position}
          </p>
          <p>
            <strong>Estimated Wait:</strong> {bookingConfirm.estimated_waiting_time_minutes} min
          </p>
          <p>
            <strong>Estimated Cost:</strong> {formatInr(amountInr)}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setBookingConfirm(null);
            onClose();
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="booking-panel">
      <div className="panel-header">
        <h3>Book: {station.name}</h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="station-info">
        <p>
          <strong>Available Chargers:</strong> {station.total_chargers - station.active_chargers}/
          {station.total_chargers}
        </p>
        <p>
          <strong>Current Queue:</strong> {station.queue_length} vehicles
        </p>
      </div>

      <div className="form-group">
        <label>User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your user ID"
        />
      </div>

      <div className="form-group">
        <label>Vehicle Type</label>
        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
          <option>Tesla</option>
          <option>Nissan Leaf</option>
          <option>Chevy Bolt</option>
          <option>BMW i3</option>
          <option>Other</option>
        </select>
      </div>

      <button
        className="btn btn-success"
        onClick={handleBook}
        disabled={loading}
      >
        {loading ? 'Booking...' : '📍 Complete Booking'}
      </button>
    </div>
  );
}

export default BookingPanel;
