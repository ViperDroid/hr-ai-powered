import { Employee, EmployeeStatus, Department, Notification, LeaveRequest, LeaveType, Task, TaskStatus, TaskPriority, Goal, GoalStatus, Announcement, AnnouncementCategory, JobOpening, JobStatus, Candidate, CandidateStage, PerformanceReviewCycle, Review, ReviewStatus } from '../types';

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    avatar: 'https://picsum.photos/seed/alice/200',
    role: 'Senior Software Engineer',
    department: Department.Engineering,
    salary: 120000,
    status: EmployeeStatus.Active,
    startDate: '2020-03-15',
    performanceRating: 5,
    satisfactionScore: 9,
    projectsCompleted: 12,
    lastReviewDate: '2024-07-15',
    performanceHistory: [
      { date: '2023-07-15', rating: 4 },
      { date: '2024-01-20', rating: 5 },
      { date: '2024-07-15', rating: 5 },
    ],
    leaveBalance: 22,
    goals: [
        { id: 1, title: 'Lead a major feature development', description: 'Take ownership of the new "Analytics V2" feature from planning to deployment.', targetDate: '2024-12-31', status: GoalStatus.OnTrack },
        { id: 2, title: 'Mentor a junior engineer', description: 'Provide guidance and support to George Costanza.', targetDate: '2024-11-30', status: GoalStatus.OnTrack },
    ],
  },
  {
    id: 2,
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    avatar: 'https://picsum.photos/seed/bob/200',
    role: 'Product Manager',
    department: Department.Marketing,
    salary: 110000,
    status: EmployeeStatus.Active,
    startDate: '2019-07-22',
    performanceRating: 4,
    satisfactionScore: 8,
    projectsCompleted: 8,
    lastReviewDate: '2024-06-30',
    performanceHistory: [
      { date: '2023-06-01', rating: 3 },
      { date: '2023-12-15', rating: 4 },
      { date: '2024-06-30', rating: 4 },
    ],
    leaveBalance: 15,
    goals: [
        { id: 3, title: 'Increase user engagement by 15%', description: 'Launch three new engagement campaigns and track metrics.', targetDate: '2024-10-31', status: GoalStatus.AtRisk },
    ],
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    avatar: 'https://picsum.photos/seed/charlie/200',
    role: 'UI/UX Designer',
    department: Department.Design,
    salary: 95000,
    status: EmployeeStatus.Active,
    startDate: '2022-01-10',
    performanceRating: 3,
    satisfactionScore: 6,
    projectsCompleted: 5,
    lastReviewDate: '2024-08-01',
    performanceHistory: [
      { date: '2023-08-01', rating: 4 },
      { date: '2024-02-10', rating: 3 },
      { date: '2024-08-01', rating: 3 },
    ],
    leaveBalance: 8,
    goals: [
        { id: 4, title: 'Complete Advanced Figma Certification', description: 'Enroll in and pass the certified Figma course.', targetDate: '2024-09-30', status: GoalStatus.Completed },
        { id: 5, title: 'Redesign the user onboarding flow', description: 'Improve the onboarding completion rate by 20% through a new design.', targetDate: '2025-01-15', status: GoalStatus.OnTrack },
    ],
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    avatar: 'https://picsum.photos/seed/diana/200',
    role: 'HR Manager',
    department: Department.HR,
    salary: 85000,
    status: EmployeeStatus.Active,
    startDate: '2018-11-01',
    performanceRating: 5,
    satisfactionScore: 10,
    projectsCompleted: 25,
    lastReviewDate: '2024-09-01',
    performanceHistory: [
      { date: '2023-09-01', rating: 5 },
      { date: '2024-03-01', rating: 5 },
      { date: '2024-09-01', rating: 5 },
    ],
    leaveBalance: 25,
    goals: [],
  },
  {
    id: 5,
    name: 'Ethan Hunt',
    email: 'ethan.h@example.com',
    avatar: 'https://picsum.photos/seed/ethan/200',
    role: 'Sales Executive',
    department: Department.Sales,
    salary: 75000,
    status: EmployeeStatus.Inactive,
    startDate: '2021-05-18',
    performanceRating: 2,
    satisfactionScore: 4,
    projectsCompleted: 30,
    lastReviewDate: '2023-11-05',
    performanceHistory: [
      { date: '2023-05-01', rating: 2 },
      { date: '2023-11-05', rating: 2 },
    ],
    leaveBalance: 0,
    goals: [],
  },
  {
    id: 6,
    name: 'Fiona Glenanne',
    email: 'fiona.g@example.com',
    avatar: 'https://picsum.photos/seed/fiona/200',
    role: 'Financial Analyst',
    department: Department.Finance,
    salary: 90000,
    status: EmployeeStatus.Active,
    startDate: '2023-02-20',
    performanceRating: 4,
    satisfactionScore: 7,
    projectsCompleted: 3,
    lastReviewDate: '2024-08-28',
    performanceHistory: [
        { date: '2023-08-20', rating: 3 },
        { date: '2024-02-28', rating: 4 },
        { date: '2024-08-28', rating: 4 },
    ],
    leaveBalance: 18,
    goals: [],
  },
  {
    id: 7,
    name: 'George Costanza',
    email: 'george.c@example.com',
    avatar: 'https://picsum.photos/seed/george/200',
    role: 'Junior Developer',
    department: Department.Engineering,
    salary: 80000,
    status: EmployeeStatus.Active,
    startDate: '2023-08-01',
    performanceRating: 3,
    satisfactionScore: 5,
    projectsCompleted: 2,
    lastReviewDate: '2024-07-15',
    performanceHistory: [
        { date: '2024-01-10', rating: 2 },
        { date: '2024-07-15', rating: 3 },
    ],
    leaveBalance: 12,
    goals: [
        { id: 6, title: 'Master React state management', description: 'Complete an advanced course on Redux and MobX.', targetDate: '2024-12-01', status: GoalStatus.OnTrack },
    ],
  },
  {
    id: 8,
    name: 'Hannah Abbott',
    email: 'hannah.a@example.com',
    avatar: 'https://picsum.photos/seed/hannah/200',
    role: 'Marketing Coordinator',
    department: Department.Marketing,
    salary: 65000,
    status: EmployeeStatus.Active,
    startDate: '2022-09-12',
    performanceRating: 4,
    satisfactionScore: 8,
    projectsCompleted: 15,
    lastReviewDate: '2024-04-20',
    performanceHistory: [
      { date: '2023-10-15', rating: 4 },
      { date: '2024-04-20', rating: 4 },
    ],
    leaveBalance: 14,
    goals: [],
  },
];

export const mockNotifications: Notification[] = [
    {
        id: 1,
        type: 'alert',
        title: 'High Attrition Risk Detected',
        description: 'Ethan Hunt has been flagged with a high risk of attrition. Review their profile for details.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
    },
    {
        id: 2,
        type: 'update',
        title: 'Performance Reviews Due',
        description: '3 employees are due for their quarterly performance review this week.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
    },
    {
        id: 3,
        type: 'message',
        title: 'New Policy Update',
        description: 'The company handbook has been updated with a new remote work policy.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
    }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Alice Johnson',
    employeeAvatar: 'https://picsum.photos/seed/alice/200',
    leaveType: LeaveType.Vacation,
    startDate: '2024-08-01',
    endDate: '2024-08-10',
    reason: 'Family vacation to the Grand Canyon.',
    status: 'Approved',
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: 'Charlie Brown',
    employeeAvatar: 'https://picsum.photos/seed/charlie/200',
    leaveType: LeaveType.SickLeave,
    startDate: '2024-07-22',
    endDate: '2024-07-23',
    reason: 'Feeling unwell, doctor\'s appointment scheduled.',
    status: 'Approved',
  },
  {
    id: 3,
    employeeId: 6,
    employeeName: 'Fiona Glenanne',
    employeeAvatar: 'https://picsum.photos/seed/fiona/200',
    leaveType: LeaveType.Personal,
    startDate: '2024-08-15',
    endDate: '2024-08-15',
    reason: 'Personal appointment.',
    status: 'Pending',
  },
  {
    id: 4,
    employeeId: 8,
    employeeName: 'Hannah Abbott',
    employeeAvatar: 'https://picsum.photos/seed/hannah/200',
    leaveType: LeaveType.Vacation,
    startDate: '2024-09-02',
    endDate: '2024-09-06',
    reason: 'Labor day weekend trip.',
    status: 'Pending',
  },
  {
    id: 5,
    employeeId: 2,
    employeeName: 'Bob Williams',
    employeeAvatar: 'https://picsum.photos/seed/bob/200',
    leaveType: LeaveType.Unpaid,
    startDate: '2024-07-29',
    endDate: '2024-07-30',
    reason: 'Emergency home repairs.',
    status: 'Rejected',
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Complete Q3 Performance Review Self-Assessment',
    description: 'Fill out the self-assessment form in the performance portal before the deadline.',
    assignedToId: 1, // Alice Johnson
    assignedById: 4, // Diana Prince
    dueDate: '2024-09-15',
    status: TaskStatus.InProgress,
    priority: TaskPriority.High,
  },
  {
    id: 2,
    title: 'Update Marketing Campaign Brief for "Project Phoenix"',
    description: 'Incorporate the latest feedback from the stakeholder meeting and finalize the campaign brief.',
    assignedToId: 2, // Bob Williams
    assignedById: 4,
    dueDate: '2024-08-30',
    status: TaskStatus.ToDo,
    priority: TaskPriority.Medium,
  },
  {
    id: 3,
    title: 'Submit Wireframes for New Dashboard UI',
    description: 'Provide high-fidelity wireframes for the new analytics dashboard design.',
    assignedToId: 3, // Charlie Brown
    assignedById: 4,
    dueDate: '2024-09-05',
    status: TaskStatus.Completed,
    priority: TaskPriority.High,
  },
  {
    id: 4,
    title: 'Onboarding Documentation for New Hires',
    description: 'Review and update the onboarding documentation for the engineering department.',
    assignedToId: 1, // Alice Johnson
    assignedById: 4,
    dueDate: '2024-09-20',
    status: TaskStatus.ToDo,
    priority: TaskPriority.Medium,
  },
   {
    id: 5,
    title: 'Prepare Presentation for Sales Kick-off',
    description: 'Create a slide deck outlining the sales strategy for the next quarter.',
    assignedToId: 8, // Hannah Abbott
    assignedById: 4,
    dueDate: '2024-08-25',
    status: TaskStatus.Completed,
    priority: TaskPriority.Medium,
  },
];

export const mockAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Annual Company Picnic Announced!',
        content: 'Get ready for some fun in the sun! Our annual company picnic will be held on Saturday, August 17th at Greenwood Park. More details to follow. Please RSVP by August 10th.',
        category: AnnouncementCategory.Event,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    {
        id: 2,
        title: 'New Remote Work Policy Update',
        content: 'We have updated our remote work policy to allow for more flexibility. Please review the new guidelines in the company handbook, effective immediately. Key changes include updated eligibility criteria and communication protocols.',
        category: AnnouncementCategory.PolicyUpdate,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    },
    {
        id: 3,
        title: 'Welcome to our New Hires!',
        content: 'Please join us in giving a warm welcome to our newest team members: George Costanza (Engineering) and Fiona Glenanne (Finance). We are thrilled to have them on board!',
        category: AnnouncementCategory.CompanyNews,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    }
];

export const mockJobOpenings: JobOpening[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: Department.Engineering,
    location: 'Remote',
    status: JobStatus.Open,
    description: 'We are looking for an experienced Frontend Engineer to build and maintain our user-facing applications. Must be proficient in React, TypeScript, and modern web technologies.',
    postedAt: '2024-07-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Digital Marketing Specialist',
    department: Department.Marketing,
    location: 'New York, NY',
    status: JobStatus.Open,
    description: 'Join our marketing team to create and manage digital campaigns across various platforms. Experience with SEO, SEM, and content marketing is required.',
    postedAt: '2024-07-20T14:30:00Z',
  },
  {
    id: 3,
    title: 'Lead Product Designer',
    department: Department.Design,
    location: 'San Francisco, CA',
    status: JobStatus.OnHold,
    description: 'Lead our design team in creating intuitive and beautiful user experiences. This role requires a strong portfolio and experience managing other designers.',
    postedAt: '2024-06-25T09:00:00Z',
  }
];

export const mockCandidates: Candidate[] = [
  // Candidates for Job #1 (Senior Frontend Engineer)
  { id: 1, name: 'John Doe', email: 'john.d@email.com', phone: '123-456-7890', jobOpeningId: 1, stage: CandidateStage.Interview, resumeUrl: '#', appliedDate: '2024-07-16' },
  { id: 2, name: 'Jane Smith', email: 'jane.s@email.com', phone: '234-567-8901', jobOpeningId: 1, stage: CandidateStage.Applied, resumeUrl: '#', appliedDate: '2024-07-18' },
  { id: 3, name: 'Peter Jones', email: 'peter.j@email.com', phone: '345-678-9012', jobOpeningId: 1, stage: CandidateStage.Screening, resumeUrl: '#', appliedDate: '2024-07-17' },
  { id: 4, name: 'Mary Garcia', email: 'mary.g@email.com', phone: '456-789-0123', jobOpeningId: 1, stage: CandidateStage.Offer, resumeUrl: '#', appliedDate: '2024-07-16' },
  { id: 5, name: 'David Miller', email: 'david.m@email.com', phone: '567-890-1234', jobOpeningId: 1, stage: CandidateStage.Rejected, resumeUrl: '#', appliedDate: '2024-07-19' },

  // Candidates for Job #2 (Digital Marketing Specialist)
  { id: 6, name: 'Laura Wilson', email: 'laura.w@email.com', phone: '678-901-2345', jobOpeningId: 2, stage: CandidateStage.Applied, resumeUrl: '#', appliedDate: '2024-07-21' },
  { id: 7, name: 'James Taylor', email: 'james.t@email.com', phone: '789-012-3456', jobOpeningId: 2, stage: CandidateStage.Screening, resumeUrl: '#', appliedDate: '2024-07-22' },
  { id: 8, name: 'Patricia Anderson', email: 'patricia.a@email.com', phone: '890-123-4567', jobOpeningId: 2, stage: CandidateStage.Hired, resumeUrl: '#', appliedDate: '2024-07-21' },
];

export const mockReviewCycles: PerformanceReviewCycle[] = [
    { id: 1, title: 'Q3 2024 Performance Review', startDate: '2024-07-01', endDate: '2024-09-30', isActive: true },
    { id: 2, title: 'Q2 2024 Performance Review', startDate: '2024-04-01', endDate: '2024-06-30', isActive: false },
    { id: 3, title: 'Q1 2024 Performance Review', startDate: '2024-01-01', endDate: '2024-03-31', isActive: false },
];

export const mockReviews: Review[] = [
    // Reviews for Q3 Cycle
    { id: 1, reviewCycleId: 1, employeeId: 1, status: ReviewStatus.InProgress, managerFeedback: '', employeeSelfAssessment: 'Led the Project Titan feature, exceeding all performance metrics.', finalRating: 0, completedAt: null },
    { id: 2, reviewCycleId: 1, employeeId: 2, status: ReviewStatus.Pending, managerFeedback: '', employeeSelfAssessment: '', finalRating: 0, completedAt: null },
    { id: 3, reviewCycleId: 1, employeeId: 3, status: ReviewStatus.Pending, managerFeedback: '', employeeSelfAssessment: '', finalRating: 0, completedAt: null },
    { id: 4, reviewCycleId: 1, employeeId: 4, status: ReviewStatus.Completed, managerFeedback: 'Diana continues to be a pillar of the HR department, showing exemplary leadership.', employeeSelfAssessment: 'Successfully rolled out the new performance management system and improved recruitment pipeline efficiency.', finalRating: 5, completedAt: '2024-09-01' },
    { id: 5, reviewCycleId: 1, employeeId: 6, status: ReviewStatus.InProgress, managerFeedback: 'Fiona has shown great progress in her financial modeling skills.', employeeSelfAssessment: '', finalRating: 0, completedAt: null },
    { id: 6, reviewCycleId: 1, employeeId: 7, status: ReviewStatus.Completed, managerFeedback: 'George is meeting expectations and has a great attitude. Eager to see him take on more complex tasks next quarter.', employeeSelfAssessment: 'Completed my first solo project and have been actively learning from senior developers.', finalRating: 3, completedAt: '2024-07-15' },
    { id: 7, reviewCycleId: 1, employeeId: 8, status: ReviewStatus.Pending, managerFeedback: '', employeeSelfAssessment: '', finalRating: 0, completedAt: null },

    // Reviews for Q2 Cycle (all completed)
    { id: 8, reviewCycleId: 2, employeeId: 1, status: ReviewStatus.Completed, managerFeedback: 'Excellent work this quarter.', employeeSelfAssessment: 'Delivered features ahead of schedule.', finalRating: 5, completedAt: '2024-06-25' },
    { id: 9, reviewCycleId: 2, employeeId: 2, status: ReviewStatus.Completed, managerFeedback: 'Good progress on marketing goals.', employeeSelfAssessment: 'Launched two new campaigns.', finalRating: 4, completedAt: '2024-06-30' },
];