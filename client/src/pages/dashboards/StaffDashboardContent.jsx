import DashboardCard from "../../components/DashboardCard";
// import {useNavigate } from "react-router-dom"

// const navigate = useNavigate()
const StaffDashboardContent = () => {
  return (
    <div className="dashboard-content">
      <h2 className="section-title">Overview</h2>
      <div className="cards-grid">
        <DashboardCard
          title="Total Users"
          value="1,234"
          icon="fas fa-users"
          color="#4CAF50"
        />
        <DashboardCard
          title="Active Students"
          value="890"
          icon="fas fa-user-graduate"
          color="#2196F3"
        />
        <DashboardCard
          title="Total Courses"
          value="56"
          icon="fas fa-book"
          color="#FF9800"
        />
        <DashboardCard
          title="Tasks Handed"
          value="4"
          icon="fas fa-dollar-sign"
          color="#9C27B0"
        />
        <DashboardCard
          title="Tasks Awaiting"
          value="7"
          icon="fas fa-dollar-sign"
          color="#9C27B0"
        />
      </div>

      <h2 className="section-title">Completed Tasks</h2>
      <div className="cards-grid">
        <DashboardCard
          title="SCS 407"
          value="Completed on 1 Oct 2024"
          icon="fas fa-server"
          color="#607D8B"
        />
        <DashboardCard
          title="SIT 304"
          value="Completed on 21 Oct 2024"
          icon="fas fa-database"
          color="#795548"
        />
      </div>
    </div>
  );
};

export default StaffDashboardContent;
