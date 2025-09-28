import React, { useState, useMemo } from 'react';
import { PerformanceReviewCycle, Review, Employee, ReviewStatus } from '../types';
import { ChartBarIcon, PlusIcon } from '../components/Icons';

interface PerformancePageProps {
  reviewCycles: PerformanceReviewCycle[];
  reviews: Review[];
  employees: Employee[];
  onOpenReviewForm: (review: Review) => void;
}

const getStatusStyles = (status: ReviewStatus) => {
    switch (status) {
        case ReviewStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case ReviewStatus.InProgress: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case ReviewStatus.Pending: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        default: return '';
    }
};

const PerformancePage: React.FC<PerformancePageProps> = ({ reviewCycles, reviews, employees, onOpenReviewForm }) => {
    const [selectedCycleId, setSelectedCycleId] = useState<number | null>(reviewCycles.find(rc => rc.isActive)?.id || (reviewCycles.length > 0 ? reviewCycles[0].id : null));

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const reviewsForSelectedCycle = useMemo(() => {
        if (!selectedCycleId) return [];
        // Ensure every active employee has a review entry for the cycle
        const activeEmployees = employees.filter(e => e.status === 'Active');
        return activeEmployees.map(emp => {
            const existingReview = reviews.find(r => r.reviewCycleId === selectedCycleId && r.employeeId === emp.id);
            if (existingReview) {
                return existingReview;
            }
            // Create a placeholder pending review if one doesn't exist
            return {
                id: Math.random(), // Temporary ID
                reviewCycleId: selectedCycleId,
                employeeId: emp.id,
                status: ReviewStatus.Pending,
                managerFeedback: '',
                employeeSelfAssessment: '',
                finalRating: 0,
                completedAt: null,
            };
        });
    }, [selectedCycleId, reviews, employees]);

    const cycleProgress = useMemo(() => {
        const total = reviewsForSelectedCycle.length;
        if (total === 0) return 0;
        const completed = reviewsForSelectedCycle.filter(r => r.status === ReviewStatus.Completed).length;
        return Math.round((completed / total) * 100);
    }, [reviewsForSelectedCycle]);
    
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Performance Management</h1>
                    <p className="text-slate-500 dark:text-dark-text-secondary">Track and manage employee performance review cycles.</p>
                </div>
                <button 
                    // onClick={() => onOpenCycleForm()}
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
                >
                    <PlusIcon className="h-5 w-5" />
                    Start New Review Cycle
                </button>
            </div>

            {/* Cycle Selector */}
            <div className="mb-6">
                <label htmlFor="cycle-select" className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary">Select Review Cycle</label>
                <select 
                    id="cycle-select"
                    value={selectedCycleId || ''}
                    onChange={e => setSelectedCycleId(Number(e.target.value))}
                    className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-slate-300 dark:border-dark-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white dark:bg-dark-card"
                >
                    {reviewCycles.map(cycle => (
                        <option key={cycle.id} value={cycle.id}>{cycle.title}</option>
                    ))}
                </select>
            </div>

            {/* Progress and Stats */}
            {selectedCycleId && (
                <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm mb-6">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-dark-text">Cycle Progress</h2>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="w-full bg-slate-200 dark:bg-dark-bg rounded-full h-2.5">
                            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${cycleProgress}%` }}></div>
                        </div>
                        <span className="font-semibold text-brand-primary">{cycleProgress}% Complete</span>
                    </div>
                </div>
            )}
            
            {/* Reviews Table */}
            <div className="bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-dark-text-secondary">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-dark-bg-secondary dark:text-dark-text">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee</th>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Final Rating</th>
                                <th scope="col" className="px-6 py-3">Completed Date</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                           {reviewsForSelectedCycle.map(review => {
                                const employee = employeeMap.get(review.employeeId);
                                if (!employee) return null;

                                return (
                                     <tr key={review.id} className="bg-white dark:bg-dark-card border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-bg-secondary">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img className="w-10 h-10 rounded-full object-cover" src={employee.avatar} alt={employee.name} />
                                                <div>
                                                    <div className="font-semibold">{employee.name}</div>
                                                    <div className="text-xs text-slate-500">{employee.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{employee.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(review.status)}`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            {review.status === ReviewStatus.Completed ? `${review.finalRating}/5` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.completedAt ? new Date(review.completedAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onOpenReviewForm(review)} className="font-medium text-brand-primary hover:underline">
                                                {review.status === ReviewStatus.Pending ? 'Start Review' : 'View/Edit'}
                                            </button>
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

export default PerformancePage;