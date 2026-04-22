import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const fetchStations = async (location, limit = 5) => {
  const params = {};
  if (location?.lat && location?.lng) {
    params.lat = location.lat;
    params.lng = location.lng;
    if (limit === 'all') {
      params.limit = 'all';
    } else if (Number.isFinite(limit)) {
      params.limit = limit;
    }
  }

  const response = await api.get('/stations', { params });
  return response.data;
};

export const getStationById = async (stationId) => {
  const response = await api.get(`/stations/${stationId}`);
  return response.data;
};

export const getRecommendation = async (userLocation) => {
  const response = await api.post('/recommend', {
    user_location: userLocation,
  });
  return response.data;
};

export const getRankedStations = async (location) => {
  const params = {};
  if (location?.lat && location?.lng) {
    params.lat = location.lat;
    params.lng = location.lng;
  }

  const response = await api.get('/recommend/ranked', { params });
  return response.data;
};

export const bookStation = async (stationId, userId, vehicleType = 'unknown') => {
  const response = await api.post('/book', {
    station_id: stationId,
    user_id: userId,
    vehicle_type: vehicleType,
  });
  return response.data;
};

export const cancelBooking = async (bookingId, stationId) => {
  const response = await api.post('/book/cancel', {
    booking_id: bookingId,
    station_id: stationId,
  });
  return response.data;
};

export const predictDemand = async () => {
  const response = await api.get('/predict/demand');
  return response.data;
};

export const predictStationDemand = async (stationId) => {
  const response = await api.get(`/predict/station/${stationId}`);
  return response.data;
};

export default api;
