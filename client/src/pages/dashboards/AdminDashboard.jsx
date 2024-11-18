// eslint-disable-next-line no-unused-vars
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AdminDashboardContent from "./AdminDashboardContent";
import { MdOutlineViewQuilt } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { BsPersonVcard } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";

const adminMenuItems = [
  { label: "Overview", icon: <MdOutlineViewQuilt /> },
  { label: "Lecturers", icon: <GiTeacher /> },
  { label: "Staff", icon: <BsPersonVcard /> },
  { label: "Reviews", icon: <MdOutlineRateReview /> },
  { label: "Roles", icon: <FaListCheck /> },
  { label: "Tasks", icon: <MdOutlineTaskAlt /> },
  { label: "Reports", icon: <HiDocumentReport /> },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout menuItems={adminMenuItems} userRole="Admin">
      <h1>Admin Dashboard</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde nisi,
        quibusdam sed accusamus consequuntur consectetur quae facilis nihil
        reiciendis, sequi odit! Autem, soluta. Corporis saepe omnis placeat et
        sit consequatur.
      </p>
      <AdminDashboardContent />
    </DashboardLayout>
  );
};

export default AdminDashboard;
