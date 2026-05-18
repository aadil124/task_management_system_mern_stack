import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../utils/fetchWithAuth";

const PRIORITY_COLOR = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const STATUS_COLOR = {
  todo: "secondary",
  inprogress: "primary",
  completed: "success",
};

const STATUS_LABEL = {
  todo: "Todo",
  inprogress: "In Progress",
  completed: "Completed",
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "completed") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(dueDate) < today;
};

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        inset: 0,
        zIndex: 1050,
        background: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="modal-dialog modal-dialog-centered m-0">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger">
              ⚠️ Confirm Delete
            </h5>
          </div>

          <div className="modal-body py-3">
            <p className="mb-0 text-secondary">{message}</p>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              className="btn btn-secondary btn-sm px-4"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button className="btn btn-danger btn-sm px-4" onClick={onConfirm}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const List = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const showConfirm = (message, onConfirm) => {
    setModal({
      show: true,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal({
      show: false,
      message: "",
      onConfirm: null,
    });
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const allSelected = tasks.length > 0 && selectedIds.length === tasks.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((task) => task._id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (priority) params.append("priority", priority);
      if (status) params.append("status", status);
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);

      const res = await fetchWithAuth(`/api/task-list?${params.toString()}`);

      const data = await res.json();

      if (data.success) {
        setTasks(data.result || []);
        setSelectedIds([]);
      } else {
        handleUnauthorized();
      }
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [search, priority, status, sortBy, order, navigate]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delay);
  }, [fetchTasks]);

  const handleDelete = (task) => {
    showConfirm(`Delete "${task.title}"?`, async () => {
      closeModal();

      try {
        const res = await fetchWithAuth(`/api/delete/${task._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Task deleted successfully");
          fetchTasks();
        } else {
          if (
            data.message?.toLowerCase().includes("token") ||
            data.message?.toLowerCase().includes("unauthorized")
          ) {
            handleUnauthorized();
            return;
          }

          toast.error(data.message || "Delete failed");
        }
      } catch {
        toast.error("Delete failed");
      }
    });
  };

  const handleDeleteSelected = () => {
    showConfirm(`Delete ${selectedIds.length} selected task(s)?`, async () => {
      closeModal();

      try {
        const res = await fetchWithAuth("/api/delete-multiple", {
          method: "DELETE",
          body: JSON.stringify({
            ids: selectedIds,
          }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success(`${data.result.deletedCount} task(s) deleted`);
          fetchTasks();
        } else {
          if (
            data.message?.toLowerCase().includes("token") ||
            data.message?.toLowerCase().includes("unauthorized")
          ) {
            handleUnauthorized();
            return;
          }

          toast.error(data.message || "Bulk delete failed");
        }
      } catch {
        toast.error("Bulk delete failed");
      }
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setPriority("");
    setStatus("");
    setSortBy("createdAt");
    setOrder("desc");
  };

  return (
    <>
      <ConfirmModal {...modal} onCancel={closeModal} />

      <div className="container mt-4">
        {/* FILTERS */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold mb-1">🔍 Search</label>

                <input
                  className="form-control"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold mb-1">Priority</label>

                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold mb-1">Status</label>

                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold mb-1">Sort By</label>

                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div className="col-md-1">
                <label className="form-label fw-semibold mb-1">Order</label>

                <select
                  className="form-select"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>

              <div className="col-md-1">
                <label className="form-label d-block">&nbsp;</label>

                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={handleResetFilters}
                >
                  ↺
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TASK TABLE */}
        <div className="card shadow border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-primary fw-bold mb-0">Task List</h2>

              {selectedIds.length > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th className="text-center" style={{ width: "48px" }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                      </th>

                      <th>#</th>
                      <th>Title</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Tags</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.length > 0 ? (
                      tasks.map((task, index) => (
                        <tr
                          key={task._id}
                          className={
                            isOverdue(task.dueDate, task.status)
                              ? "table-danger"
                              : selectedIds.includes(task._id)
                                ? "table-warning"
                                : ""
                          }
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(task._id)}
                              onChange={() => toggleSelectOne(task._id)}
                            />
                          </td>

                          <td>{index + 1}</td>

                          <td>
                            <div className="fw-semibold">{task.title}</div>

                            {task.description && (
                              <small className="text-muted">
                                {task.description.slice(0, 50)}
                                {task.description.length > 50 ? "..." : ""}
                              </small>
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge bg-${
                                PRIORITY_COLOR[task.priority] || "secondary"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge bg-${
                                STATUS_COLOR[task.status] || "secondary"
                              }`}
                            >
                              {STATUS_LABEL[task.status]}
                            </span>
                          </td>

                          <td>
                            {task.dueDate ? (
                              <span
                                className={
                                  isOverdue(task.dueDate, task.status)
                                    ? "text-danger fw-semibold"
                                    : ""
                                }
                              >
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>

                          <td>
                            {task.tags?.length ? (
                              task.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="badge bg-info text-dark me-1"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>

                          <td className="text-center">
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => navigate(`/edit-task/${task._id}`)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(task)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                          No tasks found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
