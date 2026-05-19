import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PriorityBarChart = ({ data }) => {
  return (
    <div
      className="card shadow-sm border-0 h-100"
      style={{ borderRadius: "20px" }}
    >
      <div className="card-body">
        <h5 className="fw-bold mb-4">Priority Breakdown</h5>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityBarChart;
