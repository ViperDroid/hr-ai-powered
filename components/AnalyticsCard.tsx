
import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <p className={`text-xs mt-2 font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
      </div>
      <div className="bg-brand-light text-brand-primary p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default AnalyticsCard;
