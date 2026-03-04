import axiosInstance from "./axiosInstance";

const USERS_PATH = "/users";

// Types
interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatar?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// List users (admin)
const listUsers = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${USERS_PATH}/list`, payload).then((res) => res.data);

// Get current user profile
const getProfile = (): Promise<{ success: boolean; data: UserProfile; message?: string }> =>
  axiosInstance.get(`${USERS_PATH}/profile`).then((res) => res.data);

// Update user profile
const updateProfile = (
  payload: UpdateProfilePayload
): Promise<{ success: boolean; data?: UserProfile; message?: string }> =>
  axiosInstance.put(`${USERS_PATH}/profile`, payload).then((res) => res.data);

// Change password
const changePassword = (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string }> =>
  axiosInstance.put(`${USERS_PATH}/change-password`, payload).then((res) => res.data);

export default {
  listUsers,
  getProfile,
  updateProfile,
  changePassword,
};
