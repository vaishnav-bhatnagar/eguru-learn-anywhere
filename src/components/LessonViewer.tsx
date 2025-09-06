import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle, 
  Clock,
  BookOpen,
  Award
} from "lucide-react";
import { Lesson, UserProgress, database, User } from '@/lib/indexedDB';
import { QuizComponent } from './QuizComponent';

interface LessonViewerProps {
  lesson: Lesson;
  user: User;
  onBack: () => void;
  onComplete?: () => void;
}

export function LessonViewer({ lesson, user, onBack, onComplete }: LessonViewerProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    loadProgress();
    
    // Simulate progress tracking
    const interval = setInterval(() => {
      if (isPlaying) {
        setTimeSpent(prev => prev + 1);
        setCurrentProgress(prev => Math.min(prev + (100 / (lesson.duration * 60)), 100));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lesson.id, user.id, isPlaying]);

  const loadProgress = async () => {
    try {
      const existingProgress = await database.getProgressByLesson(lesson.id, user.id);
      if (existingProgress) {
        setProgress(existingProgress);
        setCurrentProgress(existingProgress.progress);
        setTimeSpent(existingProgress.timeSpent * 60); // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const updateProgress = async (completed = false, quizScore?: number) => {
    try {
      const progressData: UserProgress = {
        id: `${user.id}-${lesson.id}`,
        userId: user.id,
        lessonId: lesson.id,
        completed,
        progress: completed ? 100 : currentProgress,
        timeSpent: Math.ceil(timeSpent / 60), // Convert seconds to minutes
        lastAccessed: new Date().toISOString(),
        quizScore
      };

      await database.updateProgress(progressData);
      setProgress(progressData);
      
      if (completed && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    if (lesson.type === 'quiz') {
      setShowQuiz(true);
    } else {
      setCurrentProgress(100);
      updateProgress(true);
    }
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    setCurrentProgress(100);
    updateProgress(true, score);
  };

  const renderContent = () => {
    if (showQuiz && lesson.type === 'quiz') {
      return (
        <QuizComponent
          lessonId={lesson.id}
          onComplete={handleQuizComplete}
          onBack={() => setShowQuiz(false)}
        />
      );
    }

    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-lesson-video/10 to-lesson-video/5 border-lesson-video/20">
              <CardContent className="p-8 text-center">
                <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <video controls style={{ width: '100%', height: '100%' }}>
                    <source src={lesson.content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <h3 className="text-xl font-semibold mb-2">Video Lesson</h3>
                <p className="text-muted-foreground mb-6">Watch the lesson content</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'audio':
        return (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-lesson-audio/10 to-lesson-audio/5 border-lesson-audio/20">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-lesson-audio/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-12 w-12 text-lesson-audio" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Audio Lesson</h3>
                <p className="text-muted-foreground mb-6">Listen to the lesson content</p>
                <audio controls style={{ width: '100%' }}>
                  <source src={lesson.content} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Lesson Content</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This is where the text content of the lesson would be displayed. 
                    The content would be loaded from the lesson data and rendered here 
                    with proper formatting and styling for optimal readability.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Interactive elements, images, and formatted text would make the 
                    learning experience engaging even in offline mode.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-lesson-quiz/10 to-lesson-quiz/5 border-lesson-quiz/20">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-lesson-quiz/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-12 w-12 text-lesson-quiz" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Quiz</h3>
                <p className="text-muted-foreground mb-6">Test your knowledge with this quiz</p>
                <Button
                  onClick={() => setShowQuiz(true)}
                  className="bg-lesson-quiz hover:bg-lesson-quiz/90"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <div>Unsupported lesson type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{lesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Badge variant="secondary" className="text-xs">
                  {lesson.subject}
                </Badge>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{lesson.duration} min</span>
                </div>
              </div>
            </div>
          </div>
          {progress?.completed && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4" />
              Completed
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <Card className="mb-6 bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>Time spent: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
              <span>Duration: {lesson.duration} minutes</span>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Description */}
        <Card className="mb-6 bg-gradient-card border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{lesson.title}</CardTitle>
            <CardDescription className="text-base">
              {lesson.description}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Lesson Content */}
        <div className="space-y-6">
          {renderContent()}
          
          {!showQuiz && (
            <div className="flex justify-center">
              <Button
                onClick={handleComplete}
                disabled={currentProgress < 80}
                className="bg-gradient-success px-8 py-2"
              >
                {lesson.type === 'quiz' ? 'Take Quiz' : 'Mark as Complete'}
                {progress?.completed ? (
                  <CheckCircle className="h-4 w-4 ml-2" />
                ) : (
                  <Award className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}