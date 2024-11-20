// // components/analytics/AnalyticsBoard.jsx
// // eslint-disable-next-line no-unused-vars
// import { useState, useEffect } from 'react';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
// import { useMetricsStore } from '../../stores/store.js';
// import { getAnalyticsData, getDepartmentMetrics } from '../../components/services/MetricsService.jsx';
// import './Analytics.css';

// const AnalyticsBoard = () => {
//   const { 
//     metrics, 
//     setMetrics, 
//     setLoading, 
//     setError,
//     loading 
//   } = useMetricsStore();
//   const [activeTab, setActiveTab] = useState('performance');
//   const [timeRange, setTimeRange] = useState('month');

//   if (loading) {
//     return <div className="analytics-loading">Loading analytics...</div>;
//   }

//   const renderPerformanceChart = () => (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={metrics?.performanceTrends || []}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line 
//           type="monotone" 
//           dataKey="teaching" 
//           stroke="#8884d8" 
//           name="Teaching Quality"
//         />
//         <Line 
//           type="monotone" 
//           dataKey="communication" 
//           stroke="#82ca9d" 
//           name="Communication"
//         />
//         <Line 
//           type="monotone" 
//           dataKey="engagement" 
//           stroke="#ffc658" 
//           name="Student Engagement"
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );

//   const renderDepartmentComparison = () => (
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={metrics?.departmentMetrics || []}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="department" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="averageRating" fill="#8884d8" name="Average Rating" />
//         <Bar dataKey="satisfactionScore" fill="#82ca9d" name="Satisfaction" />
//       </BarChart>
//     </ResponsiveContainer>
//   );

//   return (
//     <div className="analytics-board">
//       <div className="analytics-header">
//         <div className="tab-buttons">
//           <button 
//             className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
//             onClick={() => setActiveTab('performance')}
//           >
//             Performance Trends
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'department' ? 'active' : ''}`}
//             onClick={() => setActiveTab('department')}
//           >
//             Department Analysis
//           </button>
//         </div>
//         <select 
//           value={timeRange} 
//           onChange={(e) => setTimeRange(e.target.value)}
//           className="time-range-select"
//         >
//           <option value="week">Last Week</option>
//           <option value="month">Last Month</option>
//           <option value="quarter">Last Quarter</option>
//           <option value="year">Last Year</option>
//         </select>
//       </div>

//       <div className="analytics-content">
//         {activeTab === 'performance' ? renderPerformanceChart() : renderDepartmentComparison()}
//       </div>

//       <div className="metrics-summary">
//         <div className="metric-item">
//           <h4>Overall Performance</h4>
//           <p className="metric-value">{metrics?.overallScore || 'N/A'}</p>
//         </div>
//         <div className="metric-item">
//           <h4>Total Evaluations</h4>
//           <p className="metric-value">{metrics?.totalEvaluations || 0}</p>
//         </div>
//         <div className="metric-item">
//           <h4>Improvement Rate</h4>
//           <p className="metric-value">{metrics?.improvementRate || 'N/A'}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsBoard;