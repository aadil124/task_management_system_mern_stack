import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="fw-bold mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="d-flex gap-3">
        <button className="btn btn-primary px-4" onClick={() => navigate("/")}>
          Go to Home
        </button>
        <button
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
