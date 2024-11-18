import DashboardCard from "../../components/DashboardCard";

const StudentDashboardContent = () => (
  <div className="dashboard-content">
    <h2 className="section-title">Academic Progress</h2>
    <div className="cards-grid">
      <DashboardCard
        title="Enrolled Courses"
        value="6"
        icon="fas fa-book"
        color="#2196F3"
      />
      <DashboardCard
        title="Assignments Due"
        value="4"
        icon="fas fa-clock"
        color="#FF9800"
      />
      <DashboardCard
        title="Average Grade"
        value="A-"
        icon="fas fa-graduation-cap"
        color="#4CAF50"
      />
      <DashboardCard
        title="Attendance"
        value="92%"
        icon="fas fa-calendar-check"
        color="#9C27B0"
      />
    </div>
  </div>
);

export default StudentDashboardContent;
