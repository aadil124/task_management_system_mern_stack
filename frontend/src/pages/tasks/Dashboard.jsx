import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../../utils/fetchWithAuth";

import SummaryCard from "../../components/dashboard/SummaryCard";
import StatusPieChart from "../../components/charts/StatusPieChart";
import PriorityBarChart from "../../components/charts/PriorityBarChart";
import WeeklyLineChart from "../../components/charts/WeeklyLineChart";

const Dashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetchWithAuth("/api/analytics");
        const data = await res.json();

        if (data.success) {
          setAnalytics(data.analytics);
        } else {
          handleUnauthorized();
        }
      } catch {
        toast.error("Failed to load dashboard analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const summary = analytics?.summary || {
    total: 0,
    completed: 0,
    inprogress: 0,
    todo: 0,
    overdue: 0,
    completionRate: 0,
  };

  const statusChart = analytics?.statusChart || [];
  const priorityChart = analytics?.priorityChart || [];
  const weeklyChart = analytics?.weeklyChart || [];

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">👋 Welcome back, {user?.name || "User"}!</h2>

        <p className="text-muted mb-0">
          Here's your productivity analytics dashboard.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row">
        <SummaryCard
          title="Total Tasks"
          value={summary.total}
          icon="📋"
          bgClass="bg-primary"
          subtitle="All tasks"
        />

        <SummaryCard
          title="Completed"
          value={summary.completed}
          icon="✅"
          bgClass="bg-success"
          subtitle="Finished tasks"
        />

        <SummaryCard
          title="In Progress"
          value={summary.inprogress}
          icon="🔄"
          bgClass="bg-info"
          subtitle="Ongoing work"
        />

        <SummaryCard
          title="Todo"
          value={summary.todo}
          icon="📝"
          bgClass="bg-secondary"
          subtitle="Pending tasks"
        />

        <SummaryCard
          title="Overdue"
          value={summary.overdue}
          icon="⚠️"
          bgClass="bg-danger"
          subtitle="Needs attention"
        />

        <SummaryCard
          title="Completion Rate"
          value={`${summary.completionRate}%`}
          icon="📈"
          bgClass="bg-dark"
          subtitle="Overall progress"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-4">
          <StatusPieChart data={statusChart} />
        </div>

        <div className="col-lg-6 mb-4">
          <PriorityBarChart data={priorityChart} />
        </div>
      </div>

      {/* WEEKLY PRODUCTIVITY */}
      <div className="mb-4">
        <WeeklyLineChart data={weeklyChart} />
      </div>

      {/* INSIGHTS + ACTIONS */}
      <div className="row">
        {/* INSIGHTS */}
        <div className="col-lg-7 mb-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "20px" }}
          >
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">📊 Productivity Insights</h4>

              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0 border-0">
                  ✅ You have completed{" "}
                  <strong>{summary.completionRate}%</strong> of your tasks.
                </li>

                <li className="list-group-item px-0 border-0">
                  🔄 <strong>{summary.inprogress}</strong> task(s) are currently
                  in progress.
                </li>

                <li className="list-group-item px-0 border-0">
                  📝 <strong>{summary.todo}</strong> task(s) are still pending.
                </li>

                {summary.overdue > 0 && (
                  <li className="list-group-item px-0 border-0 text-danger fw-semibold">
                    ⚠️ You have {summary.overdue} overdue task
                    {summary.overdue > 1 ? "s" : ""}.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="col-lg-5 mb-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "20px" }}
          >
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">⚡ Quick Actions</h4>

              <div className="d-grid gap-3">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/add-task")}
                >
                  ➕ Add New Task
                </button>

                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => navigate("/")}
                >
                  📋 View Task List
                </button>

                <button
                  className="btn btn-outline-dark btn-lg"
                  onClick={() => navigate("/profile")}
                >
                  👤 Manage Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
