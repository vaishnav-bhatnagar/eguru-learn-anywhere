import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, Headphones, FileText, CheckCircle, Clock } from "lucide-react";
import { Lesson, UserProgress } from "@/lib/indexedDB";

interface LessonCardProps {
  lesson: Lesson;
  progress?: UserProgress;
  onStart: () => void;
  className?: string;
}

const typeIcons = {
  video: Play,
  audio: Headphones,
  text: FileText,
  quiz: BookOpen
};

const typeColors = {
  video: 'lesson-video',
  audio: 'lesson-audio', 
  text: 'lesson-text',
  quiz: 'lesson-quiz'
};

export function LessonCard({ lesson, progress, onStart, className }: LessonCardProps) {
  const Icon = typeIcons[lesson.type];
  const isCompleted = progress?.completed ?? false;
  const progressPercent = progress?.progress ?? 0;

  return (
    <Card className={`group hover:shadow-medium transition-all duration-300 cursor-pointer bg-gradient-card border-0 ${className}`} onClick={onStart}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${typeColors[lesson.type]}/10 text-${typeColors[lesson.type]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                {lesson.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {lesson.subject}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs border-${typeColors[lesson.type]} text-${typeColors[lesson.type]}`}
                >
                  {lesson.type}
                </Badge>
              </div>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {lesson.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration} min</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {lesson.level}
          </Badge>
        </div>

        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <Button 
          className={`w-full transition-all duration-300 ${
            isCompleted 
              ? 'bg-success hover:bg-success/90' 
              : 'bg-gradient-primary hover:shadow-medium'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
        >
          {isCompleted ? 'Review Lesson' : 'Start Learning'}
        </Button>
      </CardContent>
    </Card>
  );
}