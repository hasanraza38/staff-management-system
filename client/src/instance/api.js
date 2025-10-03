import axios from "axios";

export const api = axios.create({
  baseURL: 'https://staff-management-system-eh1t.vercel.app/api/v1',
  withCredentials: true
});
