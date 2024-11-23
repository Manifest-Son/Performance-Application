// src/components/NotificationSystem.jsx
import { useEffect } from "react";
import { useNotificationStore } from "../stores/notificationStore";
import toast from "react-hot-toast";

const NotificationSystem = () => {
  const { notifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    const ws = new WebSocket("ws://your-websocket-server");

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      if (notification.type === "TASK_ASSIGNMENT") {
        toast.success(notification.message, {
          duration: 5000,
          icon: "🎯",
        });
      } else if (notification.type === "TASK_REMINDER") {
        toast.info(notification.message, {
          duration: 5000,
          icon: "⏰",
        });
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="notifications-panel">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.read ? "read" : "unread"}`}
          onClick={() => markAsRead(notification.id)}
        >
          <p>{notification.message}</p>
          <small>{new Date(notification.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
