import React from 'react';
import { DashboardIcon, EmployeeIcon, ReportIcon, SettingsIcon, BrainIcon, LeaveIcon, XIcon, ChevronDoubleLeftIcon, ClipboardListIcon, MegaphoneIcon, BriefcaseIcon, ChartBarIcon } from './Icons';

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
    const navItems = [
        { name: 'Dashboard', icon: DashboardIcon },
        { name: 'Employees', icon: EmployeeIcon },
        { name: 'Recruitment', icon: BriefcaseIcon },
        { name: 'Performance', icon: ChartBarIcon },
        { name: 'Tasks', icon: ClipboardListIcon },
        { name: 'Announcements', icon: MegaphoneIcon },
        { name: 'Reports', icon: ReportIcon },
        { name: 'Leave Management', icon: LeaveIcon },
        { name: 'Settings', icon: SettingsIcon },
    ];

    const handleNavigate = (page: string) => {
        onNavigate(page);
        setIsMobileOpen(false); // Close mobile sidebar on navigation
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
              className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setIsMobileOpen(false)}
            />

            <aside className={`fixed lg:relative inset-y-0 left-0 z-40 h-full bg-white dark:bg-dark-card flex flex-col border-r border-slate-200 dark:border-dark-border transition-transform lg:transition-[width] duration-300 ease-in-out w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
                <div className={`flex items-center p-4 h-[65px] border-b border-slate-200 dark:border-dark-border flex-shrink-0 ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}>
                    <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed && 'lg:hidden'}`}>
                        <BrainIcon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                        <h1 className="text-xl font-bold text-slate-800 dark:text-dark-text whitespace-nowrap">HR Nexus</h1>
                    </div>
                     <button onClick={() => setIsMobileOpen(false)} className={`p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-bg-secondary lg:hidden ${!isCollapsed && 'hidden'}`}>
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-6 w-6"/>
                    </button>
                    {isCollapsed && <BrainIcon className="h-8 w-8 text-brand-primary flex-shrink-0 hidden lg:block"/>}
                </div>
                
                <nav className="flex-1 px-2 lg:px-4 py-2 overflow-y-auto">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <button 
                                    onClick={() => handleNavigate(item.name)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                                        activePage === item.name 
                                        ? 'bg-brand-light dark:bg-brand-primary/20 text-brand-primary dark:text-indigo-300 font-semibold' 
                                        : 'text-slate-600 dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-secondary'
                                    } ${isCollapsed && 'lg:justify-center'}`}
                                    aria-current={activePage === item.name ? 'page' : undefined}
                                    title={isCollapsed ? item.name : ''}
                                >
                                    <item.icon className="h-6 w-6 flex-shrink-0" />
                                    <span className={`whitespace-nowrap ${isCollapsed && 'lg:hidden'}`}>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                <div className={`p-4 border-t border-slate-200 dark:border-dark-border`}>
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)} 
                        className="w-full hidden lg:flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-bg-secondary"
                    >
                        <ChevronDoubleLeftIcon className={`h-6 w-6 flex-shrink-0 transition-transform ${isCollapsed && 'rotate-180'}`}/>
                        <span className={`whitespace-nowrap font-medium ${isCollapsed && 'lg:hidden'}`}>Collapse</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;