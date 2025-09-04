import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  BarChart3,
  Calendar,
  Download,
  Plus,
  Eye
} from "lucide-react";
import { User, UserProgress, Lesson, database } from '@/lib/indexedDB';

interface TeacherDashboardProps {
  user: User;
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
  const [students] = useState<StudentReport[]>([
    {
      id: '1',
      name: 'Raj Kumar',
      totalLessons: 12,
      completedLessons: 8,
      averageScore: 85,
      timeSpent: 45,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      totalLessons: 12,
      completedLessons: 10,
      averageScore: 92,
      timeSpent: 58,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Amit Singh',
      totalLessons: 12,
      completedLessons: 6,
      averageScore: 78,
      timeSpent: 32,
      lastActive: '3 days ago'
    },
    {
      id: '4',
      name: 'Sunita Devi',
      totalLessons: 12,
      completedLessons: 9,
      averageScore: 88,
      timeSpent: 52,
      lastActive: '5 hours ago'
    }
  ]);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      await database.init();
      const allLessons = await database.getAllLessons();
      setLessons(allLessons);
    } catch (error) {
      console.error('Failed to load teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.lastActive.includes('hours') || s.lastActive.includes('1 day')).length;
  const averageCompletion = students.reduce((acc, s) => acc + (s.completedLessons / s.totalLessons * 100), 0) / students.length;
  const totalTimeSpent = students.reduce((acc, s) => acc + s.timeSpent, 0);

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
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-primary-foreground/80 mt-1">
                Monitor and guide your students' learning journey
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                  <div className="text-xs text-success mt-1">{activeStudents} active today</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div className="text-2xl font-bold">{averageCompletion.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Avg. Completion</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
                    <BookOpen className="h-6 w-6 text-warning" />
                  </div>
                  <div className="text-2xl font-bold">{lessons.length}</div>
                  <div className="text-sm text-muted-foreground">Total Lessons</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-lesson-video/10 rounded-full mx-auto mb-2">
                    <Award className="h-6 w-6 text-lesson-video" />
                  </div>
                  <div className="text-2xl font-bold">{totalTimeSpent}h</div>
                  <div className="text-sm text-muted-foreground">Total Study Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Student Activity
                </CardTitle>
                <CardDescription>Latest student progress and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                    <div>
                      <div className="font-medium">Priya Sharma</div>
                      <div className="text-sm text-muted-foreground">Completed "Introduction to Science" with 95% score</div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success">Excellent</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <div>
                      <div className="font-medium">Raj Kumar</div>
                      <div className="text-sm text-muted-foreground">Started "Mathematical Quiz - Basic Operations"</div>
                    </div>
                    <Badge className="bg-warning/10 text-warning border-warning">In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <div className="font-medium">Sunita Devi</div>
                      <div className="text-sm text-muted-foreground">Watched "English Alphabet Sounds" lesson</div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary">Watched</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Student Progress Report</CardTitle>
                <CardDescription>Detailed view of individual student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">Last active: {student.lastActive}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Progress</div>
                          <div className="font-medium">{student.completedLessons}/{student.totalLessons} lessons</div>
                          <Progress value={(student.completedLessons / student.totalLessons) * 100} className="h-2 mt-1" />
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Average Score</div>
                          <div className="font-medium">{student.averageScore}%</div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Time Spent</div>
                          <div className="font-medium">{student.timeSpent}h</div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Status</div>
                          <Badge variant={student.lastActive.includes('hours') ? 'default' : 'secondary'}>
                            {student.lastActive.includes('hours') ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage lessons, quizzes, and educational content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload and manage your educational content when online
                  </p>
                  <Button className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Learning Analytics
                </CardTitle>
                <CardDescription>Detailed insights into student learning patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed charts and insights will be available when connected to backend
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}