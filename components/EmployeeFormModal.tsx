import React, { useState, useEffect, useRef } from 'react';
import { Employee, Department, EmployeeStatus } from '../types';
import { CloseIcon, EmployeeIcon } from './Icons';

interface EmployeeFormModalProps {
  employee: Employee | null; // null for "add" mode
  onSave: (employee: Partial<Employee>) => void;
  onClose: () => void;
}

const defaultFormData = {
    name: '',
    email: '',
    avatar: '',
    role: '',
    department: Department.Engineering,
    salary: '',
    status: EmployeeStatus.Active,
    startDate: new Date().toISOString().split('T')[0],
};

const FormField: React.FC<{label: string, children: React.ReactNode, error?: string}> = ({ label, children, error }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employee, onSave, onClose }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState({ email: '', salary: '' });
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = employee !== null;
    
    useEffect(() => {
        if (formData.avatar && (formData.avatar.startsWith('http://') || formData.avatar.startsWith('https://'))) {
            setAvatarPreviewUrl(formData.avatar);
        } else {
            setAvatarPreviewUrl(null);
        }
    }, [formData.avatar]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: employee.name,
                email: employee.email,
                avatar: employee.avatar,
                role: employee.role,
                department: employee.department,
                salary: String(employee.salary),
                status: employee.status,
                startDate: employee.startDate,
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [employee, isEditMode]);
    
    useEffect(() => {
        const previousActiveElement = document.activeElement as HTMLElement;
        firstInputRef.current?.focus();

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
    }, [onClose]);

    const validate = () => {
        const newErrors = { email: '', salary: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        const salaryNum = parseInt(formData.salary, 10);
        if (isNaN(salaryNum) || salaryNum <= 0) {
            newErrors.salary = 'Salary must be a positive number.';
        }
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors on change
        if (errors.email && name === 'email') setErrors(e => ({ ...e, email: ''}));
        if (errors.salary && name === 'salary') setErrors(e => ({ ...e, salary: ''}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (validationErrors.email || validationErrors.salary) {
            setErrors(validationErrors);
            return;
        }
        const dataToSave = {
            ...formData,
            salary: parseInt(formData.salary, 10),
        };
        onSave(isEditMode ? { ...dataToSave, id: employee.id } : dataToSave);
    };
    
    const inputStyles = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-transparent dark:border-dark-border";
    const errorInputStyles = "border-red-500 focus:ring-red-500";
    
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div 
                ref={modalRef}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4 transform transition-all" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="form-modal-title"
                aria-describedby="form-modal-description"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-full">
                            <EmployeeIcon className="h-6 w-6 text-brand-primary dark:text-indigo-300" />
                        </div>
                        <div>
                            <h2 id="form-modal-title" className="text-xl font-bold dark:text-dark-text">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <p id="form-modal-description" className="text-slate-500 dark:text-dark-text-secondary">Enter the employee's details below.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <span className="sr-only">Close modal</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Full Name">
                            <input ref={firstInputRef} type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
                        </FormField>
                        <FormField label="Email Address" error={errors.email}>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`${inputStyles} ${errors.email && errorInputStyles}`} required />
                        </FormField>
                         <FormField label="Role / Job Title">
                            <input type="text" name="role" value={formData.role} onChange={handleChange} className={inputStyles} required />
                        </FormField>
                         <FormField label="Department">
                            <select name="department" value={formData.department} onChange={handleChange} className={inputStyles}>
                                {Object.values(Department).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Salary" error={errors.salary}>
                            <input type="number" name="salary" value={formData.salary} onChange={handleChange} className={`${inputStyles} ${errors.salary && errorInputStyles}`} required />
                        </FormField>
                        <FormField label="Employee Status">
                             <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                {Object.values(EmployeeStatus).map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Start Date">
                             <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputStyles} required />
                        </FormField>
                        <FormField label="Avatar URL">
                            <div className="flex items-center gap-3">
                                 <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className={inputStyles} placeholder="https://..." />
                                 <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-dark-bg-secondary flex items-center justify-center flex-shrink-0">
                                    {avatarPreviewUrl ? (
                                        <img 
                                            src={avatarPreviewUrl} 
                                            alt="Avatar Preview" 
                                            className="w-full h-full rounded-full object-cover"
                                            onError={() => setAvatarPreviewUrl(null)}
                                        />
                                    ) : (
                                        <EmployeeIcon className="h-6 w-6 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        </FormField>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                            {isEditMode ? 'Save Changes' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeFormModal;