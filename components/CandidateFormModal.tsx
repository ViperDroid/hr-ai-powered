import React, { useState, useEffect, useRef } from 'react';
import { Candidate, CandidateStage } from '../types';
import { CloseIcon, UserGroupIcon } from './Icons';

interface CandidateFormModalProps {
  candidate: Candidate | null;
  jobOpeningId: number;
  onSave: (candidate: Omit<Candidate, 'id' | 'jobOpeningId' | 'appliedDate' | 'resumeUrl'> & { id?: number }) => void;
  onClose: () => void;
}

const defaultFormData: Omit<Candidate, 'id' | 'jobOpeningId' | 'appliedDate' | 'resumeUrl'> = {
    name: '',
    email: '',
    phone: '',
    stage: CandidateStage.Applied,
};

const FormField: React.FC<{label: string, children: React.ReactNode, error?: string}> = ({ label, children, error }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">{label}</label>
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const CandidateFormModal: React.FC<CandidateFormModalProps> = ({ candidate, jobOpeningId, onSave, onClose }) => {
    const [formData, setFormData] = useState(defaultFormData as Omit<Candidate, 'id' | 'jobOpeningId' | 'appliedDate' | 'resumeUrl'> & { id?: number });
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = candidate !== null;

    useEffect(() => {
        if (isEditMode) {
            setFormData(candidate);
        } else {
            setFormData(defaultFormData);
        }
    }, [candidate, isEditMode]);

    useEffect(() => {
        const previousActiveElement = document.activeElement as HTMLElement;
        firstInputRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert('Please enter at least a name and email.');
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
                aria-labelledby="candidate-form-title"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className="bg-brand-light dark:bg-brand-primary/20 p-2 rounded-full">
                            <UserGroupIcon className="h-6 w-6 text-brand-primary dark:text-indigo-300" />
                        </div>
                        <div>
                            <h2 id="candidate-form-title" className="text-xl font-bold dark:text-dark-text">{isEditMode ? 'Edit Candidate' : 'Add New Candidate'}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <span className="sr-only">Close modal</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-4">
                        <FormField label="Full Name">
                            <input ref={firstInputRef} type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Email Address">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyles} required />
                            </FormField>
                            <FormField label="Phone Number">
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyles} />
                            </FormField>
                        </div>
                        <FormField label="Hiring Stage">
                            <select name="stage" value={formData.stage} onChange={handleChange} className={inputStyles}>
                                {Object.values(CandidateStage).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </FormField>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-slate-600">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                           {isEditMode ? 'Save Changes' : 'Add Candidate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidateFormModal;