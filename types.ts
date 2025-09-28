export enum EmployeeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum Department {
  Engineering = 'Engineering',
  HR = 'Human Resources',
  Marketing = 'Marketing',
  Sales = 'Sales',
  Finance = 'Finance',
  Design = 'Design',
}

export interface PerformanceReview {
  date: string; // YYYY-MM-DD
  rating: number; // 1 to 5
}

export enum GoalStatus {
  OnTrack = 'On Track',
  AtRisk = 'At Risk',
  Completed = 'Completed',
  Paused = 'Paused',
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: string; // YYYY-MM-DD
  status: GoalStatus;
}


export interface Employee {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Department;
  salary: number;
  status: EmployeeStatus;
  startDate: string; // YYYY-MM-DD
  performanceRating: number; // 1 to 5
  satisfactionScore: number; // 1 to 10
  projectsCompleted: number;
  lastReviewDate: string; // YYYY-MM-DD
  performanceHistory: PerformanceReview[];
  leaveBalance: number; // in days
  goals: Goal[];
}

export enum AttritionRisk {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface AttritionPrediction {
    risk: AttritionRisk;
    reason: string;
    recommendations: string;
}

export interface Notification {
  id: number;
  type: 'alert' | 'update' | 'message';
  title: string;
  description: string;
  timestamp: string; // ISO 8601 format
  read: boolean;
}

export enum LeaveType {
  Vacation = 'Vacation',
  SickLeave = 'Sick Leave',
  Personal = 'Personal Day',
  Unpaid = 'Unpaid Leave',
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string; 
  employeeAvatar: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedToId: number;
  assignedById: number; // e.g., HR Manager ID
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
}

export enum AnnouncementCategory {
    CompanyNews = 'Company News',
    PolicyUpdate = 'Policy Update',
    Event = 'Event',
    General = 'General',
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    category: AnnouncementCategory;
    createdAt: string; // ISO 8601
}

// ===== Recruitment Feature Types =====

export enum JobStatus {
  Open = 'Open',
  Closed = 'Closed',
  OnHold = 'On Hold',
}

export interface JobOpening {
  id: number;
  title: string;
  department: Department;
  location: string;
  status: JobStatus;
  description: string;
  postedAt: string; // ISO 8601
}

export enum CandidateStage {
  Applied = 'Applied',
  Screening = 'Screening',
  Interview = 'Interview',
  Offer = 'Offer',
  Hired = 'Hired',
  Rejected = 'Rejected',
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobOpeningId: number;
  stage: CandidateStage;
  resumeUrl: string; // mock URL
  appliedDate: string; // YYYY-MM-DD
}

// ===== Performance Management Types =====

export enum ReviewStatus {
    Pending = 'Pending',
    InProgress = 'In Progress',
    Completed = 'Completed',
}

export interface PerformanceReviewCycle {
    id: number;
    title: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    isActive: boolean;
}

export interface Review {
    id: number;
    reviewCycleId: number;
    employeeId: number;
    status: ReviewStatus;
    managerFeedback: string;
    employeeSelfAssessment: string;
    finalRating: number; // 1 to 5
    completedAt: string | null; // YYYY-MM-DD
}