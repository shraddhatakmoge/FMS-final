import axios from "axios";

export const getApi = () => {
  const token = localStorage.getItem("access_token"); // JWT token
  return axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
