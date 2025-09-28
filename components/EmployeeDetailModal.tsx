import React, { useRef, useEffect } from 'react';
import { Employee, Task, TaskStatus, GoalStatus, TaskPriority, Review, ReviewStatus, PerformanceReviewCycle } from '../types';
import { CloseIcon, BriefcaseIcon, CalendarIcon, DollarSignIcon, StarIcon, SmileyIcon, CalendarDaysIcon, PlusIcon, TargetIcon, ChartBarIcon } from './Icons';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  tasks: Task[];
  reviews: Review[];
  reviewCycles: PerformanceReviewCycle[];
  onClose: () => void;
  onAssignTask: (task: null, employeeId: number) => void;
  onAddGoal: (employeeId: number) => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-400 dark:text-dark-text-secondary mt-1">{icon}</div>
        <div>
            <p className="text-xs text-slate-500 dark:text-dark-text-secondary">{label}</p>
            <p className="font-semibold text-slate-700 dark:text-dark-text">{value}</p>
        </div>
    </div>
);

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, tasks, reviews, reviewCycles, onClose, onAssignTask, onAddGoal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!employee) return;

    const previousActiveElement = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [employee, onClose]);

  if (!employee) return null;

  const getTaskStatusStyles = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Completed:
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case TaskStatus.InProgress:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case TaskStatus.ToDo:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityStyles = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High: return 'text-red-500 font-bold';
      case TaskPriority.Medium: return 'text-yellow-600 dark:text-yellow-400 font-bold';
      case TaskPriority.Low: return 'text-green-500 font-bold';
      default: return 'text-slate-500 dark:text-dark-text-secondary';
    }
  };

  const priorityIndicatorColors: Record<TaskPriority, string> = {
    [TaskPriority.High]: 'bg-red-500',
    [TaskPriority.Medium]: 'bg-yellow-500',
    [TaskPriority.Low]: 'bg-green-500',
  };

  const getGoalStatusStyles = (status: GoalStatus) => {
    switch (status) {
        case GoalStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case GoalStatus.OnTrack: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case GoalStatus.AtRisk: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case GoalStatus.Paused: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        default: return '';
    }
  };

  const getReviewStatusStyles = (status: ReviewStatus) => {
    switch (status) {
        case ReviewStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case ReviewStatus.InProgress: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case ReviewStatus.Pending: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        default: return '';
    }
  };

  const reviewCycleMap = new Map(reviewCycles.map(rc => [rc.id, rc]));

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 m-4 transform transition-all max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        <div className="flex justify-between items-start flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                <img src={employee.avatar} alt={employee.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover ring-4 ring-white dark:ring-dark-card" />
                <div>
                    <h2 id="detail-modal-title" className="text-2xl font-bold text-slate-800 dark:text-dark-text">{employee.name}</h2>
                    <p className="text-slate-500 dark:text-dark-text-secondary">{employee.role}</p>
                </div>
            </div>
            <button ref={closeButtonRef} onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary flex-shrink-0">
                 <span className="sr-only">Close modal</span>
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="mt-8 overflow-y-auto pr-2 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Information */}
                <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-dark-text">Job Information</h3>
                    <div className="space-y-4">
                        <DetailItem icon={<BriefcaseIcon className="h-5 w-5"/>} label="Department" value={employee.department} />
                        <DetailItem icon={<CalendarIcon className="h-5 w-5"/>} label="Start Date" value={new Date(employee.startDate).toLocaleDateString()} />
                        <DetailItem icon={<DollarSignIcon className="h-5 w-5"/>} label="Salary" value={`$${employee.salary.toLocaleString()}`} />
                        <DetailItem icon={<CalendarDaysIcon className="h-5 w-5"/>} label="Leave Balance" value={`${employee.leaveBalance} days`} />
                    </div>
                </div>
                {/* Performance Metrics */}
                <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-dark-text">Performance Metrics</h3>
                    <div className="space-y-4">
                        <DetailItem icon={<StarIcon className="h-5 w-5"/>} label="Latest Performance Rating" value={`${employee.performanceRating} / 5`} />
                        <DetailItem icon={<SmileyIcon className="h-5 w-5"/>} label="Satisfaction Score" value={`${employee.satisfactionScore} / 10`} />
                        <DetailItem icon={<CalendarIcon className="h-5 w-5"/>} label="Last Review" value={new Date(employee.lastReviewDate).toLocaleDateString()} />
                    </div>
                </div>
            </div>

            {/* Performance History */}
            <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-lg mt-6">
                <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text flex items-center gap-2 mb-4"><ChartBarIcon className="h-5 w-5" /> Performance History</h3>
                 <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-dark-card p-3 rounded-md shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-sm text-slate-700 dark:text-dark-text">{reviewCycleMap.get(review.reviewCycleId)?.title || 'Review'}</p>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getReviewStatusStyles(review.status)}`}>{review.status}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1 text-xs text-slate-500 dark:text-dark-text-secondary">
                                <span>Completed: {review.completedAt ? new Date(review.completedAt).toLocaleDateString() : 'N/A'}</span>
                                {review.status === ReviewStatus.Completed && <span className="font-bold">Rating: {review.finalRating}/5</span>}
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-slate-500 dark:text-dark-text-secondary text-center py-4">No performance reviews found.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Assigned Tasks */}
                <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text">Assigned Tasks</h3>
                        <button onClick={() => onAssignTask(null, employee.id)} className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
                            <PlusIcon className="h-4 w-4" />
                            Assign Task
                        </button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {tasks.length > 0 ? tasks.map(task => (
                            <div key={task.id} className="bg-white dark:bg-dark-card p-3 rounded-md shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${priorityIndicatorColors[task.priority]}`} title={`Priority: ${task.priority}`}></span>
                                        <p className="font-semibold text-sm text-slate-700 dark:text-dark-text">{task.title}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTaskStatusStyles(task.status)} flex-shrink-0`}>{task.status}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                    <p className={`text-xs ${getPriorityStyles(task.priority)}`}>{task.priority}</p>
                                </div>
                                {task.status === TaskStatus.InProgress && (
                                    <div className="mt-2 w-full bg-yellow-100 dark:bg-yellow-900/50 rounded-full h-1.5">
                                        <div className="bg-yellow-400 dark:bg-yellow-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 dark:text-dark-text-secondary text-center py-4">No tasks assigned.</p>
                        )}
                    </div>
                </div>
                 {/* Goals */}
                <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text flex items-center gap-2"><TargetIcon className="h-5 w-5" /> Goals</h3>
                        <button onClick={() => onAddGoal(employee.id)} className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
                            <PlusIcon className="h-4 w-4" />
                            Add Goal
                        </button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {employee.goals.length > 0 ? employee.goals.map(goal => (
                            <div key={goal.id} className="bg-white dark:bg-dark-card p-3 rounded-md shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-sm text-slate-700 dark:text-dark-text">{goal.title}</p>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getGoalStatusStyles(goal.status)}`}>{goal.status}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-dark-text-secondary mt-1">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 dark:text-dark-text-secondary text-center py-4">No goals set.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;