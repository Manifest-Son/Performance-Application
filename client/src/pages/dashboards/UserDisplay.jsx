// UserDisplay.jsx
import DashboardUserCard from "../../components/DashboardUserCard";
import { useState, useEffect } from "react";
import "../../styling/UsersDisplay.css";
import simonImg from "../../data/simon.jpg";

const mockUserData = [
  {
    name: "John Doe",
    role: "Project Manager",
    avatar: simonImg,
    stats: {
      tasksCompleted: 15,
      tasksInProgress: 5,
      tasksPending: 8,
    },
    lastActive: new Date().toISOString(),
    status: "online",
  },
  {
    name: "John Doe",
    role: "Project Manager",
    avatar: simonImg,
    stats: {
      tasksCompleted: 15,
      tasksInProgress: 5,
      tasksPending: 8,
    },
    lastActive: new Date().toISOString(),
    status: "online",
  },
  {
    name: "John Doe",
    role: "Project Manager",
    avatar: simonImg,
    stats: {
      tasksCompleted: 15,
      tasksInProgress: 5,
      tasksPending: 8,
    },
    lastActive: new Date().toISOString(),
    status: "online",
  },
  {
    name: "John Doe",
    role: "Project Manager",
    avatar: simonImg,
    stats: {
      tasksCompleted: 15,
      tasksInProgress: 5,
      tasksPending: 8,
    },
    lastActive: new Date().toISOString(),
    status: "online",
  },
];

const UserDisplay = () => {
  const [usersData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setUserData(mockUserData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="users-grid">
        {[1, 2, 3].map((placeholder) => (
          <DashboardUserCard key={placeholder} isLoading={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="users-grid">
      {usersData.map((user) => (
        <DashboardUserCard key={user.id} user={user} isLoading={loading} />
      ))}
    </div>
  );
};

export default UserDisplay;
