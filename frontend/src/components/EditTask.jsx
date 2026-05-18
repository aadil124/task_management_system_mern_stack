import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../utils/fetchWithAuth";

const PRIORITY_OPTIONS = ["low", "medium", "high"];
const STATUS_OPTIONS = ["todo", "inprogress", "completed"];

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    tags: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH TASK
  useEffect(() => {
    fetchWithAuth(`/api/task/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.result) {
          const task = data.result;

          setFormData({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            status: task.status || "todo",
            dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
            tags: Array.isArray(task.tags) ? task.tags.join(", ") : "",
          });
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

          toast.error(data.message || "Task not found");
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        toast.error("Failed to load task");
        navigate("/", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      const response = await fetchWithAuth(`/api/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Task updated successfully! ✅");
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

        toast.error(data.message || "Failed to update task");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">Edit Task</h2>

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
              value={formData.title}
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
              value={formData.description}
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
                value={formData.priority}
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
                value={formData.status}
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
              value={formData.dueDate}
              onChange={handleChange}
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
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="d-flex gap-2">
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
                "Update Task"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/", { replace: true })}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
