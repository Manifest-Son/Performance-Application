import DashboardCard from "../../components/DashboardCard";

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
          title="Revenue"
          value="$45,678"
          icon="fas fa-dollar-sign"
          color="#9C27B0"
        />
      </div>

      <h2 className="section-title">System Status</h2>
      <div className="cards-grid">
        <DashboardCard
          title="Server Load"
          value="42%"
          icon="fas fa-server"
          color="#607D8B"
        />
        <DashboardCard
          title="Storage Used"
          value="756 GB"
          icon="fas fa-database"
          color="#795548"
        />
      </div>
    </div>
  );
};

export default StaffDashboardContent;
