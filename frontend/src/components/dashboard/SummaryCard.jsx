import React from "react";

const SummaryCard = ({
  title,
  value,
  icon,
  bgClass = "bg-primary",
  subtitle,
}) => {
  return (
    <div className="col-xl-4 col-md-6 col-12 mb-4">
      <div
        className={`card border-0 shadow-sm h-100 ${bgClass} text-white`}
        style={{
          borderRadius: "20px",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center p-4">
          <div>
            <p
              className="mb-1 fw-semibold"
              style={{
                opacity: 0.85,
                fontSize: "0.95rem",
              }}
            >
              {title}
            </p>

            <h2 className="fw-bold mb-1">{value}</h2>

            {subtitle && <small style={{ opacity: 0.8 }}>{subtitle}</small>}
          </div>

          <div
            style={{
              fontSize: "2.8rem",
              opacity: 0.75,
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
