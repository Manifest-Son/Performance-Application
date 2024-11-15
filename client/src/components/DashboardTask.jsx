import TaskCard from "./TaskCard";

const DashboardTasks = () => {
    const tasks = {
      pending: {
        title: "Pending Tasks",
        status: "pending",
        tasks: [
          {
            title: "Review Project Proposal",
            description: "Review and provide feedback on the new project proposal",
            dueDate: "2024-03-25",
            assignee: "John Doe",
            priority: "high"
          },
          {
            title: "Update Documentation",
            description: "Update system documentation with recent changes",
            dueDate: "2024-03-28",
            assignee: "Jane Smith",
            priority: "medium"
          }
        ]
      },
      inProgress: {
        title: "In Progress",
        status: "inProgress",
        tasks: [
          {
            title: "Database Migration",
            description: "Migrate data to new database structure",
            dueDate: "2024-03-30",
            assignee: "Mike Johnson",
            priority: "high"
          }
        ]
      },
      completed: {
        title: "Completed",
        status: "completed",
        tasks: [
          {
            title: "Server Deployment",
            description: "Deploy application to production servers",
            dueDate: "2024-03-20",
            assignee: "Sarah Wilson",
            priority: "low"
          }
        ]
      }
    };
  
    return (
      <div className="task-grid">
        {Object.values(tasks).map((section, index) => (
          <TaskCard
            key={index}
            title={section.title}
            tasks={section.tasks}
            status={section.status}
          />
        ))}
      </div>
    );
  };
  
  export default DashboardTasks;