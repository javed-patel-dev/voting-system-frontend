import axiosInstance from "./axiosInstance";

const POLL_API_URL = '/polls';

const fetchPolls = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${POLL_API_URL}/list`, payload).then((res) => res.data);

const fetchPollById = (pollId: string) =>
  axiosInstance.get(`${POLL_API_URL}/${pollId}`).then((res) => res.data);

export default {
  fetchPolls,
  fetchPollById,
};
