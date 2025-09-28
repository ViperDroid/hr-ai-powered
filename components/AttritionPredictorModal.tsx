

import React, { useState, useEffect, useRef } from 'react';
import { Employee, AttritionPrediction, AttritionRisk } from '../types';
import { predictAttrition } from '../services/geminiService';
import { BrainIcon, CloseIcon } from './Icons';

interface AttritionPredictorModalProps {
  employee: Employee | null;
  onClose: () => void;
}

const AttritionPredictorModal: React.FC<AttritionPredictorModalProps> = ({ employee, onClose }) => {
  const [prediction, setPrediction] = useState<AttritionPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (employee) {
      setIsLoading(true);
      setPrediction(null);
      
      const fetchPrediction = async () => {
        const result = await predictAttrition(employee);
        setPrediction(result);
        setIsLoading(false);
      };
      
      fetchPrediction();
    }
  }, [employee]);

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

  const riskColorMap: { [key in AttritionRisk]: string } = {
    [AttritionRisk.Low]: 'bg-risk-low/10 text-risk-low border-risk-low',
    [AttritionRisk.Medium]: 'bg-risk-medium/10 text-risk-medium border-risk-medium',
    [AttritionRisk.High]: 'bg-risk-high/10 text-risk-high border-risk-high',
  };

  const riskBgColorMap: { [key in AttritionRisk]: string } = {
    [AttritionRisk.Low]: 'bg-risk-low',
    [AttritionRisk.Medium]: 'bg-risk-medium',
    [AttritionRisk.High]: 'bg-risk-high',
  };
  
  const renderLoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded-md w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-md w-5/6 mb-6"></div>
        <div className="h-6 bg-slate-200 rounded-md w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-md w-2/3 mb-2"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4 transform transition-all" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attrition-modal-title"
        aria-describedby="attrition-modal-description"
      >
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="bg-brand-light p-2 rounded-full">
                    <BrainIcon className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                    <h2 id="attrition-modal-title" className="text-xl font-bold">AI Attrition Analysis</h2>
                    <p id="attrition-modal-description" className="text-slate-500">For {employee.name}</p>
                </div>
            </div>
            <button ref={closeButtonRef} onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <span className="sr-only">Close modal</span>
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="mt-6">
            {isLoading && renderLoadingSkeleton()}
            {prediction && !isLoading && (
                 <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${riskColorMap[prediction.risk]}`}>
                        <span className={`h-2 w-2 rounded-full ${riskBgColorMap[prediction.risk]}`}></span>
                        Risk Level: {prediction.risk}
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-slate-800">Reasoning</h3>
                        <p className="text-slate-600 mt-1 text-sm">{prediction.reason}</p>
                    </div>

                     <div className="mt-6">
                        <h3 className="font-semibold text-slate-800">Recommendations</h3>
                        <ul className="text-slate-600 mt-1 text-sm list-disc list-inside space-y-1">
                            {prediction.recommendations.split('\n').filter(r => r.trim().length > 0).map((rec, index) => (
                                <li key={index}>{rec.replace(/^- /, '')}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AttritionPredictorModal;