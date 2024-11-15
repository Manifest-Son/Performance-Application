// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AdminDashboardContent from "./AdminDashboardContent";

const adminMenuItems = [
  { label: "Overview", icon: "fas fa-home" },
  { label: "User Management", icon: "fas fa-users" },
  { label: "Settings", icon: "fas fa-cog" },
  { label: "Reports", icon: "fas fa-chart-bar" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout menuItems={adminMenuItems} userRole="Admin">
      <h1>Admin Dashboard</h1>
      <p>
        {" "}
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde nisi,
        quibusdam sed accusamus consequuntur consectetur quae facilis nihil
        reiciendis, sequi odit! Autem, soluta. Corporis saepe omnis placeat et
        sit consequatur.{" "}
      </p>
      <AdminDashboardContent />
    </DashboardLayout>
  );
};

export default AdminDashboard;
