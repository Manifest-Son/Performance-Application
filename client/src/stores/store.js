// src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const useMetricsStore = create((set) => ({
  metrics: null,
  lecturerMetrics: {},
  loading: false,
  error: null,
  setMetrics: (metrics) => set({ metrics }),
  setTrendingMetrics: (trendingMetrics) => set({ trendingMetrics }),
  setLecturerMetrics: (lecturerId, metrics) =>
    set((state) => ({
      lecturerMetrics: {
        ...state.lecturerMetrics,
        [lecturerId]: metrics,
      },
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
