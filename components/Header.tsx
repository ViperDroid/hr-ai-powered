import React from 'react';
import { SearchIcon, MenuIcon } from './Icons';
import NotificationBell from './NotificationBell';
import { Notification } from '../types';

interface HeaderProps {
    pageTitle: string;
    notifications: Notification[];
    searchQuery: string;
    onSearch: (query: string) => void;
    onToggleMobileSidebar: () => void;
    onMarkAllAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, notifications, searchQuery, onSearch, onToggleMobileSidebar, onMarkAllAsRead }) => {
  return (
    <header className="bg-white dark:bg-dark-card shadow-sm dark:shadow-none dark:border-b dark:border-dark-border p-4 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleMobileSidebar} className="p-1.5 rounded-md text-slate-500 dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-secondary lg:hidden">
            <span className="sr-only">Toggle Sidebar</span>
            <MenuIcon className="h-6 w-6"/>
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-text hidden sm:block">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-transparent dark:border-dark-border dark:focus:ring-brand-primary"
            aria-label="Search employees"
          />
        </div>
        <NotificationBell notifications={notifications} onMarkAllAsRead={onMarkAllAsRead} />
        <div className="flex items-center gap-2">
            <img 
                src="https://picsum.photos/seed/hradmin/200" 
                alt="Admin" 
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="hidden md:block">
                <p className="font-semibold text-sm text-slate-700 dark:text-dark-text whitespace-nowrap">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-dark-text-secondary">HR Manager</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;