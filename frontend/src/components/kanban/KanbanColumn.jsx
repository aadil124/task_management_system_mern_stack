import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";

const KanbanColumn = ({ columnId, title, tasks }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div
        className="card border-0 shadow-sm h-100"
        style={{
          borderRadius: "20px",
          background: "#f8f9fa",
          minHeight: "650px",
        }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">{title}</h5>

            <span className="badge bg-dark rounded-pill">{tasks.length}</span>
          </div>

          <Droppable droppableId={columnId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  minHeight: "550px",
                  padding: "8px",
                  borderRadius: "14px",
                  background: snapshot.isDraggingOver
                    ? "#e9f5ff"
                    : "transparent",
                  transition: "0.2s",
                }}
              >
                {tasks.map((task, index) => (
                  <KanbanTaskCard key={task._id} task={task} index={index} />
                ))}

                {provided.placeholder}

                {tasks.length === 0 && (
                  <div className="text-center text-muted mt-5">
                    No tasks here
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
