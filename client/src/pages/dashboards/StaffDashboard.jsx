// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StaffDashboardContent from "./StaffDashboardContent";

const staffMenuItems = [
  { label: "Overview", icon: "fas fa-home" },
  { label: "Tasks", icon: "fas fa-tasks" },
  { label: "Calendar", icon: "fas fa-calendar" },
  { label: "Messages", icon: "fas fa-envelope" },
];

const StaffDashboard = () => {
  return (
    <DashboardLayout menuItems={staffMenuItems} userRole="Staff">
      <h1>Staff Dashboard</h1>
      
      <StaffDashboardContent />
    </DashboardLayout>
  );
};

export default StaffDashboard;
