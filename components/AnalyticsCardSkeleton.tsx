import React from 'react';

const AnalyticsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start justify-between animate-pulse">
      <div>
        <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-16 mt-2 mb-3"></div>
        <div className="h-3 bg-slate-200 rounded w-32"></div>
      </div>
      <div className="bg-slate-200 p-3 rounded-full h-12 w-12"></div>
    </div>
  );
};

export default AnalyticsCardSkeleton;