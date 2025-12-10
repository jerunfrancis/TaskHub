import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API || "http://localhost:8080",
});

// ✅ Always attach JWT token from localStorage
client.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (err) {
      console.error("Token parse error:", err);
    }
  }
  return config;
});

export default client;
