import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Task, Employee, TaskStatus, TaskPriority } from '../types';
import { CloseIcon, ClipboardListIcon, ChevronDownIcon, SearchIcon } from './Icons';

interface TaskFormModalProps {
  task: Task | null;
  employees: Employee[];
  preselectedEmployeeId?: number | null;
  onSave: (task: Omit<Task, 'id' | 'status'> & { id?: number; status: TaskStatus; }) => void;
  onClose: () => void;
}

const defaultFormData: Omit<Task, 'id'> = {
    title: '',
    description: '',
    assignedToId: 0,
    assignedById: 4, // Default to Admin User (Diana Prince)
    dueDate: new Date().toISOString().split('T')[0],
    status: TaskStatus.ToDo,
    priority: TaskPriority.Medium,
};

// Custom Employee Select Dropdown
const EmployeeSelect: React.FC<{
    employees: Employee[];
    selectedId: number;
    onSelect: (id: number) => void;
    label: string;
}> = ({ employees, selectedId, onSelect, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedEmployee = useMemo(() => employees.find(e => e.id === selectedId), [employees, selectedId]);

    const filteredEmployees = useMemo(() => 
        employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [employees, searchTerm]
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: number) => {
        onSelect(id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
            <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg bg-transparent dark:border-dark-border text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {selectedEmployee ? (
                    <div className="flex items-center gap-2">
                        <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-medium">{selectedEmployee.name}</span>
                    </div>
                ) : (
                    <span className="text-sm text-slate-500">Select Employee</span>
                )}
                <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-lg shadow-lg">
                    <div className="p-2">
                        <div className="relative">
                             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 dark:border-dark-border rounded-md text-sm"
                            />
                        </div>
                    </div>
                    <ul className="max-h-48 overflow-y-auto p-1" tabIndex={-1} role="listbox">
                        {filteredEmployees.map(employee => (
                            <li
                                key={employee.id}
                                className="flex items-center gap-2 p-2 text-sm rounded-md hover:bg-brand-light dark:hover:bg-brand-primary/20 cursor-pointer"
                                onClick={() => handleSelect(employee.id)}
                                role="option"
                                aria-selected={selectedId === employee.id}
                            >
                                <img src={employee.avatar} alt={employee.name} className="w-6 h-6 rounded-full" />
                                <span>{employee.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const FormField: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
        {children}
    </div>
);

const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, employees, preselectedEmployeeId, onSave, onClose }) => {
    const [formData, setFormData] = useState(defaultFormData as Omit<Task, 'id' | 'status'> & { id?: number; status: TaskStatus });
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = task !== null;

    useEffect(() => {
        if (isEditMode) {
            setFormData(task);
        } else {
            const initialAssignee = preselectedEmployeeId || (employees.length > 0 ? employees[0].id : 0);
            setFormData({ ...defaultFormData, assignedToId: initialAssignee, status: TaskStatus.ToDo });
        }
    }, [task, isEditMode, preselectedEmployeeId, employees]);

    useEffect(() => {
        const previousActiveElement = document.activeElement as HTMLElement;
        firstInputRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.assignedToId || !formData.dueDate) {
            alert('Please fill out all required fields.');
            return;
        }
        onSave(formData);
    };
    
    const inputStyles = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-transparent dark:border-dark-border";

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div 
                ref={modalRef}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4 transform transition-all" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-form-title"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-full">
                            <ClipboardListIcon className="h-6 w-6 text-brand-primary dark:text-indigo-300" />
                        </div>
                        <div>
                            <h2 id="task-form-title" className="text-xl font-bold dark:text-dark-text">{isEditMode ? 'Edit Task' : 'Assign New Task'}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <span className="sr-only">Close modal</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-4">
                        <FormField label="Task Title">
                            <input ref={firstInputRef} type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyles} required />
                        </FormField>
                        <FormField label="Description">
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyles} />
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EmployeeSelect
                                label="Assign To"
                                employees={employees}
                                selectedId={formData.assignedToId}
                                onSelect={(id) => setFormData(prev => ({...prev, assignedToId: id}))}
                            />
                             <EmployeeSelect
                                label="Assigned By"
                                employees={employees}
                                selectedId={formData.assignedById}
                                onSelect={(id) => setFormData(prev => ({...prev, assignedById: id}))}
                            />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField label="Due Date">
                                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className={inputStyles} required />
                            </FormField>
                            <FormField label="Priority">
                               <select name="priority" value={formData.priority} onChange={handleChange} className={inputStyles}>
                                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                               </select>
                            </FormField>
                             <FormField label="Status">
                                <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FormField>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                           {isEditMode ? 'Save Changes' : 'Assign Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;