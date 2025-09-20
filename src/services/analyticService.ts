import axiosInstance from "./axiosInstance";

const ANALYTIC_PATH = '/analytics';

const listCandidatesPerPollsWithVotes = (payload: {
  page?: number;
  limit?: number;
  filter?: object;
  sort?: object;
}) =>
  axiosInstance
    .post(`${ANALYTIC_PATH}/list-candidate-per-polls-with-votes`, payload)
    .then((res) => res.data);

export default {
  listCandidatesPerPollsWithVotes,
};
