import { useState, useEffect } from 'react';
import { Login } from '@/components/Login';
import { StudentDashboard } from '@/components/StudentDashboard';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { LessonViewer } from '@/components/LessonViewer';
import { User, Lesson, database } from '@/lib/indexedDB';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize database and service worker
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize IndexedDB
      await database.init();
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    database.saveUser(userData);
  };

  const handleLessonStart = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleLessonBack = () => {
    setCurrentLesson(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading Eguru...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentLesson) {
    return (
      <LessonViewer
        lesson={currentLesson}
        user={user}
        onBack={handleLessonBack}
      />
    );
  }

  return user.role === 'student' ? (
    <StudentDashboard user={user} onLessonStart={handleLessonStart} />
  ) : (
    <TeacherDashboard user={user} />
  );
};

export default Index;
