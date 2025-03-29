import axios from "axios";

const API = axios.create({
  baseURL:`${import.meta.env.VITE_SERVER}`, // Change this to your actual backend URL
});

// Add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
