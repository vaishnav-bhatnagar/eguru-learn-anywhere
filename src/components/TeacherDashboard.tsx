import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, TrendingUp, Clock, Award, BarChart3, User, LogOut, Plus } from "lucide-react";
import { User as UserType, database } from '@/lib/indexedDB';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface TeacherDashboardProps {
  user: UserType;
}

interface StudentReport {
  id: string;
  name: string;
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  timeSpent: number;
  lastActive: string;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const { signOut, profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load sample analytics data for demo
      const sampleStudents = [
        { name: 'Raj Kumar', progress: 67, score: 85, time: 45 },
        { name: 'Priya Sharma', progress: 83, score: 92, time: 58 },
        { name: 'Amit Singh', progress: 50, score: 78, time: 32 },
        { name: 'Sunita Devi', progress: 75, score: 88, time: 52 }
      ];
      
      setStudents(sampleStudents);
      setAnalytics({
        totalStudents: sampleStudents.length,
        averageProgress: sampleStudents.reduce((acc, s) => acc + s.progress, 0) / sampleStudents.length,
        totalTime: sampleStudents.reduce((acc, s) => acc + s.time, 0)
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading teacher dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Eguru Teacher</h1>
              <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name || 'Teacher'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{analytics.totalStudents || 0}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="text-2xl font-bold">{Math.round(analytics.averageProgress || 0)}%</div>
              <div className="text-sm text-muted-foreground">Avg. Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-warning" />
              </div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Active Lessons</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-lesson-video/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-lesson-video" />
              </div>
              <div className="text-2xl font-bold">{analytics.totalTime || 0}h</div>
              <div className="text-sm text-muted-foreground">Total Study Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Student Reports */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Student Progress Overview
            </CardTitle>
            <CardDescription>Monitor individual student performance and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">Active student</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Progress</div>
                      <div className="font-medium">{student.progress}%</div>
                      <Progress value={student.progress} className="h-2 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground">Average Score</div>
                      <div className="font-medium">{student.score}%</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground">Time Spent</div>
                      <div className="font-medium">{student.time}h</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your classroom efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Lesson Content
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Student Groups
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Create Assessment Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest student progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                  <div>
                    <div className="font-medium">Priya Sharma</div>
                    <div className="text-sm text-muted-foreground">Completed Math Quiz with 95%</div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success">Excellent</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
                  <div>
                    <div className="font-medium">Raj Kumar</div>
                    <div className="text-sm text-muted-foreground">Started Science lesson</div>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}