const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

export default fetchWithAuth;