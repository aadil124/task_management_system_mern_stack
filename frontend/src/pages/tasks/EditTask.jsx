import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import fetchWithAuth from "../../utils/fetchWithAuth";
import TaskForm from "../../components/tasks/TaskForm";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.error("Session expired. Please login again.");
    navigate("/login", { replace: true });
  };

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await fetchWithAuth(`/api/task/${id}`);

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setTask(data.result);
      } else {
        toast.error(data.message || "Task not found");
        navigate("/", { replace: true });
      }
    } catch {
      toast.error("Failed to fetch task");
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/", { replace: true });
      return;
    }

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (taskData) => {
    try {
      setSaving(true);

      const response = await fetchWithAuth(`/api/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Task updated successfully");
        navigate("/", { replace: true });
      } else {
        toast.error(data.message || "Failed to update task");
      }
    } catch {
      toast.error("Something went wrong while updating task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div
      className="container mt-4"
      style={{
        maxWidth: "900px",
      }}
    >
      <TaskForm
        initialData={task}
        onSubmit={handleUpdateTask}
        loading={saving}
        submitLabel="Update Task"
        onCancel={() => navigate("/")}
      />
    </div>
  );
};

export default EditTask;
