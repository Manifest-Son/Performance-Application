// src/config/websocket.js
import { WebSocketServer } from 'ws';
import { PerformanceAnalyzer } from '../../../ai/deberta.js';

export class NotificationWebSocket {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();
    this.analyzer = new PerformanceAnalyzer();
    this.initialize();
  }

  initialize() {
    this.wss.on('connection', (ws, req) => {
      const userId = this.getUserIdFromUrl(req.url);
      if (userId) {
        this.clients.set(userId, ws);
        
        ws.on('close', () => {
          this.clients.delete(userId);
        });
      }
    });
  }

  getUserIdFromUrl(url) {
    const match = url.match(/\/ws\/(\w+)/);
    return match ? match[1] : null;
  }

  async sendNotification(userId, notification) {
    const ws = this.clients.get(userId);
    if (ws) {
      const enhancedNotification = await this.enhanceNotification(notification);
      ws.send(JSON.stringify(enhancedNotification));
    }
  }

  async enhanceNotification(notification) {
    if (notification.type === 'TASK_REMINDER') {
      const aiContext = await this.analyzer.generateReminder({
        taskTitle: notification.taskTitle,
        dueDate: notification.dueDate,
        priority: notification.priority
      });
      return { ...notification, aiContext };
    }
    return notification;
  }
}