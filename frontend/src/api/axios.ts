import axios from "axios";

const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const instance = axios.create({
  baseURL: host,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const delToken = () => {
  instance.defaults.headers.common["Authorization"] = "";
};
