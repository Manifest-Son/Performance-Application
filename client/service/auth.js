import "dotenv/config";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("userToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};
