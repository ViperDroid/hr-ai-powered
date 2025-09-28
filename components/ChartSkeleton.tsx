import React from 'react';

const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse h-full">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="h-[300px] bg-slate-200 rounded-md mt-4"></div>
    </div>
  );
};

export default ChartSkeleton;