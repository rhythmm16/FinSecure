import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Goal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'ahead';
}

interface Tutorial {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  progress: number;
  category: string;
  videoUrl?: string;
  completed: boolean;
}

interface Quiz {
  id: number;
  title: string;
  questions: number;
  timeLimit: string;
  difficulty: string;
  attempts: number;
  bestScore: number | null;
  completed: boolean;
}

interface AppContextType {
  goals: Goal[];
  tutorials: Tutorial[];
  quizzes: Quiz[];
  updateGoalProgress: (goalId: number, amount: number) => void;
  updateTutorialProgress: (tutorialId: number, progress: number) => void;
  completeQuiz: (quizId: number, score: number) => void;
  userStats: {
    learningScore: number;
    securityLevel: string;
    goalsAchieved: number;
    fraudBlocked: number;
  };
  updateUserStats: (stats: Partial<AppContextType['userStats']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 68000,
      deadline: '2024-12-31',
      category: 'Safety',
      color: '#059669',
      priority: 'high',
      status: 'on-track',
    },
    {
      id: 2,
      title: 'Home Down Payment',
      targetAmount: 500000,
      currentAmount: 180000,
      deadline: '2025-06-30',
      category: 'Housing',
      color: '#1B365C',
      priority: 'high',
      status: 'behind',
    },
    {
      id: 3,
      title: 'New Car',
      targetAmount: 300000,
      currentAmount: 250000,
      deadline: '2024-08-15',
      category: 'Transportation',
      color: '#0891B2',
      priority: 'medium',
      status: 'ahead',
    },
  ]);

  const [tutorials, setTutorials] = useState<Tutorial[]>([
    {
      id: 1,
      title: 'Basic Budgeting for Beginners',
      description: 'Learn the fundamentals of creating and managing your budget',
      duration: '15 min',
      level: 'Beginner',
      progress: 0,
      category: 'Budgeting',
      videoUrl: 'https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4',
      completed: false,
    },
    {
      id: 2,
      title: 'Understanding Investment Basics',
      description: 'Introduction to stocks, bonds, and mutual funds',
      duration: '25 min',
      level: 'Intermediate',
      progress: 60,
      category: 'Investment',
      videoUrl: 'https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4',
      completed: false,
    },
    {
      id: 3,
      title: 'Tax Planning Strategies',
      description: 'Maximize your tax savings with smart planning',
      duration: '20 min',
      level: 'Advanced',
      progress: 100,
      category: 'Tax Planning',
      videoUrl: 'https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4',
      completed: true,
    },
    {
      id: 4,
      title: 'Credit Card Management',
      description: 'Use credit cards wisely and build good credit',
      duration: '12 min',
      level: 'Beginner',
      progress: 0,
      category: 'Credit',
      videoUrl: 'https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4',
      completed: false,
    },
  ]);

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: 1,
      title: 'Financial Literacy Quiz',
      questions: 15,
      timeLimit: '10 min',
      difficulty: 'Easy',
      attempts: 0,
      bestScore: null,
      completed: false,
    },
    {
      id: 2,
      title: 'Investment Knowledge Test',
      questions: 20,
      timeLimit: '15 min',
      difficulty: 'Medium',
      attempts: 2,
      bestScore: 85,
      completed: true,
    },
    {
      id: 3,
      title: 'Tax Planning Challenge',
      questions: 25,
      timeLimit: '20 min',
      difficulty: 'Hard',
      attempts: 1,
      bestScore: 72,
      completed: false,
    },
  ]);

  const [userStats, setUserStats] = useState({
    learningScore: 85,
    securityLevel: 'High',
    goalsAchieved: 3,
    fraudBlocked: 12,
  });

  const updateGoalProgress = (goalId: number, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ));
  };

  const updateTutorialProgress = (tutorialId: number, progress: number) => {
    setTutorials(prev => prev.map(tutorial => 
      tutorial.id === tutorialId 
        ? { ...tutorial, progress, completed: progress >= 100 }
        : tutorial
    ));
  };

  const completeQuiz = (quizId: number, score: number) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? { 
            ...quiz, 
            attempts: quiz.attempts + 1,
            bestScore: Math.max(quiz.bestScore || 0, score),
            completed: score >= 70
          }
        : quiz
    ));
  };

  const updateUserStats = (newStats: Partial<AppContextType['userStats']>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <AppContext.Provider value={{
      goals,
      tutorials,
      quizzes,
      updateGoalProgress,
      updateTutorialProgress,
      completeQuiz,
      userStats,
      updateUserStats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}