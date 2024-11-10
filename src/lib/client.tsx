import axios from "axios";

export const client = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});
