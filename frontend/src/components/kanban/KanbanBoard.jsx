import React, { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchWithAuth from "../../utils/fetchWithAuth";
import KanbanColumn from "./KanbanColumn";
import KanbanToolbar from "./KanbanToolbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const columns = {
  todo: "Todo",
  inprogress: "In Progress",
  completed: "Completed",
};

const KanbanBoard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetchWithAuth("/api/task-list");
      const data = await res.json();

      if (data.success) {
        setTasks(data.result || []);
      } else {
        toast.error(data.message || "Failed to load tasks");
      }
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = !priority || task.priority === priority;

    return matchesSearch && matchesPriority;
  });

  const groupedTasks = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    inprogress: filteredTasks.filter((task) => task.status === "inprogress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = tasks.find((task) => task._id === draggableId);

    if (!movedTask) return;

    const previousStatus = movedTask.status;
    const newStatus = destination.droppableId;

    // optimistic UI update
    setTasks((prev) =>
      prev.map((task) =>
        task._id === draggableId
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );

    try {
      const res = await fetchWithAuth(`/api/${draggableId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: destination.droppableId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Task updated successfully");
    } catch (error) {
      // rollback
      setTasks((prev) =>
        prev.map((task) =>
          task._id === draggableId
            ? {
                ...task,
                status: previousStatus,
              }
            : task,
        ),
      );

      toast.error(error.message || "Unable to move task");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Kanban Board</h2>

        <p className="text-muted mb-0">
          Drag and drop tasks to manage workflow efficiently.
        </p>
      </div>

      {/* TOOLBAR */}
      <KanbanToolbar
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        onRefresh={fetchTasks}
        onAddTask={() => navigate("/add-task")}
      />

      {/* BOARD */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {Object.entries(columns).map(([key, title]) => (
            <KanbanColumn
              key={key}
              columnId={key}
              title={title}
              tasks={groupedTasks[key]}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
