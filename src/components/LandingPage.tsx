import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Wifi, WifiOff, Play, CheckCircle, Star, Globe } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: WifiOff,
      title: "Offline-First Learning",
      description: "Access all lessons and content without internet connection after initial download"
    },
    {
      icon: BookOpen,
      title: "Interactive Content",
      description: "Video lessons, audio files, and engaging quizzes for comprehensive learning"
    },
    {
      icon: Users,
      title: "Teacher Dashboard",
      description: "Track student progress, manage content, and monitor learning analytics"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Learn in your preferred language with localized content"
    }
  ];

  const stats = [
  { label: "Students Served", value: "0" },
  { label: "Lessons Available", value: "0" },
  { label: "Success Rate", value: "0%" },
  { label: "Rural Areas", value: "0" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Eguru
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={onGetStarted} className="bg-gradient-primary">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="mb-4">
            🚀 Empowering Rural Education
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Digital Learning for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Offline-first educational platform designed for rural students with poor 
            internet connectivity. Access quality education anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-primary h-12 px-8"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8">
              <Users className="mr-2 h-5 w-5" />
              For Teachers
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Eguru?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built specifically for rural education challenges with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Educators
            </h2>
            <p className="text-xl text-muted-foreground">
              See what teachers and students say about Eguru
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Vaishnav Bhatnagar",
                role: "Student's Guardian",
                content: "Eguru has transformed how my brother learns. He can now access quality content even without internet.",
                rating: 5
              },
              {
                name: "Saurav Kumar",
                role: "Student",
                content: "I can study anytime now! The offline feature helps me learn even when there's no internet at home.",
                rating: 5
              },
              {
                name: "Kartikey Pandey",
                role: "Teacher",
                content: "The progress tracking features help us monitor student development across multiple villages.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students and teachers already using Eguru for better learning outcomes.
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-gradient-primary h-12 px-8"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">Eguru</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering rural education through offline-first digital learning.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>For Students</li>
                <li>For Teachers</li>
                <li>Offline Mode</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Eguru. All rights reserved. Built for rural education.
          </div>
        </div>
      </footer>
    </div>
  );
}