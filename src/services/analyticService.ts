import axiosInstance from "./axiosInstance";

const ANALYTIC_PATH = "/analytics";

const listCandidatesPerPollsWithVotes = (payload: {
  page?: number;
  limit?: number;
  filter?: object;
  sort?: object;
}) =>
  axiosInstance
    .post(`${ANALYTIC_PATH}/list-candidate-per-polls-with-votes`, payload)
    .then((res) => res.data);

const listAnalyticsData = (payload: {
  page?: number;
  limit?: number;
  filter?: object;
  sort?: object;
}) => axiosInstance.post(`${ANALYTIC_PATH}/list-analytics-data`, payload).then((res) => res.data);

const getDashboardStats = () =>
  axiosInstance.get(`${ANALYTIC_PATH}/dashboard-stats`).then((res) => res.data);

export default {
  listCandidatesPerPollsWithVotes,
  listAnalyticsData,
  getDashboardStats,
};
