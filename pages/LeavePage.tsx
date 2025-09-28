import React from 'react';
import { LeaveRequest, Employee } from '../types';
import { LeaveIcon, PlusIcon } from '../components/Icons';

interface LeavePageProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onRequestLeave: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const getStatusStyles = (status: LeaveRequest['status']) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  }
};

const calculateDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
    return diffDays;
};

const LeavePage: React.FC<LeavePageProps> = ({ employees, leaveRequests, onRequestLeave, onApprove, onReject }) => {
  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Leave Management</h1>
                <p className="text-slate-500 dark:text-dark-text-secondary">Track and manage employee time-off requests.</p>
            </div>
            <button 
                onClick={onRequestLeave}
                className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
            >
                <PlusIcon className="h-5 w-5" />
                Request Leave
            </button>
        </div>
        
        <div className="bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-dark-text-secondary">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-dark-bg-secondary dark:text-dark-text">
                        <tr>
                            <th scope="col" className="px-6 py-3">Employee</th>
                            <th scope="col" className="px-6 py-3">Leave Type</th>
                            <th scope="col" className="px-6 py-3">Dates</th>
                            <th scope="col" className="px-6 py-3">Days</th>
                            <th scope="col" className="px-6 py-3">Leave Balance</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map((request) => {
                            const employee = employees.find(e => e.id === request.employeeId);
                            const balance = employee ? `${employee.leaveBalance} days` : 'N/A';
                            return (
                                <tr key={request.id} className="bg-white dark:bg-dark-card border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-bg-secondary">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-full object-cover" src={request.employeeAvatar} alt={request.employeeName} />
                                            <div>
                                                <div className="font-semibold">{request.employeeName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{request.leaveType}</td>
                                    <td className="px-6 py-4">
                                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {calculateDays(request.startDate, request.endDate)}
                                    </td>
                                    <td className="px-6 py-4">{balance}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {request.status === 'Pending' ? (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onApprove(request.id)} className="font-medium text-green-600 hover:underline">Approve</button>
                                                <button onClick={() => onReject(request.id)} className="font-medium text-red-600 hover:underline">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default LeavePage;