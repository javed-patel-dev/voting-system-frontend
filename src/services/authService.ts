import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = (email: string, password: string) =>
  axios
    .post(`${BASE_URL}/auth/login`, { email, password })
    .then((res) => res.data);

const register = (email: string, password: string, otp: string) =>
  axios
    .post(`${BASE_URL}/auth/register`, { email, password, otp })
    .then((res) => res.data);

export default { login, register };
