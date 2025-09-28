import React, { useState, useMemo } from 'react';
import { Notification } from '../types';
import { BellIcon } from './Icons';

interface NotificationBellProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
}

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAllAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const iconType = (type: Notification['type']) => {
        switch(type) {
            case 'alert': return 'bg-red-500';
            case 'update': return 'bg-blue-500';
            case 'message': return 'bg-green-500';
            default: return 'bg-slate-500';
        }
    }

    const handleMarkAllRead = () => {
        onMarkAllAsRead();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:text-dark-text-secondary dark:hover:bg-dark-bg-secondary"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div 
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-card dark:ring-dark-border"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="p-2">
                        <div className="flex justify-between items-center px-2 py-1">
                            <h3 className="font-semibold text-sm dark:text-dark-text">Notifications</h3>
                            <button 
                                onClick={handleMarkAllRead} 
                                className="text-xs text-brand-primary font-medium hover:underline"
                            >
                                Mark all as read
                            </button>
                        </div>
                        <div className="mt-1 max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(notification => (
                                <div key={notification.id} className="p-2 hover:bg-slate-50 dark:hover:bg-dark-bg-secondary rounded-md">
                                    <div className="flex gap-3 items-start">
                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${iconType(notification.type)} ${notification.read && 'opacity-30'}`}></div>
                                        <div>
                                            <p className={`text-sm font-medium ${notification.read ? 'text-slate-500 dark:text-dark-text-secondary' : 'text-slate-800 dark:text-dark-text'}`}>{notification.title}</p>
                                            <p className={`text-xs ${notification.read ? 'text-slate-400 dark:text-dark-text-secondary' : 'text-slate-500 dark:text-dark-text-secondary'}`}>{notification.description}</p>
                                            <p className="text-xs text-slate-400 dark:text-dark-text-secondary mt-1">{timeSince(new Date(notification.timestamp))}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4 text-sm text-slate-500 dark:text-dark-text-secondary">
                                    No new notifications.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;