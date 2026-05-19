import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#6c757d", "#0d6efd", "#198754"];

const StatusPieChart = ({ data }) => {
  return (
    <div
      className="card shadow-sm border-0 h-100"
      style={{ borderRadius: "20px" }}
    >
      <div className="card-body">
        <h5 className="fw-bold mb-4">Task Status Distribution</h5>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusPieChart;
