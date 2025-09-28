import React from 'react';
import { Employee } from '../types';
import AnalyticsCard from '../components/AnalyticsCard';
import DepartmentDistributionChart from '../components/DepartmentDistributionChart';
import PerformanceTrendChart from '../components/PerformanceTrendChart';
import { UserGroupIcon, EmployeeIcon, ReportIcon, ClockIcon } from '../components/Icons';
import AnalyticsCardSkeleton from '../components/AnalyticsCardSkeleton';
import ChartSkeleton from '../components/ChartSkeleton';

interface DashboardPageProps {
    employees: Employee[];
    onNavigate: (page: string) => void;
    isLoading: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ employees, onNavigate, isLoading }) => {
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const averageTenure = React.useMemo(() => {
        if (employees.length === 0) return '0.0';
        const totalMonths = employees.reduce((acc, emp) => {
            const startDate = new Date(emp.startDate);
            const today = new Date();
            const months = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
            return acc + (months > 0 ? months : 0);
        }, 0);
        const avgMonths = totalMonths / employees.length;
        return (avgMonths / 12).toFixed(1);
    }, [employees]);

    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-dark-text">Welcome back, Admin!</h2>
                <p className="text-slate-500 dark:text-dark-text-secondary">Here's a snapshot of your workforce analytics today.</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <>
                        <AnalyticsCardSkeleton />
                        <AnalyticsCardSkeleton />
                        <AnalyticsCardSkeleton />
                        <AnalyticsCardSkeleton />
                    </>
                ) : (
                    <>
                        <AnalyticsCard title="Total Employees" value={employees.length.toString()} change="+2 this month" icon={<UserGroupIcon className="h-6 w-6"/>} />
                        <AnalyticsCard title="Active Employees" value={activeEmployees.toString()} change="-1 this month" icon={<EmployeeIcon className="h-6 w-6"/>} />
                        <AnalyticsCard title="Attrition Rate" value="2.1%" change="+0.5% vs last month" icon={<ReportIcon className="h-6 w-6"/>} />
                        <AnalyticsCard title="Average Tenure" value={`${averageTenure} years`} change="+0.1 vs last year" icon={<ClockIcon className="h-6 w-6"/>} />
                    </>
                )}
            </div>

            {/* Charts */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    {isLoading ? <ChartSkeleton /> : <PerformanceTrendChart employees={employees} />}
                </div>
                <div className="lg:col-span-2">
                     {isLoading ? <ChartSkeleton /> : <DepartmentDistributionChart employees={employees} />}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-dark-text mb-2">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                        onClick={() => onNavigate('Employees')}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text font-semibold px-4 py-2 rounded-lg border border-slate-300 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <UserGroupIcon className="h-5 w-5" />
                        Manage Employees
                    </button>
                    <button 
                        onClick={() => onNavigate('Reports')}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text font-semibold px-4 py-2 rounded-lg border border-slate-300 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <ReportIcon className="h-5 w-5" />
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;