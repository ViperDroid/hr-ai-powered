import React, { useState } from 'react';
import { SunIcon, MoonIcon, SettingsIcon } from '../components/Icons';

type Tab = 'Profile' | 'Preferences' | 'Notifications';

interface SettingsPageProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentTheme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [profileData, setProfileData] = useState({ name: 'Admin User', email: 'admin@hrnexus.com' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);

    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    
    if (passwordData.newPassword) {
      console.log('Password changed successfully.');
    }

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileSettings 
                  profileData={profileData} 
                  passwordData={passwordData} 
                  onProfileChange={handleProfileChange} 
                  onPasswordChange={handlePasswordChange}
                  onUpdate={handleUpdateProfile}
                  successMessage={successMessage}
               />;
      case 'Preferences':
        return <PreferencesSettings currentTheme={currentTheme} onToggleTheme={onToggleTheme} />;
      case 'Notifications':
        return <NotificationSettings />;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-brand-light dark:bg-brand-primary/20 p-3 rounded-full">
            <SettingsIcon className="h-8 w-8 text-brand-primary dark:text-indigo-300" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Settings</h1>
            <p className="text-slate-500 dark:text-dark-text-secondary">Manage your profile and application preferences.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs */}
        <div className="lg:w-1/4">
          <nav className="flex flex-row lg:flex-col gap-2">
            {(['Profile', 'Preferences', 'Notifications'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab 
                  ? 'bg-brand-primary text-white' 
                  : 'text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-dark-bg-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Sub-components for each tab
const Section: React.FC<{title: string, description: string, children: React.ReactNode}> = ({title, description, children}) => (
    <div className="py-6 border-b border-slate-200 dark:border-dark-border last:border-b-0">
        <h3 className="text-lg font-bold text-slate-800 dark:text-dark-text">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-dark-text-secondary mb-4">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
)

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
        <label className="font-medium text-sm text-slate-700 dark:text-dark-text-secondary">{label}</label>
        <div className="md:col-span-2">{children}</div>
    </div>
);

const inputStyles = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-transparent dark:border-dark-border";
const buttonStyles = "px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors";

interface ProfileSettingsProps {
  profileData: { name: string; email: string };
  passwordData: { currentPassword: string; newPassword: string; confirmPassword: string };
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: (e: React.FormEvent) => void;
  successMessage: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profileData, passwordData, onProfileChange, onPasswordChange, onUpdate, successMessage }) => (
    <form onSubmit={onUpdate}>
        <Section title="Personal Information" description="Update your personal details here.">
            <FormField label="Full Name">
                <input type="text" name="name" value={profileData.name} onChange={onProfileChange} className={inputStyles} />
            </FormField>
             <FormField label="Email Address">
                <input type="email" name="email" value={profileData.email} onChange={onProfileChange} className={inputStyles} />
            </FormField>
        </Section>
        <Section title="Change Password" description="For security, choose a strong, unique password.">
            <FormField label="Current Password">
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={onPasswordChange} placeholder="••••••••" className={inputStyles} />
            </FormField>
            <FormField label="New Password">
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={onPasswordChange} placeholder="••••••••" className={inputStyles} />
            </FormField>
            <FormField label="Confirm New Password">
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={onPasswordChange} placeholder="••••••••" className={inputStyles} />
            </FormField>
        </Section>
        <div className="mt-6 flex justify-end items-center gap-4">
            {successMessage && <p className="text-sm text-green-600 animate-pulse">{successMessage}</p>}
            <button type="submit" className={buttonStyles}>Update Profile</button>
        </div>
    </form>
);

const PreferencesSettings: React.FC<Pick<SettingsPageProps, 'currentTheme' | 'onToggleTheme'>> = ({ currentTheme, onToggleTheme }) => (
    <div>
        <Section title="Appearance" description="Customize the look and feel of the application.">
             <FormField label="Theme">
                <div className="flex items-center gap-2">
                    <SunIcon className="h-6 w-6 text-yellow-500" />
                    <button
                        onClick={onToggleTheme}
                        type="button"
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:ring-offset-dark-card ${currentTheme === 'dark' ? 'bg-brand-primary' : 'bg-slate-300'}`}
                        role="switch"
                        aria-checked={currentTheme === 'dark'}
                    >
                        <span className="sr-only">Use dark mode</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentTheme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
                        ></span>
                    </button>
                    <MoonIcon className="h-6 w-6 text-slate-500" />
                </div>
            </FormField>
        </Section>
    </div>
);

const CheckboxField: React.FC<{label: string, description: string, defaultChecked?: boolean}> = ({label, description, defaultChecked = false}) => (
    <div className="relative flex items-start">
        <div className="flex h-6 items-center">
            <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
        </div>
        <div className="ml-3 text-sm leading-6">
            <label className="font-medium text-slate-800 dark:text-dark-text">{label}</label>
            <p className="text-slate-500 dark:text-dark-text-secondary">{description}</p>
        </div>
    </div>
)

const NotificationSettings = () => (
    <div>
        <Section title="Email Notifications" description="Choose which updates you want to receive via email.">
            <CheckboxField label="High Attrition Risk Alerts" description="Get an email when an employee is flagged with high attrition risk." defaultChecked />
            <CheckboxField label="Performance Review Reminders" description="Weekly reminders for upcoming performance reviews." defaultChecked />
            <CheckboxField label="New Policy Updates" description="Notify me when company policies are added or changed." />
        </Section>
         <Section title="In-App Notifications" description="Manage the alerts you see inside the application.">
            <CheckboxField label="Show System Updates" description="Display notifications about new features and system maintenance." defaultChecked />
        </Section>
    </div>
);


export default SettingsPage;