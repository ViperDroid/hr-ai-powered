import React from 'react';

const SkeletonRow: React.FC = () => (
    <tr className="bg-white border-b">
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                <div>
                    <div className="h-4 bg-slate-200 rounded w-28 mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-36"></div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-8"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-40"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
        </td>
        <td className="px-6 py-4">
             <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-16"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <div className="h-4 bg-slate-200 rounded w-8"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
            </div>
        </td>
    </tr>
);


const EmployeeTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6 animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Employee</th>
              <th scope="col" className="px-6 py-3">Employee ID</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Department</th>
              <th scope="col" className="px-6 py-3">Attrition Risk</th>
              <th scope="col" className="px-6 py-3">Salary</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTableSkeleton;