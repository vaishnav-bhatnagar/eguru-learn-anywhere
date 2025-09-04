import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LessonCard } from './LessonCard';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp,
  ArrowRight,
  Star
} from "lucide-react";
import { Lesson, UserProgress, User, database } from '@/lib/indexedDB';
import { sampleLessons, subjects } from '@/data/sampleLessons';

interface StudentDashboardProps {
  user: User;
  onLessonStart: (lesson: Lesson) => void;
}

export function StudentDashboard({ user, onLessonStart }: StudentDashboardProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Initialize database and load sample data if needed
      await database.init();
      
      let allLessons = await database.getAllLessons();
      if (allLessons.length === 0) {
        // Load sample lessons for demo
        for (const lesson of sampleLessons) {
          await database.addLesson(lesson);
        }
        allLessons = await database.getAllLessons();
      }
      
      const progress = await database.getProgressByUser(user.id);
      
      setLessons(allLessons);
      setUserProgress(progress);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForLesson = (lessonId: string) => {
    return userProgress.find(p => p.lessonId === lessonId);
  };

  const completedLessons = userProgress.filter(p => p.completed).length;
  const totalTimeSpent = userProgress.reduce((total, p) => total + p.timeSpent, 0);
  const averageScore = userProgress.length > 0 
    ? userProgress.filter(p => p.quizScore !== undefined).reduce((total, p) => total + (p.quizScore || 0), 0) / userProgress.filter(p => p.quizScore !== undefined).length
    : 0;

  const recentLessons = lessons
    .filter(lesson => {
      const progress = getProgressForLesson(lesson.id);
      return progress && !progress.completed;
    })
    .slice(0, 3);

  const recommendedLessons = lessons
    .filter(lesson => !getProgressForLesson(lesson.id))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-primary-foreground/80 mt-1">
                Continue your learning journey
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary-foreground/80">Current Streak</div>
              <div className="text-2xl font-bold">7 days</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div className="text-2xl font-bold">{completedLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-lesson-text/10 rounded-full mx-auto mb-2">
                <Clock className="h-6 w-6 text-lesson-text" />
              </div>
              <div className="text-2xl font-bold">{totalTimeSpent}h</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
                <Target className="h-6 w-6 text-warning" />
              </div>
              <div className="text-2xl font-bold">{averageScore.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Avg. Score</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-lesson-video/10 rounded-full mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-lesson-video" />
              </div>
              <div className="text-2xl font-bold">+15%</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
        </section>

        {/* Continue Learning */}
        {recentLessons.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Continue Learning</h2>
                <p className="text-muted-foreground">Pick up where you left off</p>
              </div>
              <Button variant="outline" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={getProgressForLesson(lesson.id)}
                  onStart={() => onLessonStart(lesson)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Subjects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Explore Subjects</h2>
              <p className="text-muted-foreground">Choose what interests you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {subjects.map((subject) => {
              const subjectLessons = lessons.filter(l => l.subject === subject.id);
              const completedInSubject = subjectLessons.filter(l => 
                getProgressForLesson(l.id)?.completed
              ).length;
              
              return (
                <Card key={subject.id} className="group hover:shadow-medium transition-all cursor-pointer bg-gradient-card border-0">
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl mb-2 group-hover:scale-110 transition-transform`}>
                      {subject.icon}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{subject.name}</h3>
                    <div className="text-xs text-muted-foreground">
                      {completedInSubject}/{subjectLessons.length} lessons
                    </div>
                    <Progress 
                      value={(completedInSubject / subjectLessons.length) * 100} 
                      className="h-1 mt-2" 
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Recommended Lessons */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <p className="text-muted-foreground">Start your learning journey</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStart={() => onLessonStart(lesson)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}