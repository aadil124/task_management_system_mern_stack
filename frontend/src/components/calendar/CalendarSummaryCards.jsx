import React from "react";

const cardConfig = [
  {
    key: "overdue",
    label: "Overdue",
    icon: "⚠️",
    bg: "danger",
  },
  {
    key: "today",
    label: "Due Today",
    icon: "📅",
    bg: "primary",
  },
  {
    key: "week",
    label: "This Week",
    icon: "🗓️",
    bg: "warning",
  },
  {
    key: "completed",
    label: "Completed",
    icon: "✅",
    bg: "success",
  },
];

const CalendarSummaryCards = ({ stats }) => {
  return (
    <div className="row g-4 mb-4">
      {cardConfig.map((card) => (
        <div key={card.key} className="col-md-6 col-xl-3">
          <div
            className={`card border-0 shadow-sm bg-${card.bg} text-white h-100`}
            style={{
              borderRadius: "20px",
              height: "110px",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small opacity-75">{card.label}</div>

                  <h3 className="fw-bold mb-0">{stats[card.key]}</h3>
                </div>

                <div style={{ fontSize: "2rem" }}>{card.icon}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarSummaryCards;
