// src/services/ai/scheduler.js
import { PerformanceAnalyzer } from './deberta.js';
import {wsServer} from "../index.js"
import cron from 'node-cron';

export class TaskScheduler {
  constructor() {
    this.analyzer = new PerformanceAnalyzer();
    this.scheduleReminders();
  }

  async generateSmartReminder(task, lecturer) {
    const context = {
      taskTitle: task.title,
      dueDate: task.completionDate,
      priority: task.priority,
      lecturerPerformance: await this.analyzer.analyzePerformance(lecturer)
    };

    const reminder = await this.analyzer.generateReminder(context);
    return reminder;
  }

  scheduleReminders() {
    // Daily morning reminders
    cron.schedule('0 9 * * *', async () => {
      const pendingTasks = await prisma.taskAssignment.findMany({
        where: { status: 'pending' },
        include: {
          assignee: true,
          task: true
        }
      });

      for (const task of pendingTasks) {
        const smartReminder = await this.generateSmartReminder(
          task.task,
          task.assignee
        );

        await prisma.notification.create({
          data: {
            userId: task.assignee_id,
            type: 'TASK_REMINDER',
            message: smartReminder,
            read: false,
            aiGenerated: true
          }
        });
      }
    });
  }
}