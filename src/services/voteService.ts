import axiosInstance from "./axiosInstance";

const VOTE_PATH = "/votes";

export interface VoteStatusResponse {
  hasVoted: boolean;
  isCandidate: boolean;
  canVote: boolean;
  votedAt: string | null;
}

export interface VoteStatsResponse {
  totalVotes: number;
  candidates: Array<{
    candidateId: string;
    voteCount: number;
    percentage: string;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    manifesto: string;
  }>;
}

// Cast a vote for a candidate
const castVote = (payload: { candidateId: string; pollId: string }) =>
  axiosInstance.post(`${VOTE_PATH}/cast`, payload).then((res) => res.data);

// Check if user has voted in a poll
const checkVoteStatus = (pollId: string): Promise<{ data: VoteStatusResponse; success: boolean }> =>
  axiosInstance.get(`${VOTE_PATH}/status/${pollId}`).then((res) => res.data);

// Get vote statistics for a poll (public)
const getPollStats = (pollId: string): Promise<{ data: VoteStatsResponse; success: boolean }> =>
  axiosInstance.get(`${VOTE_PATH}/stats/${pollId}`).then((res) => res.data);

export default {
  castVote,
  checkVoteStatus,
  getPollStats,
};
