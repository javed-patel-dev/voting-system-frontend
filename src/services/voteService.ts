import axiosInstance from "./axiosInstance";

const VOTE_PATH = '/votes';

const castVote = (payload: { candidateId: string; pollId: string }) =>
  axiosInstance
    .post(`${VOTE_PATH}/cast`, payload)
    .then((res) => res.data);

export default {
  castVote,
};
