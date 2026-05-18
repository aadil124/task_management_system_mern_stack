import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../utils/fetchWithAuth";

const PRIORITY_OPTIONS = ["low", "medium", "high"];
const STATUS_OPTIONS = ["todo", "inprogress", "completed"];

const AddTask = () => {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    tags: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setTaskData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...taskData,
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        tags: taskData.tags
          ? taskData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      const response = await fetchWithAuth("/api/add-task", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Task added successfully! ✅");

        setTaskData({
          title: "",
          description: "",
          priority: "medium",
          status: "todo",
          dueDate: "",
          tags: "",
        });

        navigate("/", { replace: true });
      } else {
        if (
          data.message?.toLowerCase().includes("token") ||
          data.message?.toLowerCase().includes("unauthorized")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        toast.error(data.message || "Failed to add task");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: "100%",
          maxWidth: "560px",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">Add New Task</h2>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Title <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              name="title"
              className="form-control"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>

            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={taskData.description}
              onChange={handleChange}
            />
          </div>

          {/* PRIORITY + STATUS */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label fw-semibold">Priority</label>

              <select
                name="priority"
                className="form-select"
                value={taskData.priority}
                onChange={handleChange}
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col">
              <label className="form-label fw-semibold">Status</label>

              <select
                name="status"
                className="form-select"
                value={taskData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "inprogress"
                      ? "In Progress"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DUE DATE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Due Date</label>

            <input
              type="date"
              name="dueDate"
              className="form-control"
              value={taskData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* TAGS */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Tags{" "}
              <span className="text-muted fw-normal">(comma separated)</span>
            </label>

            <input
              type="text"
              name="tags"
              className="form-control"
              placeholder="work, urgent, design"
              value={taskData.tags}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              "Add Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
