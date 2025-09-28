import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LeavePage from './pages/LeavePage';
import TasksPage from './pages/TasksPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import RecruitmentPage from './pages/RecruitmentPage';
import PerformancePage from './pages/PerformancePage';
import AttritionPredictorModal from './components/AttritionPredictorModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import EmployeeFormModal from './components/EmployeeFormModal';
import LeaveRequestForm from './components/LeaveRequestForm';
import TaskFormModal from './components/TaskFormModal';
import GoalFormModal from './components/GoalFormModal';
import AnnouncementFormModal from './components/AnnouncementFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import JobOpeningFormModal from './components/JobOpeningFormModal';
import CandidateFormModal from './components/CandidateFormModal';
import ReviewFormModal from './components/ReviewFormModal';
import { mockEmployees, mockNotifications, mockLeaveRequests, mockTasks, mockAnnouncements, mockJobOpenings, mockCandidates, mockReviewCycles, mockReviews } from './data/mockData';
import { Employee, EmployeeStatus, Department, Notification, LeaveRequest, LeaveType, Task, TaskStatus, Goal, Announcement, JobOpening, Candidate, CandidateStage, PerformanceReviewCycle, Review } from './types';

type Theme = 'light' | 'dark';

const calculateDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
};


function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [reviewCycles, setReviewCycles] = useState<PerformanceReviewCycle[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(localStorage.getItem('theme') as Theme || 'light');
  
  const [selectedEmployeeForPrediction, setSelectedEmployeeForPrediction] = useState<Employee | null>(null);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<Employee | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [preselectedEmployeeForTask, setPreselectedEmployeeForTask] = useState<number | null>(null);

  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeEmployeeForGoal, setActiveEmployeeForGoal] = useState<number | null>(null);

  const [isAnnouncementFormOpen, setIsAnnouncementFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [isJobOpeningFormOpen, setIsJobOpeningFormOpen] = useState(false);
  const [editingJobOpening, setEditingJobOpening] = useState<JobOpening | null>(null);

  const [isCandidateFormOpen, setIsCandidateFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [activeJobForCandidate, setActiveJobForCandidate] = useState<number | null>(null);

  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const [confirmationProps, setConfirmationProps] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; } | { isOpen: false }>({ isOpen: false });
  
  const deadlineCheckDone = useRef(false);

  useEffect(() => {
    // Simulate fetching initial data
    const timer = setTimeout(() => {
      setEmployees(mockEmployees);
      setLeaveRequests(mockLeaveRequests);
      setTasks(mockTasks);
      setAnnouncements(mockAnnouncements);
      setJobOpenings(mockJobOpenings);
      setCandidates(mockCandidates);
      setReviewCycles(mockReviewCycles);
      setReviews(mockReviews);
      setIsLoading(false);
    }, 1500); // 1.5 seconds delay to show skeletons

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Tailwind's 'lg' breakpoint
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect for checking upcoming task deadlines
  useEffect(() => {
    if (!isLoading && !deadlineCheckDone.current && tasks.length > 0 && employees.length > 0) {
        deadlineCheckDone.current = true;
        
        const upcomingNotifications: Notification[] = [];
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);

        tasks.forEach(task => {
            if (task.status !== TaskStatus.Completed) {
                const dueDate = new Date(task.dueDate);
                if (dueDate > now && dueDate <= tomorrow) {
                    const assignee = employees.find(e => e.id === task.assignedToId);
                    if (assignee) {
                        upcomingNotifications.push({
                            id: 0, // placeholder id
                            type: 'alert',
                            title: 'Task Deadline Approaching',
                            description: `Deadline for "${task.title}" (${assignee.name}) is within 24 hours.`,
                            timestamp: new Date().toISOString(),
                            read: false,
                        });
                    }
                }
            }
        });

        if (upcomingNotifications.length > 0) {
            setNotifications(prev => {
                let maxId = Math.max(...prev.map(n => n.id), 0);
                const notificationsWithIds = upcomingNotifications.map(n => ({ ...n, id: ++maxId }));
                const existingDescs = new Set(prev.map(p => p.description));
                const finalNotifications = notificationsWithIds.filter(n => !existingDescs.has(n.description));
                return [...finalNotifications, ...prev];
            });
        }
    }
  }, [isLoading, tasks, employees]);


  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handlePredictAttrition = (employee: Employee) => setSelectedEmployeeForPrediction(employee);
  const handleClosePredictionModal = () => setSelectedEmployeeForPrediction(null);

  const handleViewEmployee = (employee: Employee) => setSelectedEmployeeForView(employee);
  const handleCloseDetailModal = () => setSelectedEmployeeForView(null);

  const handleAddNewEmployee = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  };
  
  const handleRequestLeave = () => setIsLeaveFormOpen(true);
  const handleCloseLeaveForm = () => setIsLeaveFormOpen(false);
  
  const handleSaveLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'employeeId' | 'employeeName' | 'employeeAvatar' | 'status'>) => {
    const newRequest: LeaveRequest = {
      id: Math.max(...leaveRequests.map(r => r.id), 0) + 1,
      // In a real app, this would be the logged-in user
      employeeId: 4, 
      employeeName: 'Diana Prince', 
      employeeAvatar: 'https://picsum.photos/seed/diana/200',
      status: 'Pending',
      ...request,
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
    handleCloseLeaveForm();
  };

  const handleApproveLeave = (id: number) => {
    const requestToApprove = leaveRequests.find(r => r.id === id);
    if (!requestToApprove) return;

    // Update leave request status
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));

    // Deduct from employee's leave balance if not unpaid
    if (requestToApprove.leaveType !== LeaveType.Unpaid) {
        const leaveDays = calculateDays(requestToApprove.startDate, requestToApprove.endDate);
        setEmployees(prev => prev.map(e => 
            e.id === requestToApprove.employeeId 
            ? { ...e, leaveBalance: e.leaveBalance - leaveDays } 
            : e
        ));
    }
  };

  const handleRejectLeave = (id: number) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };


  const handleSaveEmployee = (employeeData: Partial<Employee>) => {
    if (employeeData.id) {
      setEmployees(employees.map(e => e.id === employeeData.id ? { ...e, ...employeeData } as Employee : e));
    } else {
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id), 0) + 1,
        name: employeeData.name || 'N/A',
        email: employeeData.email || 'n/a',
        avatar: employeeData.avatar || `https://picsum.photos/seed/${Math.random()}/200`,
        role: employeeData.role || 'N/A',
        department: employeeData.department || Department.Engineering,
        salary: employeeData.salary || 50000,
        status: employeeData.status || EmployeeStatus.Active,
        startDate: employeeData.startDate || new Date().toISOString().split('T')[0],
        performanceRating: 3,
        satisfactionScore: 7,
        projectsCompleted: 0,
        lastReviewDate: new Date().toISOString().split('T')[0],
        performanceHistory: [{ date: new Date().toISOString().split('T')[0], rating: 3 }],
        leaveBalance: 20, // Default leave balance
        goals: [],
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    handleCloseFormModal();
  };
  
    const handleOpenTaskForm = (task: Task | null = null, employeeId: number | null = null) => {
        setEditingTask(task);
        setPreselectedEmployeeForTask(employeeId);
        setIsTaskFormOpen(true);
    };

    const handleCloseTaskForm = () => {
        setEditingTask(null);
        setPreselectedEmployeeForTask(null);
        setIsTaskFormOpen(false);
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'status'> & { id?: number; status: TaskStatus }) => {
        if (taskData.id) { // Editing
            setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
        } else { // Creating
            const newTaskId = Math.max(...tasks.map(t => t.id), 0) + 1;
            const newTask: Task = {
                id: newTaskId,
                ...taskData
            };
            setTasks(prev => [newTask, ...prev]);

            // Add notification for new task assignment
            const assignee = employees.find(e => e.id === newTask.assignedToId);
            if (assignee) {
                const newNotification: Notification = {
                    id: Math.max(...notifications.map(n => n.id), 0) + 1,
                    type: 'update',
                    title: 'New Task Assigned',
                    description: `You assigned "${newTask.title}" to ${assignee.name}.`,
                    timestamp: new Date().toISOString(),
                    read: false,
                };
                setNotifications(prev => [newNotification, ...prev]);
            }
        }
        handleCloseTaskForm();
    };

    const handleBulkUpdateTaskStatus = (taskIds: number[], status: TaskStatus) => {
        setTasks(prevTasks => prevTasks.map(task =>
            taskIds.includes(task.id) ? { ...task, status } : task
        ));
    };

    const handleBulkDeleteTasks = (taskIds: number[]) => {
        setConfirmationProps({
            isOpen: true,
            title: 'Delete Tasks',
            message: `Are you sure you want to delete ${taskIds.length} task(s)? This action cannot be undone.`,
            onConfirm: () => {
                setTasks(prevTasks => prevTasks.filter(task => !taskIds.includes(task.id)));
                setConfirmationProps({ isOpen: false });
            },
        });
    };

    const handleOpenGoalForm = (employeeId: number, goal: Goal | null = null) => {
        setActiveEmployeeForGoal(employeeId);
        setEditingGoal(goal);
        setIsGoalFormOpen(true);
    };
    
    const handleCloseGoalForm = () => {
        setActiveEmployeeForGoal(null);
        setEditingGoal(null);
        setIsGoalFormOpen(false);
    };

    const handleSaveGoal = (goalData: Omit<Goal, 'id'> & { id?: number }) => {
        setEmployees(prevEmployees => prevEmployees.map(emp => {
            if (emp.id !== activeEmployeeForGoal) return emp;

            let updatedGoals;
            if (goalData.id) { // Editing existing goal
                updatedGoals = emp.goals.map(g => g.id === goalData.id ? { ...g, ...goalData } : g);
            } else { // Adding new goal
                const newGoal: Goal = {
                    id: Math.random(), // In real app, use a better ID generation
                    ...goalData
                };
                updatedGoals = [...emp.goals, newGoal];
            }
            return { ...emp, goals: updatedGoals };
        }));
        
        handleCloseGoalForm();
    };

    const handleOpenAnnouncementForm = (announcement: Announcement | null = null) => {
        setEditingAnnouncement(announcement);
        setIsAnnouncementFormOpen(true);
    };

    const handleCloseAnnouncementForm = () => {
        setEditingAnnouncement(null);
        setIsAnnouncementFormOpen(false);
    };

    const handleSaveAnnouncement = (announcementData: Omit<Announcement, 'id' | 'createdAt'> & { id?: number }) => {
        if (announcementData.id) { // Editing
            setAnnouncements(announcements.map(a => a.id === announcementData.id ? { ...a, ...announcementData } : a));
        } else { // Creating
            const newAnnouncement: Announcement = {
                id: Math.max(...announcements.map(a => a.id), 0) + 1,
                createdAt: new Date().toISOString(),
                ...announcementData
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        handleCloseAnnouncementForm();
    };

    const handleDeleteAnnouncement = (announcementId: number) => {
        setConfirmationProps({
            isOpen: true,
            title: 'Delete Announcement',
            message: 'Are you sure you want to delete this announcement? This action cannot be undone.',
            onConfirm: () => {
                setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
                setConfirmationProps({ isOpen: false });
            },
        });
    };

    const handleOpenJobOpeningForm = (job: JobOpening | null = null) => {
        setEditingJobOpening(job);
        setIsJobOpeningFormOpen(true);
    };

    const handleCloseJobOpeningForm = () => {
        setEditingJobOpening(null);
        setIsJobOpeningFormOpen(false);
    };
    
    const handleSaveJobOpening = (jobData: Omit<JobOpening, 'id' | 'postedAt'> & { id?: number }) => {
        if (jobData.id) { // Editing
            setJobOpenings(jobOpenings.map(j => j.id === jobData.id ? { ...j, ...jobData } : j));
        } else { // Creating
            const newJob: JobOpening = {
                id: Math.max(...jobOpenings.map(j => j.id), 0) + 1,
                postedAt: new Date().toISOString(),
                ...jobData
            };
            setJobOpenings(prev => [newJob, ...prev]);
        }
        handleCloseJobOpeningForm();
    };

    const handleDeleteJobOpening = (jobId: number) => {
         setConfirmationProps({
            isOpen: true,
            title: 'Delete Job Opening',
            message: 'Are you sure you want to delete this job opening and all its candidates? This action cannot be undone.',
            onConfirm: () => {
                setJobOpenings(prev => prev.filter(j => j.id !== jobId));
                setCandidates(prev => prev.filter(c => c.jobOpeningId !== jobId));
                setConfirmationProps({ isOpen: false });
            },
        });
    };

    const handleOpenCandidateForm = (jobId: number, candidate: Candidate | null = null) => {
        setActiveJobForCandidate(jobId);
        setEditingCandidate(candidate);
        setIsCandidateFormOpen(true);
    };

    const handleCloseCandidateForm = () => {
        setActiveJobForCandidate(null);
        setEditingCandidate(null);
        setIsCandidateFormOpen(false);
    };

    const handleSaveCandidate = (candidateData: Omit<Candidate, 'id' | 'jobOpeningId' | 'appliedDate' | 'resumeUrl'> & { id?: number }) => {
        if (candidateData.id) { // Editing
            setCandidates(candidates.map(c => c.id === candidateData.id ? { ...c, ...candidateData } : c));
        } else { // Creating
            const newCandidate: Candidate = {
                id: Math.max(...candidates.map(c => c.id), 0) + 1,
                jobOpeningId: activeJobForCandidate!,
                appliedDate: new Date().toISOString().split('T')[0],
                resumeUrl: '#',
                ...candidateData
            };
            setCandidates(prev => [newCandidate, ...prev]);
        }
        handleCloseCandidateForm();
    };

    const handleDeleteCandidate = (candidateId: number) => {
        setConfirmationProps({
            isOpen: true,
            title: 'Delete Candidate',
            message: 'Are you sure you want to delete this candidate?',
            onConfirm: () => {
                setCandidates(prev => prev.filter(c => c.id !== candidateId));
                setConfirmationProps({ isOpen: false });
            },
        });
    };

    const handleMoveCandidateStage = (candidateId: number, newStage: CandidateStage) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    };
    
    const handleOpenReviewForm = (review: Review) => {
        setEditingReview(review);
        setIsReviewFormOpen(true);
    };

    const handleCloseReviewForm = () => {
        setEditingReview(null);
        setIsReviewFormOpen(false);
    };

    const handleSaveReview = (reviewData: Review) => {
        setReviews(prev => prev.map(r => r.id === reviewData.id ? reviewData : r));
        // Also update the employee's main performance rating and last review date
        setEmployees(prev => prev.map(e => e.id === reviewData.employeeId ? {
            ...e,
            performanceRating: reviewData.finalRating,
            lastReviewDate: reviewData.completedAt || e.lastReviewDate,
        } : e));
        handleCloseReviewForm();
    };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setActivePage('Employees');
    }
  };
  
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => ({ ...n, read: true }))
    );
  };

  const renderPage = () => {
    const pageProps = {
        employees,
        onPredictAttrition: handlePredictAttrition,
        onViewEmployee: handleViewEmployee,
        onEditEmployee: handleEditEmployee,
        onAddNewEmployee: handleAddNewEmployee,
    };

    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage employees={employees} onNavigate={setActivePage} isLoading={isLoading} />;
      case 'Employees':
        return <EmployeesPage {...pageProps} searchQuery={searchQuery} isLoading={isLoading} />;
      case 'Recruitment':
        return <RecruitmentPage 
                    jobOpenings={jobOpenings}
                    candidates={candidates}
                    onOpenJobForm={handleOpenJobOpeningForm}
                    onDeleteJob={handleDeleteJobOpening}
                    onOpenCandidateForm={handleOpenCandidateForm}
                    onDeleteCandidate={handleDeleteCandidate}
                    onMoveCandidate={handleMoveCandidateStage}
                />;
      case 'Performance':
        return <PerformancePage 
                    reviewCycles={reviewCycles}
                    reviews={reviews}
                    employees={employees}
                    onOpenReviewForm={handleOpenReviewForm}
                />;
      case 'Tasks':
        return <TasksPage 
                    tasks={tasks} 
                    employees={employees} 
                    onOpenTaskForm={handleOpenTaskForm}
                    onBulkUpdateStatus={handleBulkUpdateTaskStatus}
                    onBulkDelete={handleBulkDeleteTasks}
                />;
      case 'Announcements':
        return <AnnouncementsPage
                    announcements={announcements}
                    onOpenForm={handleOpenAnnouncementForm}
                    onDelete={handleDeleteAnnouncement}
                />;
      case 'Reports':
        return <ReportsPage employees={employees} leaveRequests={leaveRequests} />;
      case 'Leave Management':
        return <LeavePage 
                    employees={employees}
                    leaveRequests={leaveRequests} 
                    onRequestLeave={handleRequestLeave} 
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                />;
      case 'Settings':
        return <SettingsPage currentTheme={theme} onToggleTheme={toggleTheme} />;
      default:
        return <DashboardPage employees={employees} onNavigate={setActivePage} isLoading={isLoading} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-dark-text">
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={activePage}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
      
      {/* Modals */}
      {selectedEmployeeForPrediction && <AttritionPredictorModal employee={selectedEmployeeForPrediction} onClose={handleClosePredictionModal} />}
      {selectedEmployeeForView && <EmployeeDetailModal 
                                    employee={selectedEmployeeForView} 
                                    tasks={tasks.filter(t => t.assignedToId === selectedEmployeeForView.id)}
                                    reviews={reviews.filter(r => r.employeeId === selectedEmployeeForView.id)}
                                    reviewCycles={reviewCycles}
                                    onAssignTask={handleOpenTaskForm}
                                    onAddGoal={handleOpenGoalForm}
                                    onClose={handleCloseDetailModal} 
                                  />}
      {isFormModalOpen && <EmployeeFormModal employee={editingEmployee} onSave={handleSaveEmployee} onClose={handleCloseFormModal} />}
      {isLeaveFormOpen && <LeaveRequestForm onClose={handleCloseLeaveForm} onSave={handleSaveLeaveRequest} />}
      {isTaskFormOpen && <TaskFormModal 
                            task={editingTask} 
                            employees={employees}
                            preselectedEmployeeId={preselectedEmployeeForTask}
                            onSave={handleSaveTask} 
                            onClose={handleCloseTaskForm} 
                          />}
      {isGoalFormOpen && activeEmployeeForGoal && <GoalFormModal 
                            goal={editingGoal}
                            onSave={handleSaveGoal}
                            onClose={handleCloseGoalForm}
                          />}
      {isAnnouncementFormOpen && <AnnouncementFormModal 
                                    announcement={editingAnnouncement}
                                    onSave={handleSaveAnnouncement}
                                    onClose={handleCloseAnnouncementForm}
                                  />}
      {isJobOpeningFormOpen && <JobOpeningFormModal 
                                    jobOpening={editingJobOpening}
                                    onSave={handleSaveJobOpening}
                                    onClose={handleCloseJobOpeningForm}
                                />}
      {isCandidateFormOpen && activeJobForCandidate && <CandidateFormModal
                                    candidate={editingCandidate}
                                    jobOpeningId={activeJobForCandidate}
                                    onSave={handleSaveCandidate}
                                    onClose={handleCloseCandidateForm}
                                />}
      {isReviewFormOpen && editingReview && <ReviewFormModal
                                    review={editingReview}
                                    employee={employees.find(e => e.id === editingReview.employeeId)!}
                                    onSave={handleSaveReview}
                                    onClose={handleCloseReviewForm}
                                />}
      {confirmationProps.isOpen && <ConfirmationModal 
                                        isOpen={confirmationProps.isOpen}
                                        title={confirmationProps.title}
                                        message={confirmationProps.message}
                                        onConfirm={confirmationProps.onConfirm}
                                        onClose={() => setConfirmationProps({ isOpen: false })}
                                    />}
    </div>
  );
}

export default App;