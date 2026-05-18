const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // only set JSON content type if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

export default fetchWithAuth;
