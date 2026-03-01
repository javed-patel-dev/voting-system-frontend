import axiosInstance from "./axiosInstance";

const ANALYTICS_PATH = "/analytics";
const USERS_PATH = "/users";
const POLLS_PATH = "/polls";
const CANDIDATES_PATH = "/candidates";

// Types
interface FilterParams {
  search?: string;
  email?: string;
  role?: string;
  id?: string;
  title?: string;
  description?: string;
  pollId?: string;
  [key: string]: string | undefined;
}

interface SortParams {
  [key: string]: 1 | -1;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  filter?: FilterParams;
  sort?: SortParams;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: string | undefined;
}

interface UpdatePollPayload {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}

// Dashboard Stats
const getDashboardStats = () =>
  axiosInstance.get(`${ANALYTICS_PATH}/dashboard-stats`).then((res) => res.data);

// Users Management
const listUsers = (payload: PaginationParams) =>
  axiosInstance
    .post(`${USERS_PATH}/list`, {
      page: payload.page || 1,
      limit: payload.limit || 10,
      filter: payload.filter || {},
      sort: payload.sort || { createdAt: -1 },
    })
    .then((res) => res.data);

const updateUser = (id: string, payload: UpdateUserPayload) =>
  axiosInstance.post(`${USERS_PATH}/${id}`, payload).then((res) => res.data);

const deleteUser = (id: string) =>
  axiosInstance.post(`${USERS_PATH}/delete/${id}`).then((res) => res.data);

// Polls Management
const listPolls = (payload: PaginationParams) =>
  axiosInstance
    .post(`${POLLS_PATH}/list`, {
      page: payload.page || 1,
      limit: payload.limit || 10,
      filter: payload.filter || {},
      sort: payload.sort || { createdAt: -1 },
    })
    .then((res) => res.data);

const createPoll = (payload: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}) => axiosInstance.post(POLLS_PATH, payload).then((res) => res.data);

const updatePoll = (id: string, payload: UpdatePollPayload) =>
  axiosInstance.post(`${POLLS_PATH}/${id}`, payload).then((res) => res.data);

const deletePoll = (id: string) =>
  axiosInstance.post(`${POLLS_PATH}/delete/${id}`).then((res) => res.data);

const getPollById = (id: string) =>
  axiosInstance.get(`${POLLS_PATH}/${id}`).then((res) => res.data);

// Candidates Management
const listCandidates = (payload: PaginationParams) =>
  axiosInstance
    .post(`${CANDIDATES_PATH}/list`, {
      page: payload.page || 1,
      limit: payload.limit || 10,
      filter: payload.filter || {},
      sort: payload.sort || { createdAt: -1 },
    })
    .then((res) => res.data);

const deleteCandidate = (id: string) =>
  axiosInstance.post(`${CANDIDATES_PATH}/delete/${id}`).then((res) => res.data);

// Analytics
const listPollsWithCandidates = (payload: PaginationParams) =>
  axiosInstance
    .post(`${ANALYTICS_PATH}/list-candidate-per-polls-with-votes`, {
      page: payload.page || 1,
      limit: payload.limit || 10,
      filter: payload.filter || {},
      sort: payload.sort || { voteCount: -1 },
    })
    .then((res) => res.data);

const listCandidatesWithVoters = (payload: PaginationParams) =>
  axiosInstance
    .post(`${ANALYTICS_PATH}/list-candidate-per-polls-with-voters`, {
      page: payload.page || 1,
      limit: payload.limit || 10,
      filter: payload.filter || {},
      sort: payload.sort || { createdAt: -1 },
    })
    .then((res) => res.data);

export default {
  // Dashboard
  getDashboardStats,

  // Users
  listUsers,
  updateUser,
  deleteUser,

  // Polls
  listPolls,
  createPoll,
  updatePoll,
  deletePoll,
  getPollById,

  // Candidates
  listCandidates,
  deleteCandidate,

  // Analytics
  listPollsWithCandidates,
  listCandidatesWithVoters,
};
