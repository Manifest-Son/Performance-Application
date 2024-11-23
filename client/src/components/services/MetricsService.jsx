// services/metricsService.jsx
import { apiURL } from "../../config/config";

export const getPerformanceMetrics = async () => {
  try {
    const response = await fetch(`${apiURL}/metrics/performance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch metrics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    throw error;
  }
};

export const getLecturerMetrics = async (lecturerId) => {
  try {
    const response = await fetch(`${apiURL}/metrics/lecturer/${lecturerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lecturer metrics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching lecturer metrics:", error);
    throw error;
  }
};

export const getDepartmentMetrics = async (departmentId) => {
  try {
    const response = await fetch(
      `${apiURL}/metrics/department/${departmentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch department metrics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching department metrics:", error);
    throw error;
  }
};

export const getAnalyticsData = async (timeRange = "30days") => {
  try {
    const response = await fetch(
      `${apiURL}/metrics/analytics?range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};

export const getTrendingMetrics = async (lecturerId, period = "6months") => {
  try {
    const response = await fetch(
      `${apiURL}/metrics/trending/${lecturerId}?period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trending metrics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching trending metrics:", error);
    throw error;
  }
};
