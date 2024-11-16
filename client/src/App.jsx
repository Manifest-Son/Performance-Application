import "../public/globals.css";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Login from "./pages/login/Login";
import Signin from "./pages/signin/Signin";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import LecturerDashboard from "./pages/dashboards/LecturerDashboard";
import StudentDashboard from "./pages/dashboards/StudentsDashboard";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<Signin />} />
        <Route path="lecturer" element={<LecturerDashboard />} />
        <Route path="staff" element={<StaffDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
