/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import "./DashboardUserCard.css";

const DashboardUserCard = ({ user, isLoading }) => {
  if (isLoading) {
    return <div className="dashboard-card skeleton"></div>;
  }

  const {
    name,
    role,
    avatar,
    stats = {
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksPending: 0,
    },
    status,
  } = user;

  return (
    <div className="dashboard-card">
      <div className="user-header">
        <div className="avatar-container">
          <img
            src={avatar || "/default-avatar.png"}
            alt={name}
            className="user-avatar"
          />
          <span className={`status-indicator ${status}`}></span>
        </div>
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <span className="user-role">{role}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.tasksCompleted}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.tasksInProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.tasksPending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardUserCard;
