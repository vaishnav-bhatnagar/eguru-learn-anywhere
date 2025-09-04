import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Trophy,
  RotateCcw,
  Lightbulb
} from "lucide-react";
import { Quiz, QuizQuestion, database } from '@/lib/indexedDB';
import { sampleQuizzes } from '@/data/sampleLessons';

interface QuizComponentProps {
  lessonId: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizComponent({ lessonId, onComplete, onBack }: QuizComponentProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      
      // Try to get quiz from database
      let quizData = await database.getQuizByLesson(lessonId);
      
      // If not found, use sample quiz
      if (!quizData) {
        const sampleQuiz = sampleQuizzes.find(q => q.lessonId === lessonId);
        if (sampleQuiz) {
          await database.addQuiz(sampleQuiz);
          quizData = sampleQuiz;
        }
      }
      
      if (quizData) {
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(null));
      }
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setIsAnswered(answers[currentQuestionIndex + 1] !== null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      calculateAndShowResults();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setIsAnswered(answers[currentQuestionIndex - 1] !== null);
      setShowExplanation(false);
    }
  };

  const calculateAndShowResults = () => {
    if (!quiz) return;
    
    const correctAnswers = answers.reduce((correct, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? correct + 1 : correct;
    }, 0);
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    setShowResult(true);
    
    // Call completion callback after a delay to show results first
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(quiz?.questions.length || 0).fill(null));
    setShowResult(false);
    setShowExplanation(false);
    setIsAnswered(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-8 text-center">
          <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The quiz for this lesson is not available.
          </p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    const correctAnswers = answers.reduce((correct, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? correct + 1 : correct;
    }, 0);
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-8 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= 80 ? 'bg-success/10' : score >= 60 ? 'bg-warning/10' : 'bg-destructive/10'
          }`}>
            <Trophy className={`h-12 w-12 ${
              score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-destructive'
            }`} />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-lg mb-4">Your Score: {score}%</p>
          <p className="text-muted-foreground mb-6">
            You got {correctAnswers} out of {quiz.questions.length} questions correct.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={restartQuiz} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={onBack} className="bg-gradient-primary">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Quiz Progress */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrectness = isAnswered;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  isSelected && !showCorrectness
                    ? 'border-primary bg-primary/5'
                    : showCorrectness && isCorrect
                    ? 'border-success bg-success/5 text-success'
                    : showCorrectness && isSelected && !isCorrect
                    ? 'border-destructive bg-destructive/5 text-destructive'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showCorrectness && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && currentQuestion.explanation && (
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h4 className="font-semibold text-success mb-2">Explanation</h4>
                <p className="text-sm text-success/80">{currentQuestion.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {!isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-gradient-primary"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-gradient-primary"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}