export const BASE_URL =
  import.meta.env.MODE === "production" ? "" : "http://localhost:3000";

export const API_PATHS = {
  LEADS: {
    CREATE_LEAD: `${BASE_URL}/api/leads`,
    GET_ALL_LEADS: `${BASE_URL}/api/leads`,
    GET_LEAD_BY_ID: (id) => `${BASE_URL}/api/leads/${id}`,
    UPDATE_LEAD: (id) => `${BASE_URL}/api/leads/${id}`,
    DELETE_LEAD: (id) => `${BASE_URL}/api/leads/${id}`,

    GET_STATS: `${BASE_URL}/api/leads/stats`,
  },
};
