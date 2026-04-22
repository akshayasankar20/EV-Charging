   /**
 * Station Data Model
 * Centralized data store for all charging stations
 */

let stations = [
  {
    id: 'S1',
    name: 'Station A - Koramangala',
    location: { lat: 12.9352, lng: 77.6245 },
    total_chargers: 5,
    active_chargers: 3,
    queue_length: 4,
    avg_charging_time: 30,
    power_capacity: 100,
    power_current_draw: 75,
    last_updated: new Date(),
  },
  {
    id: 'S2',
    name: 'Station B - Indiranagar',
    location: { lat: 12.9784, lng: 77.6408 },
    total_chargers: 4,
    active_chargers: 1,
    queue_length: 1,
    avg_charging_time: 25,
    power_capacity: 80,
    power_current_draw: 25,
    last_updated: new Date(),
  },
  {
    id: 'S3',
    name: 'Station C - Whitefield',
    location: { lat: 12.9698, lng: 77.7499 },
    total_chargers: 6,
    active_chargers: 4,
    queue_length: 2,
    avg_charging_time: 28,
    power_capacity: 120,
    power_current_draw: 100,
    last_updated: new Date(),
  },
  {
    id: 'S4',
    name: 'Station D - Electronic City',
    location: { lat: 12.8399, lng: 77.6770 },
    total_chargers: 3,
    active_chargers: 0,
    queue_length: 0,
    avg_charging_time: 32,
    power_capacity: 60,
    power_current_draw: 0,
    last_updated: new Date(),
  },
  {
    id: 'S5',
    name: 'Station E - HSR Layout',
    location: { lat: 12.9121, lng: 77.6446 },
    total_chargers: 5,
    active_chargers: 2,
    queue_length: 1,
    avg_charging_time: 27,
    power_capacity: 100,
    power_current_draw: 50,
    last_updated: new Date(),
  },
  {
    id: 'S6',
    name: 'Station F - Jayanagar',
    location: { lat: 12.9299, lng: 77.5823 },
    total_chargers: 4,
    active_chargers: 2,
    queue_length: 1,
    avg_charging_time: 26,
    power_capacity: 80,
    power_current_draw: 50,
    last_updated: new Date(),
  },
  {
    id: 'S7',
    name: 'Station G - Hebbal',
    location: { lat: 13.0352, lng: 77.5970 },
    total_chargers: 6,
    active_chargers: 3,
    queue_length: 2,
    avg_charging_time: 30,
    power_capacity: 120,
    power_current_draw: 75,
    last_updated: new Date(),
  },
  {
    id: 'S8',
    name: 'Station H - Banashankari',
    location: { lat: 12.9255, lng: 77.5468 },
    total_chargers: 5,
    active_chargers: 2,
    queue_length: 1,
    avg_charging_time: 29,
    power_capacity: 100,
    power_current_draw: 50,
    last_updated: new Date(),
  },
];

// Simulate real-time updates
function simulateStationUpdates() {
  stations.forEach((station) => {
    // Simulate random occupancy changes
    station.active_chargers = Math.max(
      0,
      Math.min(
        station.total_chargers,
        station.active_chargers + (Math.random() > 0.5 ? 1 : -1)
      )
    );

    // Update queue length
    station.queue_length = Math.max(
      0,
      station.queue_length + (Math.random() > 0.6 ? 1 : 0)
    );

    // Update power draw based on active chargers
    station.power_current_draw = station.active_chargers * 25;

    // Update timestamp
    station.last_updated = new Date();
  });
}

// Start simulation interval (every 5 seconds)
setInterval(simulateStationUpdates, 5000);

module.exports = {
  stations,
  simulateStationUpdates,
  getStationById: (id) => stations.find((s) => s.id === id),
  updateStation: (id, updates) => {
    const station = stations.find((s) => s.id === id);
    if (station) {
      Object.assign(station, updates);
      station.last_updated = new Date();
    }
    return station;
  },
};
