import React from 'react';
import { Announcement, AnnouncementCategory } from '../types';
import { MegaphoneIcon, PlusIcon, TrashIcon } from '../components/Icons';

interface AnnouncementsPageProps {
  announcements: Announcement[];
  onOpenForm: (announcement?: Announcement | null) => void;
  onDelete: (announcementId: number) => void;
}

const getCategoryStyles = (category: AnnouncementCategory) => {
    switch (category) {
        case AnnouncementCategory.CompanyNews:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case AnnouncementCategory.PolicyUpdate:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case AnnouncementCategory.Event:
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ announcements, onOpenForm, onDelete }) => {
  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Announcements</h1>
                <p className="text-slate-500 dark:text-dark-text-secondary">Keep your team informed with company news and updates.</p>
            </div>
            <button 
                onClick={() => onOpenForm()}
                className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
            >
                <PlusIcon className="h-5 w-5" />
                Create Announcement
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white dark:bg-dark-card shadow-sm rounded-lg p-6 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-dark-text">{announcement.title}</h2>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getCategoryStyles(announcement.category)}`}>
                                {announcement.category}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-dark-text-secondary mt-1">
                            Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-dark-text-secondary mt-4 whitespace-pre-wrap">
                            {announcement.content}
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-dark-border flex items-center justify-end gap-2">
                        <button 
                            onClick={() => onOpenForm(announcement)}
                            className="text-sm font-medium text-brand-primary hover:underline"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => onDelete(announcement.id)}
                            className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1"
                        >
                           <TrashIcon className="h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
        {announcements.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-dark-card rounded-lg">
                <MegaphoneIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-dark-text">No announcements</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-dark-text-secondary">Get started by creating a new announcement.</p>
            </div>
        )}
    </div>
  );
};

export default AnnouncementsPage;
