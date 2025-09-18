import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const POLL_API_URL = `${BASE_URL}/polls`;

const fetchPolls = (payload: { page: number; limit: number; filter: object }) =>
  axios
    .post(`${POLL_API_URL}/list`, payload)
    .then((res) => res.data);


export default {
  fetchPolls,
};
