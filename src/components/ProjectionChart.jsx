import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ProjectionChart({ data, title }) {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="n8n" 
            name="N8N Solution" 
            stroke="#4f46e5" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="microsoftLow" 
            name="Microsoft (Low)" 
            stroke="#ef4444" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="microsoftHigh" 
            name="Microsoft (High)" 
            stroke="#f97316" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
