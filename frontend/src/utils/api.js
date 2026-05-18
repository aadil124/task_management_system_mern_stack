const API_BASE = import.meta.env.VITE_API_URL;

export const getRequest = async (url, token) => {
  return fetch(`${API_BASE}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postRequest = async (url, data, token) => {
  return fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });
};

export const putRequest = async (url, data, token) => {
  return fetch(`${API_BASE}${url}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
};
