import "../public/globals.css";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
// import StaffDashboard from "./pages/dashboards/StaffDashboard";
// import LecturerDashboard from "./pages/dashboards/LecturerDashboard";
// import Header from "./components/Header";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    // <BrowserRouter>
    //   <Header />
    //   <Routes>
    //     <Route path="/" element={<AdminDashboard />} />
    //     <Route path="lecturer" element={<LecturerDashboard />} />
    //     <Route path="staff" element={<StaffDashboard />} />
    //     <Route path="admin" element={<AdminDashboard />} />
    //   </Routes>
    // </BrowserRouter>
    <AdminDashboard />
  );
}

export default App;
