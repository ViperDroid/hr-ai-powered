import React, { useState, useEffect, useRef } from 'react';
import { LeaveRequest, LeaveType } from '../types';
import { CloseIcon, LeaveIcon } from './Icons';

interface LeaveRequestFormProps {
  onSave: (request: Omit<LeaveRequest, 'id' | 'employeeId' | 'employeeName' | 'employeeAvatar' | 'status'>) => void;
  onClose: () => void;
}

const defaultFormData = {
    leaveType: LeaveType.Vacation,
    startDate: '',
    endDate: '',
    reason: '',
};

const FormField: React.FC<{label: string, children: React.ReactNode, error?: string}> = ({ label, children, error }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const previousActiveElement = document.activeElement as HTMLElement;
        firstInputRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (!focusableElements) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { 
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.startDate || !formData.endDate || !formData.reason) {
            alert('Please fill out all fields.');
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
                aria-labelledby="leave-form-title"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-full">
                            <LeaveIcon className="h-6 w-6 text-brand-primary dark:text-indigo-300" />
                        </div>
                        <div>
                            <h2 id="leave-form-title" className="text-xl font-bold dark:text-dark-text">Request Time Off</h2>
                            <p className="text-slate-500 dark:text-dark-text-secondary">Submit a new leave request for approval.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <span className="sr-only">Close modal</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-4">
                        <FormField label="Leave Type">
                            <select ref={firstInputRef} name="leaveType" value={formData.leaveType} onChange={handleChange} className={inputStyles} required>
                                {Object.values(LeaveType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Start Date">
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputStyles} required />
                            </FormField>
                             <FormField label="End Date">
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputStyles} required />
                            </FormField>
                        </div>
                        <FormField label="Reason for Leave">
                            <textarea name="reason" value={formData.reason} onChange={handleChange} rows={4} className={inputStyles} placeholder="Please provide a brief reason for your request..." required />
                        </FormField>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                           Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveRequestForm;