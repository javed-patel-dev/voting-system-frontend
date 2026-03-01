import { Poll } from "@/pages/PollPage";
import axiosInstance from "./axiosInstance";

const POLL_API_URL = "/polls";

const fetchPolls = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${POLL_API_URL}/list`, payload).then((res) => res.data);

const fetchPollById = (pollId: string) =>
  axiosInstance.get(`${POLL_API_URL}/${pollId}`).then((res) => res.data);

const createPoll = (payload: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}) => axiosInstance.post("/polls", payload).then((res) => res.data);

const updatePoll = (pollId: string, payload: Partial<Poll>) =>
  axiosInstance.put(`${POLL_API_URL}/${pollId}`, payload).then((res) => res.data);

const deletePoll = (pollId: string) =>
  axiosInstance.delete(`${POLL_API_URL}/${pollId}`).then((res) => res.data);

const listPolls = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${POLL_API_URL}/list`, payload).then((res) => res.data);

export default {
  fetchPolls,
  fetchPollById,
  createPoll,
  updatePoll,
  deletePoll,
  listPolls,
};
