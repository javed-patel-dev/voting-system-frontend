import axiosInstance from "./axiosInstance";

const CANDIDATE_PATH = "/candidates";

export interface RegisterCandidatePayload {
  pollId: string;
  manifesto: string;
}

export interface CandidateStatusResponse {
  isCandidate: boolean;
  candidate: {
    _id: string;
    manifesto: string;
    createdAt: string;
  } | null;
}

// List all candidates with pagination
const listCandidates = (payload: { page: number; limit: number; filter: object }) =>
  axiosInstance.post(`${CANDIDATE_PATH}/list`, payload).then((res) => res.data);

// Get candidates for a specific poll
const getCandidatesByPoll = (pollId: string) =>
  axiosInstance.get(`${CANDIDATE_PATH}/poll/${pollId}`).then((res) => res.data);

// Register as a candidate for a poll
const registerAsCandidate = (payload: RegisterCandidatePayload) =>
  axiosInstance.post(`${CANDIDATE_PATH}/register`, payload).then((res) => res.data);

// Check if current user is a candidate in a poll
const checkCandidateStatus = (
  pollId: string
): Promise<{ data: CandidateStatusResponse; success: boolean }> =>
  axiosInstance.get(`${CANDIDATE_PATH}/status/${pollId}`).then((res) => res.data);

// Update candidate manifesto
const updateManifesto = (candidateId: string, manifesto: string) =>
  axiosInstance.put(`${CANDIDATE_PATH}/${candidateId}`, { manifesto }).then((res) => res.data);

// Withdraw candidacy
const withdrawCandidacy = (candidateId: string) =>
  axiosInstance.delete(`${CANDIDATE_PATH}/withdraw/${candidateId}`).then((res) => res.data);

// Admin: Delete a candidate
const deleteCandidate = (candidateId: string) =>
  axiosInstance.delete(`${CANDIDATE_PATH}/${candidateId}`).then((res) => res.data);

export default {
  listCandidates,
  getCandidatesByPoll,
  registerAsCandidate,
  checkCandidateStatus,
  updateManifesto,
  withdrawCandidacy,
  deleteCandidate,
};
