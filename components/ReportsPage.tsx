
import React, { useState, useMemo } from 'react';
import { Employee, LeaveRequest, LeaveType } from '../types';
import AnalyticsCard from './AnalyticsCard';
import { ReportIcon, CalendarIcon, LeaveIcon } from './Icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ReportsPageProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
}

const COLORS = ['#4f46e5', '#7c3aed', '#a78bfa', '#10b981'];

const ReportsPage: React.FC<ReportsPageProps> = ({ employees, leaveRequests }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name === 'startDate' ? 'start' : 'end']: value,
      },
    }));
  };

  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter(req => {
      const reqDate = new Date(req.startDate);
      const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
      if (startDate && reqDate < startDate) return false;
      if (endDate && reqDate > endDate) return false;
      return true;
    });
  }, [leaveRequests, filters.dateRange]);

  const leaveTypeData = useMemo(() => {
    const counts = filteredLeaveRequests.reduce((acc, req) => {
      acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
      return acc;
    }, {} as Record<LeaveType, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLeaveRequests]);
  
  const monthlyLeaveData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0).map((_, i) => ({ name: monthNames[i], requests: 0 }));
    filteredLeaveRequests.forEach(req => {
        const month = new Date(req.startDate).getMonth();
        counts[month].requests++;
    });
    return counts;
  }, [filteredLeaveRequests]);

  const totalLeaveDays = useMemo(() => {
    return filteredLeaveRequests
        .filter(r => r.status === 'Approved')
        .reduce((acc, req) => {
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            return acc + Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }, 0);
  }, [filteredLeaveRequests]);

  const approvalRate = useMemo(() => {
    const total = filteredLeaveRequests.length;
    if (total === 0) return '0%';
    const approved = filteredLeaveRequests.filter(r => r.status === 'Approved').length;
    return `${((approved / total) * 100).toFixed(0)}%`;
  }, [filteredLeaveRequests]);


  const inputStyles = "bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition";

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text mb-6">Reports</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Date Range</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="date"
                        name="startDate"
                        value={filters.dateRange.start}
                        onChange={handleFilterChange}
                        className={`${inputStyles} w-full`}
                        aria-label="Start Date"
                    />
                    <span className="text-slate-500 dark:text-dark-text-secondary">to</span>
                    <input 
                        type="date"
                        name="endDate"
                        value={filters.dateRange.end}
                        onChange={handleFilterChange}
                        className={`${inputStyles} w-full`}
                        aria-label="End Date"
                    />
                </div>
            </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnalyticsCard title="Total Leave Requests" value={filteredLeaveRequests.length.toString()} change="" icon={<LeaveIcon className="h-6 w-6"/>} />
        <AnalyticsCard title="Approved Leave Days" value={totalLeaveDays.toString()} change="" icon={<CalendarIcon className="h-6 w-6"/>} />
        <AnalyticsCard title="Approval Rate" value={approvalRate} change="" icon={<ReportIcon className="h-6 w-6"/>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
           <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text">Monthly Leave Trends</h3>
           <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <BarChart data={monthlyLeaveData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#4f46e5" />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text">Leave Type Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={leaveTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportsPage;
