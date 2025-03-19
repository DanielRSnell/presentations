import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function CostComparisonChart({ data, title }) {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Bar dataKey="n8n" name="N8N Solution" fill="#4f46e5" />
          <Bar dataKey="microsoft" name="Microsoft Solution" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
