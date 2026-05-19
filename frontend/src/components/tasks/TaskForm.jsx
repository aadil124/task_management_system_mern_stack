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
    subtasks: [],
  });

  const [newSubtask, setNewSubtask] = useState("");

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
        subtasks: initialData.subtasks || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) {
      toast.error("Subtask title required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        {
          title: newSubtask.trim(),
          completed: false,
        },
      ],
    }));

    setNewSubtask("");
  };

  const toggleSubtask = (index) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) =>
        i === index
          ? {
              ...subtask,
              completed: !subtask.completed,
            }
          : subtask,
      ),
    }));
  };

  const removeSubtask = (index) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
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

    const incompleteSubtasks = formData.subtasks.some(
      (subtask) => !subtask.completed,
    );

    if (
      formData.status === "completed" &&
      formData.subtasks.length > 0 &&
      incompleteSubtasks
    ) {
      toast.error("Complete all subtasks before marking task as completed");
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
  };

  const completedCount = formData.subtasks.filter(
    (task) => task.completed,
  ).length;

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
            Organize work efficiently with priorities and checklist tracking.
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

          {/* SUBTASKS */}
          <div
            className="card border-0 bg-light mb-4"
            style={{
              borderRadius: "18px",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Checklist / Subtasks</h5>

                <span className="badge bg-primary rounded-pill">
                  {completedCount}/{formData.subtasks.length} completed
                </span>
              </div>

              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  style={{
                    borderRadius: "12px",
                  }}
                />

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addSubtask}
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  Add
                </button>
              </div>

              {formData.subtasks.length === 0 ? (
                <p className="text-muted mb-0">No subtasks added yet</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {formData.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center bg-white p-3 rounded"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(index)}
                        />

                        <span
                          style={{
                            textDecoration: subtask.completed
                              ? "line-through"
                              : "none",
                            color: subtask.completed ? "#6c757d" : "#212529",
                          }}
                        >
                          {subtask.title}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeSubtask(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
