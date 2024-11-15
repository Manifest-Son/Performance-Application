// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

const lecturerMenuItems = [
  { label: "Overview", icon: "fas fa-home" },
  { label: "Courses", icon: "fas fa-book" },
  { label: "Students", icon: "fas fa-user-graduate" },
  { label: "Grades", icon: "fas fa-chart-line" },
];

const LecturerDashboard = () => {
  return (
    <DashboardLayout menuItems={lecturerMenuItems} userRole="Lecturer">
      <h1>Lecturer Dashboard</h1>
      {/* Add lecturer-specific content here */}
    </DashboardLayout>
  );
};

export default LecturerDashboard;
