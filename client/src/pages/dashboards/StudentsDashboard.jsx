// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StudentDashboardContent from "./StudentDashboardContent";

const studentMenuItems = [
  { label: "Overview", icon: "fas fa-home" },
  { label: "Courses", icon: "fas fa-book" },
  { label: "Assignments", icon: "fas fa-tasks" },
  { label: "Grades", icon: "fas fa-chart-line" },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout menuItems={studentMenuItems} userRole="Student">
      <h1>Student Dashboard</h1>
      <StudentDashboardContent />
    </DashboardLayout>
  );
};

export default StudentDashboard;
