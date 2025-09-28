
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Employee, Department } from '../types';

interface PerformanceTrendChartProps {
  employees: Employee[];
}

const COLORS: { [key in Department]?: string } = {
  [Department.Engineering]: '#4f46e5',
  [Department.Marketing]: '#7c3aed',
  [Department.Design]: '#a78bfa',
  [Department.HR]: '#10b981',
  [Department.Sales]: '#f59e0b',
  [Department.Finance]: '#3b82f6',
};

const getQuarter = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `${year} Q${quarter}`;
};

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ employees }) => {
  const data = useMemo(() => {
    const quarterlyData: { [quarter: string]: { [dept: string]: { total: number; count: number } } } = {};

    employees.forEach(employee => {
      employee.performanceHistory.forEach(review => {
        const quarter = getQuarter(new Date(review.date));
        if (!quarterlyData[quarter]) {
          quarterlyData[quarter] = {};
        }
        if (!quarterlyData[quarter][employee.department]) {
          quarterlyData[quarter][employee.department] = { total: 0, count: 0 };
        }
        quarterlyData[quarter][employee.department].total += review.rating;
        quarterlyData[quarter][employee.department].count += 1;
      });
    });

    const chartData = Object.keys(quarterlyData).map(quarter => {
      const entry: { name: string; [key: string]: any } = { name: quarter };
      Object.values(Department).forEach(dept => {
        if (quarterlyData[quarter][dept]) {
          entry[dept] = (quarterlyData[quarter][dept].total / quarterlyData[quarter][dept].count).toFixed(2);
        } else {
            entry[dept] = null;
        }
      });
      return entry;
    });

    return chartData.sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="font-bold text-lg text-slate-800">Department Performance Trends</h3>
      <p className="text-sm text-slate-500 mb-4">Average rating per quarter</p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            {Object.values(Department).map(dept => (
              <Line
                key={dept}
                type="monotone"
                dataKey={dept}
                stroke={COLORS[dept] || '#8884d8'}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;
