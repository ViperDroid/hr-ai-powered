
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Employee, Department } from '../types';

interface DepartmentDistributionChartProps {
  employees: Employee[];
}

const COLORS = ['#4f46e5', '#7c3aed', '#a78bfa', '#10b981', '#f59e0b', '#3b82f6'];

const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({ employees }) => {
  const data = useMemo(() => {
    const departmentCounts = employees.reduce((acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1;
      return acc;
    }, {} as Record<Department, number>);

    return Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg text-slate-800">Department Distribution</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentDistributionChart;
