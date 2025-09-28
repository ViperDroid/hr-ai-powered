import React, { useState, useEffect, useRef } from 'react';
import { Goal, GoalStatus } from '../types';
import { CloseIcon, TargetIcon } from './Icons';

interface GoalFormModalProps {
  goal: Goal | null;
  onSave: (goal: Omit<Goal, 'id'> & { id?: number }) => void;
  onClose: () => void;
}

const defaultFormData: Omit<Goal, 'id'> = {
    title: '',
    description: '',
    targetDate: new Date().toISOString().split('T')[0],
    status: GoalStatus.OnTrack,
};

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
        {children}
    </div>
);

const GoalFormModal: React.FC<GoalFormModalProps> = ({ goal, onSave, onClose }) => {
    const [formData, setFormData] = useState(defaultFormData as Omit<Goal, 'id'> & { id?: number });
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = goal !== null;

    useEffect(() => {
        if (isEditMode) {
            setFormData(goal);
        } else {
            setFormData(defaultFormData);
        }
    }, [goal, isEditMode]);

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
        if (!formData.title || !formData.targetDate) {
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
                aria-labelledby="goal-form-title"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-full">
                            <TargetIcon className="h-6 w-6 text-brand-primary dark:text-indigo-300" />
                        </div>
                        <div>
                            <h2 id="goal-form-title" className="text-xl font-bold dark:text-dark-text">{isEditMode ? 'Edit Goal' : 'Set New Goal'}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <span className="sr-only">Close modal</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-4">
                        <FormField label="Goal Title">
                            <input ref={firstInputRef} type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyles} required />
                        </FormField>
                        <FormField label="Description">
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyles} />
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Target Date">
                                <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} className={inputStyles} required />
                            </FormField>
                             <FormField label="Status">
                                <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                    {Object.values(GoalStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FormField>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                           {isEditMode ? 'Save Changes' : 'Set Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoalFormModal;
