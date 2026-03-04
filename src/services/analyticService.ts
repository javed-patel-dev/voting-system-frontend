import axiosInstance from "./axiosInstance";

const ANALYTIC_PATH = "/analytics";

// Dashboard stats response type
export interface DashboardStats {
  totalVoters: number;
  uniqueVoters: number;
  totalCandidates: number;
  totalPolls: number;
  activePolls: number;
  upcomingPolls: number;
  endedPolls: number;
  totalVotes: number;
  recentActivity: number;
  trendingCandidates: Array<{
    candidateId: string;
    voteCount: number;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    poll: {
      _id: string;
      title: string;
    };
  }>;
  popularPolls: Array<{
    pollId: string;
    voteCount: number;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
  }>;
}

// List candidates per poll with vote counts
const listCandidatesPerPollsWithVotes = (payload: {
  page?: number;
  limit?: number;
  filter?: object;
  sort?: object;
}) =>
  axiosInstance
    .post(`${ANALYTIC_PATH}/list-candidate-per-polls-with-votes`, payload)
    .then((res) => res.data);

// List candidates with voter details (Admin only)
const listCandidatesWithVoters = (payload: {
  page?: number;
  limit?: number;
  filter?: object;
  sort?: object;
}) =>
  axiosInstance
    .post(`${ANALYTIC_PATH}/list-candidate-per-polls-with-voters`, payload)
    .then((res) => res.data);

// Get dashboard statistics (Admin only)
const getDashboardStats = (): Promise<{ data: DashboardStats; success: boolean }> =>
  axiosInstance.get(`${ANALYTIC_PATH}/dashboard-stats`).then((res) => res.data);

// Get voters for a poll (Admin only)
const getVotersForPoll = (pollId: string, page = 1, limit = 10) =>
  axiosInstance
    .get(`${ANALYTIC_PATH}/poll/${pollId}/voters?page=${page}&limit=${limit}`)
    .then((res) => res.data);

// Get voters for a specific candidate (Admin only)
const getVotersForCandidate = (pollId: string, candidateId: string, page = 1, limit = 10) =>
  axiosInstance
    .get(
      `${ANALYTIC_PATH}/poll/${pollId}/candidate/${candidateId}/voters?page=${page}&limit=${limit}`
    )
    .then((res) => res.data);

// Get voting timeline for a poll (Admin only)
const getVotingTimeline = (pollId: string) =>
  axiosInstance.get(`${ANALYTIC_PATH}/poll/${pollId}/timeline`).then((res) => res.data);

// Get user's own voting history
const getMyVotingHistory = (page = 1, limit = 10) =>
  axiosInstance
    .get(`${ANALYTIC_PATH}/my-votes?page=${page}&limit=${limit}`)
    .then((res) => res.data);

// Get user's candidate history
const getMyCandidacies = () =>
  axiosInstance.get(`${ANALYTIC_PATH}/my-candidacies`).then((res) => res.data);

export default {
  listCandidatesPerPollsWithVotes,
  listCandidatesWithVoters,
  getDashboardStats,
  getVotersForPoll,
  getVotersForCandidate,
  getVotingTimeline,
  getMyVotingHistory,
  getMyCandidacies,
};
