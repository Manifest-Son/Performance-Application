// eslint-disable-next-line no-unused-vars
import React from "react";
import "./TaskCard.css";

// eslint-disable-next-line react/prop-types
const TaskCard = ({ title, tasks, status }) => {
  const statusColors = {
    pending: "#ffc107",
    completed: "#28a745",
    urgent: "#dc3545",
    inProgress: "#17a2b8",
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{title}</h3>
        <span
          className="task-status"
          style={{ backgroundColor: statusColors[status] }}
        >
          {status}
        </span>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <div className="task-content">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <div className="task-meta">
                <span>
                  <i className="far fa-calendar"></i> {task.dueDate}
                </span>
                <span>
                  <i className="far fa-user"></i> {task.assignee}
                </span>
              </div>
            </div>
            <div className="task-priority" data-priority={task.priority}>
              {task.priority}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
