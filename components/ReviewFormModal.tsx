import React, { useState, useEffect, useRef } from 'react';
import { Review, Employee, ReviewStatus } from '../types';
import { CloseIcon, ChartBarIcon } from './Icons';

interface ReviewFormModalProps {
  review: Review;
  employee: Employee;
  onSave: (review: Review) => void;
  onClose: () => void;
}

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
        {children}
    </div>
);

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ review, employee, onSave, onClose }) => {
    const [formData, setFormData] = useState<Review>(review);
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setFormData(review);
    }, [review]);

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
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'finalRating' ? Number(value) : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // If completing the review, set the date
        const dataToSave = { ...formData };
        if (dataToSave.status === ReviewStatus.Completed && !dataToSave.completedAt) {
            dataToSave.completedAt = new Date().toISOString().split('T')[0];
        }
        if (dataToSave.status !== ReviewStatus.Completed) {
             dataToSave.completedAt = null;
        }
        onSave(dataToSave);
    };
    
    const inputStyles = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-transparent dark:border-dark-border";

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div 
                ref={modalRef}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl p-8 m-4 transform transition-all max-h-[90vh] flex flex-col" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-form-title"
            >
                <div className="flex justify-between items-start flex-shrink-0">
                    <div className="flex items-center gap-3">
                         <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-full">
                            <ChartBarIcon className="h-6 w-6 text-brand-primary dark:text-indigo-300" />
                        </div>
                        <div>
                            <h2 id="review-form-title" className="text-xl font-bold dark:text-dark-text">Performance Review</h2>
                            <p className="text-slate-500 dark:text-dark-text-secondary">For {employee.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <span className="sr-only">Close modal</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 flex-grow overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <FormField label="Employee Self-Assessment">
                            <textarea name="employeeSelfAssessment" value={formData.employeeSelfAssessment} onChange={handleChange} rows={5} className={inputStyles} />
                        </FormField>
                        <FormField label="Manager's Feedback">
                            <textarea ref={firstInputRef} name="managerFeedback" value={formData.managerFeedback} onChange={handleChange} rows={5} className={inputStyles} />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-dark-border">
                             <FormField label="Final Rating (1-5)">
                                <input type="number" name="finalRating" value={formData.finalRating || ''} onChange={handleChange} min="1" max="5" className={inputStyles} />
                            </FormField>
                            <FormField label="Review Status">
                                <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                    {Object.values(ReviewStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FormField>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                           Save Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewFormModal;