import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import fetchWithAuth from "../../utils/fetchWithAuth";
import TaskForm from "../../components/tasks/TaskForm";

const AddTask = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.error("Session expired. Please login again.");
    navigate("/login", { replace: true });
  };

  const handleCreateTask = async (taskData) => {
    try {
      setLoading(true);

      const response = await fetchWithAuth("/api/add-task", {
        method: "POST",
        body: JSON.stringify(taskData),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Task created successfully");
        navigate("/", { replace: true });
      } else {
        toast.error(data.message || "Failed to create task");
      }
    } catch {
      toast.error("Something went wrong while creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-4"
      style={{
        maxWidth: "900px",
      }}
    >
      <TaskForm
        onSubmit={handleCreateTask}
        loading={loading}
        submitLabel="Create Task"
        onCancel={() => navigate("/")}
      />
    </div>
  );
};

export default AddTask;
