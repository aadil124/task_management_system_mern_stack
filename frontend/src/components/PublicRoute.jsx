import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return children;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expired = payload.exp * 1000 < Date.now();

    if (expired) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return children;
    }

    return <Navigate to="/" replace />;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return children;
  }
};

export default PublicRoute;
