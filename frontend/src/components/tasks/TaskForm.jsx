import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const TaskForm = ({
  initialData = null,
  onSubmit,
  loading,
  submitLabel = "Save Task",
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium",
        status: initialData.status || "todo",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (formData.title.trim().length < 3) {
      toast.error("Task title must be at least 3 characters");
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: "24px",
      }}
    >
      <div className="card-body p-4 p-md-5">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="fw-bold mb-2">
            {initialData ? "Edit Task" : "Create New Task"}
          </h2>

          <p className="text-muted mb-0">
            Organize your work efficiently with clear priorities and deadlines.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Task Title</label>

            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              style={{
                borderRadius: "14px",
                padding: "14px",
              }}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Description</label>

            <textarea
              name="description"
              className="form-control"
              rows="5"
              placeholder="Describe your task..."
              value={formData.description}
              onChange={handleChange}
              style={{
                borderRadius: "14px",
                padding: "14px",
                resize: "none",
              }}
            />
          </div>

          {/* GRID */}
          <div className="row">
            {/* PRIORITY */}
            <div className="col-md-4 mb-4">
              <label className="form-label fw-semibold">Priority</label>

              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
                style={{
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="col-md-4 mb-4">
              <label className="form-label fw-semibold">Status</label>

              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                style={{
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* DUE DATE */}
            <div className="col-md-4 mb-4">
              <label className="form-label fw-semibold">Due Date</label>

              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                style={{
                  borderRadius: "14px",
                  padding: "14px",
                }}
              />
            </div>
          </div>

          {/* FUTURE SUBTASK SLOT */}
          <div
            className="alert alert-light border mb-4"
            style={{
              borderRadius: "16px",
            }}
          >
            <strong>Coming next:</strong> Subtasks / checklist support
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-3 flex-wrap">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 fw-semibold"
              disabled={loading}
              style={{
                borderRadius: "14px",
                minWidth: "160px",
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2 fw-semibold"
              onClick={onCancel}
              style={{
                borderRadius: "14px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
