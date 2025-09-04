import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Wifi, WifiOff } from "lucide-react";
import { User } from '@/lib/indexedDB';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleLogin = () => {
    if (!name.trim()) return;
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      role,
      email: `${name.toLowerCase()}@eguru.local`,
      language: 'English'
    };
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Eguru
            </h1>
            <p className="text-muted-foreground">Digital Learning for Everyone</p>
          </div>
        </div>

        {/* Offline Notice */}
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4 text-center">
            <WifiOff className="h-5 w-5 mx-auto text-warning mb-2" />
            <p className="text-sm text-warning/80">Offline Mode - All lessons work without internet</p>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Eguru</CardTitle>
            <CardDescription>Enter your details to start learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="space-y-3">
              <Label>I am a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={role === 'student' ? 'default' : 'outline'}
                  onClick={() => setRole('student')}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Student</span>
                </Button>
                <Button
                  variant={role === 'teacher' ? 'default' : 'outline'}
                  onClick={() => setRole('teacher')}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <Users className="h-5 w-5" />
                  <span>Teacher</span>
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!name.trim()}
              className="w-full bg-gradient-primary h-12"
            >
              Start Learning
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <Badge variant="secondary" className="mb-1">Offline First</Badge>
            <p className="text-muted-foreground">Works without internet</p>
          </div>
          <div>
            <Badge variant="secondary" className="mb-1">Multi-language</Badge>
            <p className="text-muted-foreground">Local language support</p>
          </div>
          <div>
            <Badge variant="secondary" className="mb-1">Progress Tracking</Badge>
            <p className="text-muted-foreground">Monitor your learning</p>
          </div>
        </div>
      </div>
    </div>
  );
}