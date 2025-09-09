import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = (email: string, password: string) =>
  axios
    .post(`${BASE_URL}/auth/login`, { email, password })
    .then((res) => res.data);

const register = (email: string, password: string, name: string, otp: string) =>
  axios
    .post(`${BASE_URL}/users/register`, { email, password, name, otp })
    .then((res) => res.data);

const resetPassword = (
  email: string,
  password: string,
  otp: string
) =>
  axios
    .post(`${BASE_URL}/auth/reset/password`, { email, password, otp })
    .then((res) => res.data);

const registrationOTP = (email: string) =>
  axios
    .post(`${BASE_URL}/auth/registration/otp`, { email })
    .then((res) => res.data);

const resetPasswordOTP = (email: string) =>
  axios
    .post(`${BASE_URL}/auth/password/reset/otp`, { email })
    .then((res) => res.data);

const verifyOTP = (email: string, otp: string, purpose: string) =>
  axios
    .post(`${BASE_URL}/auth/otp/verify`, { email, otp, purpose })
    .then((res) => res.data);

export default {
  login,
  register,
  resetPassword,
  registrationOTP,
  verifyOTP,
  resetPasswordOTP,
};
