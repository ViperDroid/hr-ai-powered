
import React, { useState, useMemo, useEffect } from 'react';
import { Employee, Department, EmployeeStatus, AttritionRisk } from '../types';
import EmployeeTable from '../components/EmployeeTable';
import AnalyticsCard from '../components/AnalyticsCard';
import { PlusIcon, UserGroupIcon, EmployeeIcon, FilterIcon, BrainIcon } from '../components/Icons';
import AnalyticsCardSkeleton from '../components/AnalyticsCardSkeleton';
import EmployeeTableSkeleton from '../components/EmployeeTableSkeleton';
import { predictAttrition } from '../services/geminiService';

interface EmployeesPageProps {
  employees: Employee[];
  searchQuery: string;
  onPredictAttrition: (employee: Employee) => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onAddNewEmployee: () => void;
  isLoading: boolean;
}

const EmployeesPage: React.FC<EmployeesPageProps> = (props) => {
    const { employees, searchQuery, onPredictAttrition, onViewEmployee, onEditEmployee, onAddNewEmployee, isLoading } = props;
    
    const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Employee | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ high: number; medium: number; low: number } | null>(null);

    const processedEmployees = useMemo(() => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        
        const filtered = employees.filter(employee => {
            const matchesSearch = !normalizedQuery ||
                employee.name.toLowerCase().includes(normalizedQuery) ||
                employee.role.toLowerCase().includes(normalizedQuery) ||
                employee.department.toLowerCase().includes(normalizedQuery);
            
            const matchesDept = departmentFilter === 'all' || employee.department === departmentFilter;
            const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;

            return matchesSearch && matchesDept && matchesStatus;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const valA = a[sortConfig.key!];
                const valB = b[sortConfig.key!];

                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [employees, searchQuery, departmentFilter, statusFilter, sortConfig]);

    useEffect(() => {
        setAnalysisResult(null);
    }, [processedEmployees]);

    const handleSort = (key: keyof Employee) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key && prevConfig.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            if (prevConfig.key === key && prevConfig.direction === 'desc') {
                return { key: null, direction: 'asc' }; // Reset sort
            }
            return { key, direction: 'asc' }; // New column
        });
    };

    const handleAnalyzeAll = async () => {
        if (processedEmployees.length === 0) return;
        setIsAnalyzing(true);

        const promises = processedEmployees.map(emp => predictAttrition(emp));
        try {
            const results = await Promise.all(promises);
            const summary = results.reduce((acc, result) => {
                if (result) {
                    switch (result.risk) {
                        case AttritionRisk.High:
                            acc.high += 1;
                            break;
                        case AttritionRisk.Medium:
                            acc.medium += 1;
                            break;
                        case AttritionRisk.Low:
                            acc.low += 1;
                            break;
                    }
                }
                return acc;
            }, { high: 0, medium: 0, low: 0 });

            setAnalysisResult(summary);
        } catch (error) {
            console.error("Error during bulk attrition analysis:", error);
            // You could set an error state here to show in the UI
        } finally {
            setIsAnalyzing(false);
        }
    };

    const activeEmployeesCount = useMemo(() => employees.filter(e => e.status === EmployeeStatus.Active).length, [employees]);

    const selectStyles = "bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition";

    return (
        <div>
            {/* Page Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-dark-text">Employee Management</h2>
                    <p className="text-sm text-slate-500 dark:text-dark-text-secondary">View, add, edit, and analyze employee data.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleAnalyzeAll}
                        disabled={isAnalyzing || isLoading || processedEmployees.length === 0}
                        className="flex items-center justify-center gap-2 bg-brand-secondary text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                        title={processedEmployees.length === 0 ? "No employees to analyze" : "Analyze attrition risk for all visible employees"}
                    >
                        <BrainIcon className="h-5 w-5" />
                        {isAnalyzing ? 'Analyzing...' : `Analyze ${processedEmployees.length} Employees`}
                    </button>
                    <button 
                        onClick={onAddNewEmployee}
                        className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        <AnalyticsCardSkeleton />
                        <AnalyticsCardSkeleton />
                        <AnalyticsCardSkeleton />
                    </>
                 ) : (
                    <>
                        <AnalyticsCard title="Total Employees" value={employees.length.toString()} change="" icon={<UserGroupIcon className="h-6 w-6"/>} />
                        <AnalyticsCard title="Active Employees" value={activeEmployeesCount.toString()} change="" icon={<EmployeeIcon className="h-6 w-6"/>} />
                        <AnalyticsCard title="Employees Shown" value={processedEmployees.length.toString()} change="" icon={<FilterIcon className="h-6 w-6"/>} />
                    </>
                 )}
            </div>
            
            {/* Analysis Results */}
            {analysisResult && (
                <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm mt-6">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-dark-text">Attrition Analysis Results</h3>
                    <div className="flex items-center gap-x-6 gap-y-2 mt-2 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-risk-high"></span>
                            <p className="text-sm"><span className="font-bold text-risk-high">{analysisResult.high}</span> High Risk</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="h-2 w-2 rounded-full bg-risk-medium"></span>
                            <p className="text-sm"><span className="font-bold text-risk-medium">{analysisResult.medium}</span> Medium Risk</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-risk-low"></span>
                            <p className="text-sm"><span className="font-bold text-risk-low">{analysisResult.low}</span> Low Risk</p>
                        </div>
                    </div>
                </div>
            )}

             {/* Filters */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm my-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FilterIcon className="h-5 w-5 text-slate-500 dark:text-dark-text-secondary" />
                        <p className="font-semibold text-sm">Filters:</p>
                    </div>
                    <select 
                        value={departmentFilter}
                        onChange={e => setDepartmentFilter(e.target.value as Department | 'all')}
                        className={selectStyles}
                        aria-label="Filter by department"
                    >
                        <option value="all">All Departments</option>
                        {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                     <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as EmployeeStatus | 'all')}
                        className={selectStyles}
                        aria-label="Filter by status"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(EmployeeStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button 
                        onClick={() => { setDepartmentFilter('all'); setStatusFilter('all'); }}
                        className="text-sm text-brand-primary font-semibold hover:underline ml-auto"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
            
            {isLoading ? (
                <EmployeeTableSkeleton />
            ) : (
                <EmployeeTable 
                    employees={processedEmployees} 
                    onPredictAttrition={onPredictAttrition}
                    onViewEmployee={onViewEmployee} 
                    onEditEmployee={onEditEmployee}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                />
            )}
        </div>
    );
};

export default EmployeesPage;
