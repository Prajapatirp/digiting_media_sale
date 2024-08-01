import axios from "axios";
import config from "../config";
import { getItem } from "Components/emus/emus";
const { api } = config;
const token = getItem('token')

export const authServices = axios.create({
  baseURL: api.API_URL,
  headers: {
    Accept: "application/json",
  },
});
export const authInstanceMultipart = axios.create({
  baseURL: api.API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  }
});
authServices.interceptors.request.use(async (config) => {
  const token = sessionStorage.getItem("authUser");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
authInstanceMultipart.interceptors.request.use(async (config) => {
  const token = sessionStorage.getItem("authUser");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
