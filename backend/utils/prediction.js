/**
 * Demand Prediction
 * Simple model to predict EV charging demand based on time of day
 */

function getCurrentHour() {
  return new Date().getHours();
}

function getDemandFactor() {
  const hour = getCurrentHour();

  // Peak hours: 7-9, 17-19
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 1.5;
  }

  // High demand: 10-16
  if (hour >= 10 && hour <= 16) {
    return 1.2;
  }

  // Low demand: 20-6
  if (hour >= 20 || hour <= 6) {
    return 0.6;
  }

  return 1.0;
}

function predictStationDemand(station) {
  const demandFactor = getDemandFactor();
  const baseDemand = station.total_chargers; // Base is total chargers

  return {
    current_demand: baseDemand * demandFactor,
    predicted_queue: Math.round(baseDemand * demandFactor * 0.3),
    demand_factor: demandFactor,
    peak_hours: (getCurrentHour() >= 7 && getCurrentHour() <= 9) || 
               (getCurrentHour() >= 17 && getCurrentHour() <= 19),
    time_of_day: getCurrentHour(),
  };
}

function predictNetworkDemand(stations) {
  const totalCapacity = stations.reduce((sum, s) => sum + s.total_chargers, 0);
  const totalActive = stations.reduce((sum, s) => sum + s.active_chargers, 0);
  const demandFactor = getDemandFactor();

  return {
    total_network_capacity: totalCapacity,
    current_utilization: totalActive,
    utilization_percentage: (totalActive / totalCapacity) * 100,
    predicted_demand_factor: demandFactor,
    peak_period: (getCurrentHour() >= 7 && getCurrentHour() <= 9) || 
                (getCurrentHour() >= 17 && getCurrentHour() <= 19),
    current_hour: getCurrentHour(),
  };
}

module.exports = {
  getCurrentHour,
  getDemandFactor,
  predictStationDemand,
  predictNetworkDemand,
};
