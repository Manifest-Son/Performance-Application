// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StaffDashboardContent from "./StaffDashboardContent";
import UserDisplay from "./UserDisplay";

const staffMenuItems = [
  { label: "Overview", icon: "fas fa-home" },
  { label: "Tasks", icon: "fas fa-tasks" },
  { label: "Lecturers", icon: "fas fa-tasks" },
  { label: "Messages", icon: "fas fa-envelope" },
];

const StaffDashboard = () => {
  return (
    <DashboardLayout menuItems={staffMenuItems} userRole="Staff">
      <h1>Staff Dashboard</h1>

      <StaffDashboardContent />
      <UserDisplay />
    </DashboardLayout>
  );
};

export default StaffDashboard;
