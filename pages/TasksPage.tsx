import React, { useState, useMemo, useEffect } from 'react';
import { Task, Employee, TaskStatus, TaskPriority } from '../types';
import { ClipboardListIcon, PlusIcon, FilterIcon, TrashIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '../components/Icons';

interface TasksPageProps {
  tasks: Task[];
  employees: Employee[];
  onOpenTaskForm: (task?: Task | null, employeeId?: number | null) => void;
  onBulkUpdateStatus: (taskIds: number[], status: TaskStatus) => void;
  onBulkDelete: (taskIds: number[]) => void;
}

const getStatusStyles = (status: TaskStatus) => {
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
      case TaskPriority.High: return 'text-red-500';
      case TaskPriority.Medium: return 'text-yellow-500';
      case TaskPriority.Low: return 'text-green-500';
      default: return '';
    }
};

const priorityIndicatorColors: Record<TaskPriority, string> = {
    [TaskPriority.High]: 'bg-red-500',
    [TaskPriority.Medium]: 'bg-yellow-500',
    [TaskPriority.Low]: 'bg-green-500',
};

const TasksPage: React.FC<TasksPageProps> = ({ tasks, employees, onOpenTaskForm, onBulkUpdateStatus, onBulkDelete }) => {
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
    const [assigneeFilter, setAssigneeFilter] = useState<number | 'all'>('all');
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
    const [sortConfig, setSortConfig] = useState<{ key: keyof Task | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });


    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesAssignee = assigneeFilter === 'all' || task.assignedToId === assigneeFilter;
            return matchesStatus && matchesPriority && matchesAssignee;
        });

        if (sortConfig.key) {
            const priorityOrder: Record<TaskPriority, number> = {
                [TaskPriority.High]: 3,
                [TaskPriority.Medium]: 2,
                [TaskPriority.Low]: 1,
            };

            filtered.sort((a, b) => {
                let valA: any;
                let valB: any;

                if (sortConfig.key === 'priority') {
                    valA = priorityOrder[a.priority];
                    valB = priorityOrder[b.priority];
                } else {
                    valA = a[sortConfig.key!];
                    valB = b[sortConfig.key!];
                }
                
                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [tasks, statusFilter, priorityFilter, assigneeFilter, sortConfig]);

    // Clear selection when filters change
    useEffect(() => {
        setSelectedTaskIds(new Set());
    }, [statusFilter, priorityFilter, assigneeFilter]);

    const handleSort = (key: keyof Task) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key && prevConfig.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            if (prevConfig.key === key && prevConfig.direction === 'desc') {
                return { key: null, direction: 'asc' }; // Reset sort
            }
            return { key, direction: 'asc' };
        });
    };


    const handleSelectTask = (taskId: number, checked: boolean) => {
        const newSelection = new Set(selectedTaskIds);
        if (checked) {
            newSelection.add(taskId);
        } else {
            newSelection.delete(taskId);
        }
        setSelectedTaskIds(newSelection);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allVisibleIds = new Set(filteredAndSortedTasks.map(t => t.id));
            setSelectedTaskIds(allVisibleIds);
        } else {
            setSelectedTaskIds(new Set());
        }
    };
    
    const handleBulkCompleteClick = () => {
        onBulkUpdateStatus(Array.from(selectedTaskIds), TaskStatus.Completed);
        setSelectedTaskIds(new Set());
    };

    const handleBulkDeleteClick = () => {
        onBulkDelete(Array.from(selectedTaskIds));
        setSelectedTaskIds(new Set());
    };
    
    const SortableHeader = ({ columnKey, title }: { columnKey: keyof Task; title: string }) => {
        const isSorted = sortConfig.key === columnKey;
        const icon = isSorted ? (
            sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
        ) : (
            <ArrowsUpDownIcon className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        );

        return (
            <th scope="col" className="px-6 py-3">
                <button className="flex items-center gap-1 group" onClick={() => handleSort(columnKey)}>
                    <span>{title}</span>
                    {icon}
                </button>
            </th>
        );
    };

    const selectStyles = "bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition";
    const checkboxStyles = "h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary";

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Task Management</h1>
                    <p className="text-slate-500 dark:text-dark-text-secondary">Assign and track tasks across the organization.</p>
                </div>
                <button 
                    onClick={() => onOpenTaskForm()}
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
                >
                    <PlusIcon className="h-5 w-5" />
                    Assign New Task
                </button>
            </div>
            
            {/* Bulk Actions Bar / Filters */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm my-6">
                {selectedTaskIds.size > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <p className="font-semibold text-sm text-brand-primary">{selectedTaskIds.size} task(s) selected</p>
                        <div className="flex items-center gap-2">
                             <button onClick={handleBulkCompleteClick} className="text-sm font-semibold text-green-600 hover:text-green-800 dark:hover:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1.5 rounded-md">
                                Mark as Completed
                            </button>
                            <button onClick={handleBulkDeleteClick} className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800 dark:hover:text-red-400 bg-red-100 dark:bg-red-900/50 px-3 py-1.5 rounded-md">
                                <TrashIcon className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                        <button onClick={() => setSelectedTaskIds(new Set())} className="text-sm text-brand-primary font-semibold hover:underline ml-auto">
                            Clear Selection
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FilterIcon className="h-5 w-5 text-slate-500 dark:text-dark-text-secondary" />
                            <p className="font-semibold text-sm">Filters:</p>
                        </div>
                        <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectStyles} aria-label="Filter by assignee">
                            <option value="all">All Assignees</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as TaskStatus | 'all')} className={selectStyles} aria-label="Filter by status">
                            <option value="all">All Statuses</option>
                            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as TaskPriority | 'all')} className={selectStyles} aria-label="Filter by priority">
                            <option value="all">All Priorities</option>
                            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setAssigneeFilter('all'); }} className="text-sm text-brand-primary font-semibold hover:underline ml-auto">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Task Table */}
            <div className="bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-dark-text-secondary">
                         <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-dark-bg-secondary dark:text-dark-text">
                            <tr>
                                <th scope="col" className="p-4">
                                    <input 
                                        type="checkbox" 
                                        className={checkboxStyles} 
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        checked={filteredAndSortedTasks.length > 0 && selectedTaskIds.size === filteredAndSortedTasks.length}
                                        aria-label="Select all tasks"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3">Task</th>
                                <th scope="col" className="px-6 py-3">Assigned To</th>
                                <SortableHeader columnKey="dueDate" title="Due Date" />
                                <SortableHeader columnKey="priority" title="Priority" />
                                <SortableHeader columnKey="status" title="Status" />
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedTasks.map(task => {
                                const assignee = employeeMap.get(task.assignedToId);
                                const isSelected = selectedTaskIds.has(task.id);
                                return (
                                    <tr key={task.id} className={`border-b dark:border-dark-border ${isSelected ? 'bg-brand-light/50 dark:bg-brand-primary/10' : 'bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-bg-secondary'}`}>
                                        <td className="p-4">
                                            <input 
                                                type="checkbox" 
                                                className={checkboxStyles} 
                                                checked={isSelected}
                                                onChange={(e) => handleSelectTask(task.id, e.target.checked)}
                                                aria-label={`Select task ${task.title}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <span className={`h-2.5 w-2.5 rounded-full ${priorityIndicatorColors[task.priority]}`} title={`Priority: ${task.priority}`}></span>
                                                <span>{task.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {assignee ? (
                                                <div className="flex items-center gap-3">
                                                    <img className="w-8 h-8 rounded-full object-cover" src={assignee.avatar} alt={assignee.name} />
                                                    <span>{assignee.name}</span>
                                                </div>
                                            ) : 'Unassigned'}
                                        </td>
                                        <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td className={`px-6 py-4 font-semibold ${getPriorityStyles(task.priority)}`}>{task.priority}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onOpenTaskForm(task)} className="font-medium text-brand-primary hover:underline">Edit</button>
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

export default TasksPage;