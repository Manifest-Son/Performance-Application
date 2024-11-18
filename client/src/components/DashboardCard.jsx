// eslint-disable-next-line no-unused-vars
import React from "react";
import "./DashboardCard.css";

// eslint-disable-next-line react/prop-types
const DashboardCard = ({ title, value, icon, color }) => (
  <div className="dashboard-card" style={{ borderColor: color }}>
    <div className="card-icon" style={{ backgroundColor: color }}>
      <i className={icon}></i>
    </div>
    <div className="card-content">
      <h3>{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  </div>
);

export default DashboardCard;
