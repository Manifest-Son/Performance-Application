// AdminDashboardContent.jsx
// import { useState, useEffect } from 'react';
import DashboardCard from "../../components/DashboardCard";
// import { getPerformanceMetrics } from "../../components/services/MetricsService";
// import AIChat from "../../ai/AIChat";
// import AnalyticsBoard from "../../components/analytics/AnalyticsBoard";
import "../../styling/AdminDashboard.css"

const AdminDashboardContent = () => {
  // const [metrics, setMetrics] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchMetrics();
  // }, []);

  // const fetchMetrics = async () => {
  //   try {
  //     const data = await getPerformanceMetrics();
  //     setMetrics(data);
  //   } catch (error) {
  //     console.error('Error fetching metrics:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
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
        </div>
        
        {/* <div className="analytics-section">
          <h2 className="section-title">Analytics</h2>
          <AnalyticsBoard metrics={metrics} loading={loading} />
        </div>
      </div>

      <div className="dashboard-sidebar">
        <div className="metrics-panel">
          <h3>Performance Metrics</h3>
          <PerformanceMetrics data={metrics} loading={loading} />
        </div>
        
        <div className="ai-chat-panel">
          <h3>AI Assistant</h3>
          <AIChat />
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboardContent;