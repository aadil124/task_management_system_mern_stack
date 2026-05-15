import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../utils/fetchWithAuth";

// ── Reusable confirmation modal ───────────────────────────────────────────────
const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div
      className="modal d-flex align-items-center justify-content-center"
      style={{
        display: "flex !important",
        background: "rgba(0,0,0,0.5)",
        position: "fixed",
        inset: 0,
        zIndex: 1050,
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

// ── Main List component ───────────────────────────────────────────────────────
const List = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // modal state — stores what to show and what to run on confirm
  const [modal, setModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  // ── modal helpers ───────────────────────────────────────────
  const showConfirm = (message, onConfirm) => {
    setModal({ show: true, message, onConfirm });
  };

  const closeModal = () => {
    setModal({ show: false, message: "", onConfirm: null });
  };

  // ── checkbox helpers ────────────────────────────────────────
  const allSelected = tasks.length > 0 && selectedIds.length === tasks.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : tasks.map((t) => t._id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ── fetch ───────────────────────────────────────────────────
  const fetchTaskListData = () => {
    fetchWithAuth("/api/task-list")
      .then((res) => res.json())
      .then((res) => {
        setTasks(res.result);
        setSelectedIds([]);
      });
  };

  useEffect(() => {
    fetchTaskListData();
  }, []);

  // ── delete single ───────────────────────────────────────────
  const handleDelete = (task) => {
    showConfirm(
      `Are you sure you want to delete "${task.title}"?`,
      async () => {
        closeModal();
        const response = await fetchWithAuth(`/api/delete/${task._id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result?.success) {
          toast.success("Task deleted successfully!");
          fetchTaskListData();
        }
      },
    );
  };

  // ── delete multiple ─────────────────────────────────────────
  const handleDeleteSelected = () => {
    showConfirm(
      `Are you sure you want to delete ${selectedIds.length} selected task(s)?`,
      async () => {
        closeModal();
        const response = await fetchWithAuth("/api/delete-multiple", {
          method: "DELETE",
          body: JSON.stringify({ ids: selectedIds }),
        });
        const result = await response.json();
        if (result?.success) {
          toast.success(`${selectedIds.length} task(s) deleted!`);
          fetchTaskListData();
        }
      },
    );
  };

  // ── edit ────────────────────────────────────────────────────
  const handleEdit = (task) => {
    navigate(`/edit-task/${task._id}`);
  };

  // ── render ──────────────────────────────────────────────────
  return (
    <>
      <ConfirmModal
        show={modal.show}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      <div className="container mt-5">
        <div className="card shadow border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
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

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: "48px" }} className="text-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        title="Select all"
                      />
                    </th>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr
                        key={task._id}
                        className={
                          selectedIds.includes(task._id) ? "table-warning" : ""
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
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(task)}
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
                      <td colSpan="5" className="text-center text-muted">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
