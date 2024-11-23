/* eslint-disable react/prop-types */
// components/metrics/PerformanceMetrics.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Tooltip } from "react-tooltip";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import "./performance.css";

const PerformanceMetrics = ({ data, loading }) => {
  if (loading) {
    return <div className="metrics-loading">Loading metrics...</div>;
  }

  const calculateTrend = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderTrendIndicator = (trend) => {
    if (trend > 0) {
      return <FaArrowUp className="trend-up" />;
    } else if (trend < 0) {
      return <FaArrowDown className="trend-down" />;
    }
    return null;
  };

  const metricsConfig = [
    {
      id: "student_feedback",
      label: "Student Feedback",
      color: "#2196F3",
      tooltip: "Overall student satisfaction and feedback scores",
    },
    {
      id: "learning_outcome",
      label: "Learning Outcomes",
      color: "#4CAF50",
      tooltip: "Achievement of intended learning objectives",
    },
    {
      id: "self_reflection",
      label: "Self Reflection",
      color: "#FF9800",
      tooltip: "Personal assessment and improvement insights",
    },
    {
      id: "performance_label",
      label: "Performance Label",
      color: "#9C27B0",
      tooltip: "Overall performance classification",
    },
    {
      id: "goal_alignment",
      label: "Goal Alignment",
      color: "#00BCD4",
      tooltip: "Alignment with department objectives",
    },
    {
      id: "peer_feedback",
      label: "Peer Feedback",
      color: "#FF5722",
      tooltip: "Feedback from other lecturers and staff",
    },
  ];

  return (
    <div className="performance-metrics">
      <div className="metrics-grid">
        {metricsConfig.map((metric) => (
          <div key={metric.id} className="metric-card">
            <h4 data-tooltip-id={metric.id}>{metric.label}</h4>
            <Tooltip id={metric.id} content={metric.tooltip} />
            <div className="metric-value">
              <CircularProgressbar
                value={data?.[metric.id]?.score || 0}
                maxValue={5}
                text={`${(data?.[metric.id]?.score || 0).toFixed(1)}`}
                styles={buildStyles({
                  pathColor: metric.color,
                  textColor: metric.color,
                })}
              />
            </div>
            <div className="trend">
              {renderTrendIndicator(
                calculateTrend(
                  data?.[metric.id]?.score,
                  data?.[metric.id]?.previousScore,
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="performance-summary">
        <h3>Performance Overview</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Overall Rating</span>
            <span className="value">
              {(data?.overallScore || 0).toFixed(1)}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Total Evaluations</span>
            <span className="value">{data?.totalEvaluations || 0}</span>
          </div>
          <div className="summary-item">
            <span className="label">Growth Rate</span>
            <span className="value">
              {`${(data?.growthRate || 0).toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="recommendations">
        <h3>Key Insights</h3>
        <ul className="insights-list">
          {data?.insights?.map((insight, index) => (
            <li key={index} className="insight-item">
              <span className="insight-category">{insight.category}</span>
              <p className="insight-text">{insight.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
