/**
 * Optimization Algorithm
 * Calculates best station recommendation based on waiting time, load, and availability
 */

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(userLocation, stationLocation) {
  if (!userLocation || !stationLocation) return null;

  const earthRadiusKm = 6371;
  const latDiff = toRadians(stationLocation.lat - userLocation.lat);
  const lngDiff = toRadians(stationLocation.lng - userLocation.lng);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadians(userLocation.lat)) *
      Math.cos(toRadians(stationLocation.lat)) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function calculateWaitingTime(station) {
  if (station.total_chargers === 0) return Infinity;
  const waitPerCharger = station.avg_charging_time / station.total_chargers;
  return station.queue_length * waitPerCharger;
}

function calculateAvailabilityScore(station) {
  const availableChargers = station.total_chargers - station.active_chargers;
  return availableChargers / station.total_chargers;
}

function calculateLoadFactor(station) {
  if (station.power_capacity === 0) return 1;
  return station.power_current_draw / station.power_capacity;
}

function isOverloaded(station) {
  const loadFactor = calculateLoadFactor(station);
  return loadFactor > 0.85; // 85% threshold
}

function calculateOptimizationScore(station, userLocation) {
  const waitingTime = calculateWaitingTime(station);
  const availabilityScore = calculateAvailabilityScore(station);
  const loadFactor = calculateLoadFactor(station);
  const distanceKm = calculateDistanceKm(userLocation, station.location);

  // Weighted scoring
  let score = 0;
  score += (100 - waitingTime) * 0.4; // 40% weight on waiting time
  score += availabilityScore * 100 * 0.3; // 30% weight on availability
  score += (1 - loadFactor) * 100 * 0.3; // 30% weight on load balance

  // Distance-aware penalty so closer stations are favored.
  if (distanceKm !== null) {
    score -= Math.min(distanceKm, 30) * 0.8;
  }

  // Penalize overloaded stations heavily
  if (isOverloaded(station)) {
    score -= 50;
  }

  return Math.max(0, score);
}

function findBestStation(stations, userLocation) {
  let bestStation = null;
  let bestScore = -Infinity;

  stations.forEach((station) => {
    if (station.active_chargers >= station.total_chargers) {
      // Skip fully occupied stations
      return;
    }

    const score = calculateOptimizationScore(station, userLocation);

    if (score > bestScore) {
      bestScore = score;
      bestStation = station;
    }
  });

  return {
    station: bestStation,
    score: bestScore,
    metrics: bestStation
      ? {
          waiting_time_minutes: calculateWaitingTime(bestStation),
          availability_score: calculateAvailabilityScore(bestStation),
          load_factor: calculateLoadFactor(bestStation),
          is_overloaded: isOverloaded(bestStation),
          distance_km: calculateDistanceKm(userLocation, bestStation.location),
        }
      : null,
  };
}

function getRankedStations(stations, userLocation) {
  const ranked = stations
    .filter((s) => s.active_chargers < s.total_chargers) // Only available stations
    .map((station) => ({
      station,
      score: calculateOptimizationScore(station, userLocation),
      metrics: {
        waiting_time_minutes: calculateWaitingTime(station),
        availability_score: calculateAvailabilityScore(station),
        load_factor: calculateLoadFactor(station),
        is_overloaded: isOverloaded(station),
        distance_km: calculateDistanceKm(userLocation, station.location),
      },
    }))
    .sort((a, b) => b.score - a.score);

  return ranked;
}

module.exports = {
  calculateWaitingTime,
  calculateAvailabilityScore,
  calculateLoadFactor,
  isOverloaded,
  calculateDistanceKm,
  calculateOptimizationScore,
  findBestStation,
  getRankedStations,
};
