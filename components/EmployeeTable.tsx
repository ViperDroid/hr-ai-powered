import React from 'react';
import { Employee, EmployeeStatus, AttritionRisk } from '../types';
import { BrainIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './Icons';

interface EmployeeTableProps {
  employees: Employee[];
  onPredictAttrition: (employee: Employee) => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onSort: (key: keyof Employee) => void;
  sortConfig: { key: keyof Employee | null; direction: 'asc' | 'desc' };
}

const getAttritionRisk = (satisfaction: number, performance: number): { level: AttritionRisk; className: string } => {
  if (satisfaction <= 4 || performance <= 2) {
    return {
      level: AttritionRisk.High,
      className: 'bg-risk-high/10 text-risk-high',
    };
  }
  if (satisfaction <= 6 || performance <= 3) {
    return {
      level: AttritionRisk.Medium,
      className: 'bg-risk-medium/10 text-risk-medium',
    };
  }
  return {
    level: AttritionRisk.Low,
    className: 'bg-risk-low/10 text-risk-low',
  };
};


const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onPredictAttrition, onViewEmployee, onEditEmployee, onSort, sortConfig }) => {
  
  const SortableHeader = ({ columnKey, title }: { columnKey: keyof Employee; title: string }) => {
    const isSorted = sortConfig.key === columnKey;
    
    const icon = isSorted ? (
      sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" />
      )
    ) : (
      <ArrowsUpDownIcon className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    );

    return (
      <th scope="col" className="px-6 py-3">
        <button className="flex items-center gap-1 group" onClick={() => onSort(columnKey)}>
          <span>{title}</span>
          {icon}
        </button>
      </th>
    );
  };
  
  return (
    <div className="bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-dark-text-secondary">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-dark-bg-secondary dark:text-dark-text">
            <tr>
              <th scope="col" className="px-6 py-3">Employee</th>
              <SortableHeader columnKey="id" title="Employee ID" />
              <SortableHeader columnKey="role" title="Role" />
              <SortableHeader columnKey="department" title="Department" />
              <th scope="col" className="px-6 py-3">Attrition Risk</th>
              <SortableHeader columnKey="salary" title="Salary" />
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const risk = getAttritionRisk(employee.satisfactionScore, employee.performanceRating);
              return (
                <tr key={employee.id} className="bg-white dark:bg-dark-card border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-bg-secondary cursor-pointer" onClick={() => onViewEmployee(employee)}>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full object-cover" src={employee.avatar} alt={employee.name} />
                      <div>
                        <div className="font-semibold">{employee.name}</div>
                        <div className="text-sm text-slate-500 dark:text-dark-text-secondary">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{employee.id}</td>
                  <td className="px-6 py-4">{employee.role}</td>
                  <td className="px-6 py-4">{employee.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${risk.className}`}>
                      {risk.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">${employee.salary.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.status === EmployeeStatus.Active ? 'bg-status-active/10 text-status-active' : 'bg-status-inactive/10 text-status-inactive'}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEditEmployee(employee)} className="font-medium text-brand-primary hover:underline">Edit</button>
                      <button onClick={() => onPredictAttrition(employee)} className="flex items-center gap-1 font-medium text-brand-secondary hover:underline">
                        <BrainIcon className="h-4 w-4" />
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;