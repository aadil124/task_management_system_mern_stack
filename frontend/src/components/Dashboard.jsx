import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../utils/fetchWithAuth";

const StatCard = ({ title, value, color, icon }) => (
  <div className="col-md-4 col-6 mb-4">
    <div className={`card border-0 shadow-sm text-white bg-${color} h-100`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="mb-1 opacity-75 fw-semibold">{title}</p>
          <h2 className="fw-bold mb-0">{value}</h2>
        </div>
        <div style={{ fontSize: "2.5rem", opacity: 0.6 }}>{icon}</div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  useEffect(() => {
    fetchWithAuth("/api/task-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const completionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="container mt-4">
      {/* Welcome */}
      <div className="mb-4">
        <h3 className="fw-bold">👋 Welcome back, {user.name}!</h3>
        <p className="text-muted mb-0">Here's your task overview for today.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row">
            <StatCard
              title="Total Tasks"
              value={stats?.total || 0}
              color="primary"
              icon="📋"
            />
            <StatCard
              title="Completed"
              value={stats?.completed || 0}
              color="success"
              icon="✅"
            />
            <StatCard
              title="In Progress"
              value={stats?.inprogress || 0}
              color="info"
              icon="🔄"
            />
            <StatCard
              title="Todo"
              value={stats?.todo || 0}
              color="secondary"
              icon="📝"
            />
            <StatCard
              title="Overdue"
              value={stats?.overdue || 0}
              color="danger"
              icon="⚠️"
            />
          </div>

          {/* Progress Bar */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold">Overall Completion</span>
                <span className="fw-bold text-primary">{completionRate}%</span>
              </div>
              <div className="progress" style={{ height: "12px" }}>
                <div
                  className={`progress-bar ${completionRate === 100 ? "bg-success" : "bg-primary"}`}
                  style={{
                    width: `${completionRate}%`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              {stats?.overdue > 0 && (
                <p className="text-danger mt-2 mb-0 small fw-semibold">
                  ⚠️ You have {stats.overdue} overdue task
                  {stats.overdue > 1 ? "s" : ""}!
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Quick Actions</h5>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/add-task")}
                >
                  ➕ Add New Task
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/")}
                >
                  📋 View All Tasks
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
