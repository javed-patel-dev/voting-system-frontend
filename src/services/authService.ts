import axiosInstance from "./axiosInstance";

const AUTH_PATH = "/auth";

const login = (email: string, password: string) =>
  axiosInstance.post(`${AUTH_PATH}/login`, { email, password }).then((res) => res.data);

const resetPassword = (email: string, password: string, otp: string) =>
  axiosInstance
    .post(`${AUTH_PATH}/reset/password`, { email, password, otp })
    .then((res) => res.data);

const registrationOTP = (email: string) =>
  axiosInstance.post(`${AUTH_PATH}/registration/otp`, { email }).then((res) => res.data);

const resetPasswordOTP = (email: string) =>
  axiosInstance.post(`${AUTH_PATH}/password/reset/otp`, { email }).then((res) => res.data);

const verifyOTP = (email: string, otp: string, purpose: string) =>
  axiosInstance.post(`${AUTH_PATH}/otp/verify`, { email, otp, purpose }).then((res) => res.data);

const register = (email: string, password: string, name: string, otp: string) =>
  axiosInstance.post(`/users/register`, { email, password, name, otp }).then((res) => res.data);

export default {
  login,
  register,
  resetPassword,
  registrationOTP,
  verifyOTP,
  resetPasswordOTP,
};
