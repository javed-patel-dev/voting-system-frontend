import axiosInstance from "./axiosInstance";

const USERS_PATH = "/users";

const listUsers = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${USERS_PATH}/list`, payload).then((res) => res.data);

export default {
  listUsers,
};
