import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

console.log("[Axios] API URL:", API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Required for cookies to be sent/received
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}:`, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error(`[API] Error ${status || "Network"}:`, url, error.message);
    
    if (!error.response) {
      console.error("[API] Network error - check if server is running and CORS is configured");
    }
    
    return Promise.reject(error);
  }
);

export default api;
