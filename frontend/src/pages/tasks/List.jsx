import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import fetchWithAuth from "../../utils/fetchWithAuth";

import TaskCard from "../../components/tasks/TaskCard";
import TaskFilters from "../../components/tasks/TaskFilters";
import EmptyTasks from "../../components/tasks/EmptyTasks";

const List = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const [loading, setLoading] = useState(true);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.error("Session expired. Please login again.");
    navigate("/login", { replace: true });
  }, [navigate]);

  const fetchTaskListData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        search,
        priority,
        status,
        sortBy,
      });

      const response = await fetchWithAuth(
        `/api/task-list?${params.toString()}`,
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setTasks(data.result || []);
      } else {
        toast.error(data.message || "Failed to fetch tasks");
      }
    } catch {
      toast.error("Something went wrong while fetching tasks");
    } finally {
      setLoading(false);
    }
  }, [search, priority, status, sortBy, handleUnauthorized]);

  useEffect(() => {
    fetchTaskListData();
  }, [fetchTaskListData]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetchWithAuth(`/api/delete/${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Task deleted successfully");
        fetchTaskListData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedTasks.length) {
      toast.error("No tasks selected");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ${selectedTasks.length} selected task(s)?`,
    );

    if (!confirmDelete) return;

    try {
      const response = await fetchWithAuth("/api/delete-multiple", {
        method: "DELETE",
        body: JSON.stringify({
          ids: selectedTasks,
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Selected tasks deleted");
        setSelectedTasks([]);
        fetchTaskListData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  const handleSelectTask = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id)
        ? prev.filter((taskId) => taskId !== id)
        : [...prev, id],
    );
  };

  const handleEdit = (id) => {
    navigate(`/edit-task/${id}`);
  };

  const handleAddTask = () => {
    navigate("/add-task");
  };

  return (
    <div className="container mt-4">
      <TaskFilters
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedTasks={selectedTasks}
        onBulkDelete={handleBulkDelete}
        onAddTask={handleAddTask}
      />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyTasks onAddTask={handleAddTask} />
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              selectedTasks={selectedTasks}
              onSelectTask={handleSelectTask}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
