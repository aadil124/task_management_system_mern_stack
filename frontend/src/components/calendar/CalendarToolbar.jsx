import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-big-calendar";

const CalendarToolbar = ({ label, onNavigate, onView, view }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column flex-xl-row justify-content-between align-items-center gap-4 mb-4 w-100">
      {/* LEFT */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          ← Previous
        </button>

        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={() => onNavigate(Navigate.TODAY)}
        >
          Today
        </button>

        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          Next →
        </button>
      </div>

      {/* CENTER */}
      <div
        className="text-center flex-grow-1"
        style={{
          minWidth: "220px",
        }}
      >
        <h2 className="fw-bold mb-0">{label}</h2>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <div className="btn-group shadow-sm">
          <button
            className={`btn ${
              view === "month" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => onView("month")}
          >
            Month
          </button>

          <button
            className={`btn ${
              view === "week" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => onView("week")}
          >
            Week
          </button>

          <button
            className={`btn ${
              view === "day" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => onView("day")}
          >
            Day
          </button>
        </div>

        <button
          className="btn btn-success rounded-pill px-4"
          onClick={() => navigate("/add-task")}
        >
          + Add Task
        </button>

        <button
          className="btn btn-outline-secondary rounded-pill px-4"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
