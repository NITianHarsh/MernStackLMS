import axios from "axios";

// axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "https://mernstacklmsbackend.onrender.com", // Base URL for all API requests
});

// Add a request interceptor to the axios instance, everytime we refresh it will check user is authenticated or not based on this access token
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the access token from session storage
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    // If access token exists, attach it to the request headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Return the modified config to proceed with the request
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosInstance;
