import React, { useRef, useEffect } from 'react';
import { CloseIcon, XCircleIcon, CheckCircleIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md p-8 m-4 transform transition-all" 
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h3 id="confirmation-modal-title" className="mt-3 text-lg font-semibold leading-6 text-slate-900 dark:text-dark-text">
                {title}
            </h3>
            <div className="mt-2">
                <p id="confirmation-modal-description" className="text-sm text-slate-500 dark:text-dark-text-secondary">
                    {message}
                </p>
            </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-white dark:bg-dark-bg-secondary px-3 py-2 text-sm font-semibold text-slate-900 dark:text-dark-text shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-dark-border hover:bg-slate-50 dark:hover:bg-slate-700"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
