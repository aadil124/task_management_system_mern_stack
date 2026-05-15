import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../utils/fetchWithAuth";

const AddTask = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth("/api/add-task", {
        method: "POST",
        body: JSON.stringify(taskData),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Task added successfully!");
        setTaskData({ title: "", description: "" });
        navigate("/");
      } else {
        toast.error("Failed to add task. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{ width: "100%", maxWidth: "500px", borderRadius: "20px" }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">Add New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={taskData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
