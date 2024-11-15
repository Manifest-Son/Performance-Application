// components/DashboardLayout.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import "./DashboardLayout.css";

const DashboardLayout = ({ menuItems, children, userRole }) => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="user-info">
          <h2>{userRole}</h2>
        </div>
        <nav className="menu">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <main className="main-content">{children}</main>
    </div>
  );
};
DashboardLayout.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  children: PropTypes.node.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default DashboardLayout;
