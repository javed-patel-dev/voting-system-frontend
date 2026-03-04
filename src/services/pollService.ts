import axiosInstance from "./axiosInstance";

const POLL_API_URL = "/polls";

// Types
export interface Poll {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ACTIVE" | "ENDED";
  computedStatus?: "UPCOMING" | "ACTIVE" | "ENDED";
  isResultDeclared: boolean;
  winnerId?: string;
  declaredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  pollId: string;
  manifesto: string;
  voteCount?: number;
  percentage?: string;
  createdAt: string;
}

export interface PollWithCandidates {
  poll: Poll;
  candidates: Candidate[];
  winner: Candidate | null;
}

// Fetch polls with pagination
const fetchPolls = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${POLL_API_URL}/list`, payload).then((res) => res.data);

// Fetch poll by ID
const fetchPollById = (pollId: string) =>
  axiosInstance.get(`${POLL_API_URL}/${pollId}`).then((res) => res.data);

// Fetch full poll details with candidates and results
const fetchFullPollDetails = (
  pollId: string
): Promise<{ data: PollWithCandidates; success: boolean }> =>
  axiosInstance.get(`${POLL_API_URL}/${pollId}/full`).then((res) => res.data);

// Create a new poll (Admin)
const createPoll = (payload: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}) => axiosInstance.post(POLL_API_URL, payload).then((res) => res.data);

// Update a poll (Admin)
const updatePoll = (pollId: string, payload: Partial<Poll>) =>
  axiosInstance.put(`${POLL_API_URL}/${pollId}`, payload).then((res) => res.data);

// Delete a poll (Admin)
const deletePoll = (pollId: string) =>
  axiosInstance.delete(`${POLL_API_URL}/${pollId}`).then((res) => res.data);

// Declare poll results (Admin)
const declareResults = (pollId: string) =>
  axiosInstance.post(`${POLL_API_URL}/${pollId}/declare-results`).then((res) => res.data);

export default {
  fetchPolls,
  fetchPollById,
  fetchFullPollDetails,
  createPoll,
  updatePoll,
  deletePoll,
  declareResults,
};
