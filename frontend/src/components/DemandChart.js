import React from 'react';
import './DemandChart.css';

function DemandChart({ data }) {
  if (!data || !data.network_prediction) {
    return null;
  }

  const prediction = data.network_prediction;
  const utilization = Math.round(prediction.utilization_percentage);

  return (
    <div className="demand-chart">
      <h3>📊 Network Demand</h3>

      <div className="chart-item">
        <span className="chart-label">Network Utilization</span>
        <div className="chart-bar">
          <div
            className={`chart-fill ${
              utilization > 80 ? 'high' : utilization > 50 ? 'medium' : 'low'
            }`}
            style={{ width: `${utilization}%` }}
          />
        </div>
        <span className="chart-value">{utilization}%</span>
      </div>

      <div className="prediction-info">
        <p>
          <strong>Peak Hours:</strong> {prediction.peak_period ? '⛔ Yes' : '✅ No'}
        </p>
        <p>
          <strong>Current Hour:</strong> {prediction.current_hour}:00
        </p>
        <p>
          <strong>Demand Factor:</strong> {prediction.predicted_demand_factor.toFixed(2)}x
        </p>
      </div>
    </div>
  );
}

export default DemandChart;
