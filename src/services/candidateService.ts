import axiosInstance from "./axiosInstance";

const CANDIDATE_PATH = "/candidates";

const listCandidates = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${CANDIDATE_PATH}/list`, payload).then((res) => res.data);

export default {
  listCandidates,
};
