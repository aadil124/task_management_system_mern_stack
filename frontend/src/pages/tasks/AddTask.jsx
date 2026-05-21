import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import fetchWithAuth from "../../utils/fetchWithAuth";
import TaskForm from "../../components/tasks/TaskForm";

const AddTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const prefilledDate = searchParams.get("date") || "";

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
        headers: {
          "Content-Type": "application/json",
        },
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
        initialData={{
          dueDate: prefilledDate,
        }}
        onSubmit={handleCreateTask}
        loading={loading}
        submitLabel="Create Task"
        onCancel={() => navigate("/")}
      />
    </div>
  );
};

export default AddTask;
