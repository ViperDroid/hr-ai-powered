import React, { useState, useMemo } from 'react';
import { JobOpening, Candidate, CandidateStage, Department, JobStatus } from '../types';
import { BriefcaseIcon, PlusIcon, MapPinIcon, TrashIcon, UserGroupIcon, ChevronDownIcon } from '../components/Icons';

interface RecruitmentPageProps {
  jobOpenings: JobOpening[];
  candidates: Candidate[];
  onOpenJobForm: (job?: JobOpening | null) => void;
  onDeleteJob: (jobId: number) => void;
  onOpenCandidateForm: (jobId: number, candidate?: Candidate | null) => void;
  onDeleteCandidate: (candidateId: number) => void;
  onMoveCandidate: (candidateId: number, newStage: CandidateStage) => void;
}

const KANBAN_STAGES = Object.values(CandidateStage);

const JobOpeningCard: React.FC<{
    job: JobOpening;
    candidateCount: number;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ job, candidateCount, isSelected, onSelect, onEdit, onDelete }) => {
    
    const getStatusStyles = (status: JobStatus) => {
        switch (status) {
            case JobStatus.Open: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case JobStatus.OnHold: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case JobStatus.Closed: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        }
    };

    return (
        <div className={`border-l-4 ${isSelected ? 'border-brand-primary bg-slate-50 dark:bg-dark-bg' : 'border-transparent bg-white dark:bg-dark-card'} p-4 rounded-r-lg shadow-sm cursor-pointer transition-colors`} onClick={onSelect}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-dark-text">{job.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-dark-text-secondary">{job.department}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyles(job.status)}`}>{job.status}</span>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="text-sm text-slate-500 dark:text-dark-text-secondary flex items-center gap-4">
                     <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" /> {job.location}</span>
                     <span className="flex items-center gap-1"><UserGroupIcon className="h-4 w-4" /> {candidateCount}</span>
                </div>
                 <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={onEdit} className="text-xs font-medium text-brand-primary hover:underline">Edit</button>
                    <button onClick={onDelete} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </div>
            </div>
        </div>
    );
};

const CandidateCard: React.FC<{
    candidate: Candidate;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, candidateId: number) => void;
}> = ({ candidate, onEdit, onDelete, onDragStart }) => (
    <div 
        className="bg-white dark:bg-dark-card p-3 rounded-md shadow-sm border border-slate-200 dark:border-dark-border cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, candidate.id)}
    >
        <p className="font-semibold text-sm text-slate-800 dark:text-dark-text">{candidate.name}</p>
        <p className="text-xs text-slate-500 dark:text-dark-text-secondary">{candidate.email}</p>
        <div className="flex justify-end items-center mt-2 gap-2">
            <button onClick={onEdit} className="text-xs font-medium text-brand-primary hover:underline">Edit</button>
            <button onClick={onDelete} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
        </div>
    </div>
);

const KanbanColumn: React.FC<{
    stage: CandidateStage;
    candidates: Candidate[];
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, stage: CandidateStage) => void;
    children: React.ReactNode;
}> = ({ stage, candidates, onDragOver, onDrop, children }) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    return (
        <div 
            className={`bg-slate-50 dark:bg-dark-bg rounded-lg p-3 w-full sm:w-64 flex-shrink-0 transition-colors ${isDraggedOver ? 'bg-brand-light dark:bg-brand-primary/20' : ''}`}
            onDragOver={(e) => {
                onDragOver(e);
                setIsDraggedOver(true);
            }}
            onDragLeave={() => setIsDraggedOver(false)}
            onDrop={(e) => {
                onDrop(e, stage);
                setIsDraggedOver(false);
            }}
        >
            <h4 className="font-semibold text-sm text-slate-600 dark:text-dark-text-secondary px-2 mb-3 flex justify-between">
                <span>{stage}</span>
                <span className="text-slate-400">{candidates.length}</span>
            </h4>
            <div className="space-y-3 min-h-[100px]">{children}</div>
        </div>
    );
};

const RecruitmentPage: React.FC<RecruitmentPageProps> = (props) => {
  const { jobOpenings, candidates, onOpenJobForm, onDeleteJob, onOpenCandidateForm, onDeleteCandidate, onMoveCandidate } = props;
  const [selectedJobId, setSelectedJobId] = useState<number | null>(jobOpenings.length > 0 ? jobOpenings[0].id : null);
  
  const selectedJob = useMemo(() => jobOpenings.find(j => j.id === selectedJobId), [jobOpenings, selectedJobId]);

  const candidatesByJob = useMemo(() => {
    return candidates.reduce((acc, candidate) => {
      const { jobOpeningId } = candidate;
      if (!acc[jobOpeningId]) acc[jobOpeningId] = [];
      acc[jobOpeningId].push(candidate);
      return acc;
    }, {} as Record<number, Candidate[]>);
  }, [candidates]);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidateId: number) => {
    e.dataTransfer.setData("candidateId", candidateId.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: CandidateStage) => {
    e.preventDefault();
    const candidateId = parseInt(e.dataTransfer.getData("candidateId"), 10);
    if (candidateId) {
        onMoveCandidate(candidateId, newStage);
    }
  };

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Recruitment</h1>
                <p className="text-slate-500 dark:text-dark-text-secondary">Manage job openings and candidate pipelines.</p>
            </div>
            <button 
                onClick={() => onOpenJobForm()}
                className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
            >
                <PlusIcon className="h-5 w-5" />
                Create Job Opening
            </button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
                <h2 className="text-lg font-semibold text-slate-700 dark:text-dark-text mb-3">Job Openings</h2>
                <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
                   {jobOpenings.map(job => (
                       <JobOpeningCard 
                           key={job.id}
                           job={job}
                           candidateCount={candidatesByJob[job.id]?.length || 0}
                           isSelected={selectedJobId === job.id}
                           onSelect={() => setSelectedJobId(job.id)}
                           onEdit={() => onOpenJobForm(job)}
                           onDelete={() => onDeleteJob(job.id)}
                       />
                   ))}
                </div>
            </div>
            <div className="xl:col-span-2">
                {selectedJob ? (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                           <h2 className="text-lg font-semibold text-slate-700 dark:text-dark-text">
                                Pipeline for: <span className="text-brand-primary">{selectedJob.title}</span>
                           </h2>
                           <button 
                                onClick={() => onOpenCandidateForm(selectedJob.id)}
                                className="flex items-center justify-center gap-1.5 bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-bg-secondary transition-colors whitespace-nowrap"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Candidate
                           </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 sm:overflow-x-auto sm:pb-4">
                           {KANBAN_STAGES.map(stage => {
                               const stageCandidates = candidatesByJob[selectedJob.id]?.filter(c => c.stage === stage) || [];
                               return (
                                   <KanbanColumn 
                                       key={stage} 
                                       stage={stage} 
                                       candidates={stageCandidates}
                                       onDragOver={handleDragOver}
                                       onDrop={handleDrop}
                                   >
                                       {stageCandidates.map(candidate => (
                                           <CandidateCard 
                                               key={candidate.id} 
                                               candidate={candidate}
                                               onEdit={() => onOpenCandidateForm(selectedJob.id, candidate)}
                                               onDelete={() => onDeleteCandidate(candidate.id)}
                                               onDragStart={handleDragStart}
                                           />
                                       ))}
                                   </KanbanColumn>
                               );
                           })}
                        </div>
                    </div>
                ) : (
                     <div className="text-center py-16 bg-white dark:bg-dark-card rounded-lg h-full flex flex-col justify-center items-center">
                        <BriefcaseIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-dark-text">No Job Selected</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-dark-text-secondary">Select a job opening to view its hiring pipeline.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default RecruitmentPage;