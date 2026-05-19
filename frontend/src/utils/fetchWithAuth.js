import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  toast.error("Session expired. Please log in again.");

  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
};

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    try {
      const data = await response.clone().json();

      if (data.expired || data.message === "Invalid token") {
        logoutUser();
      }
    } catch {
      logoutUser();
    }
  }

  return response;
};

export default fetchWithAuth;
