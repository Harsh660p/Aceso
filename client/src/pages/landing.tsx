import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, TrendingUp, MessageSquare, Shield, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-20">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Aceso</h1>
              <p className="text-xs text-muted-foreground">by origin8</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setLocation("/login")} data-testid="button-login">
              Login
            </Button>
            <Button onClick={() => setLocation("/signup")} data-testid="button-signup">
              Get Started
            </Button>
          </div>
        </header>

        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Mental Wellness
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Your Personal
            <br />
            <span className="text-primary">Wellness Companion</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track your emotions, gain insights, and improve your mental wellbeing with AI-powered guidance from origin8
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => setLocation("/signup")} data-testid="button-get-started">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/about")} data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card data-testid="card-feature-journal">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-1/20 mb-4">
                <Brain className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle>AI Emotion Analysis</CardTitle>
              <CardDescription>
                Advanced AI analyzes your journal entries to identify emotions, themes, and patterns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-insights">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-2/20 mb-4">
                <TrendingUp className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle>Mood Insights</CardTitle>
              <CardDescription>
                Track your emotional journey with beautiful visualizations and actionable insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-assistant">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-3/20 mb-4">
                <MessageSquare className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle>AI Wellness Coach</CardTitle>
              <CardDescription>
                Chat with an empathetic AI companion trained to provide emotional support
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-strategies">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-4/20 mb-4">
                <Heart className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle>Coping Strategies</CardTitle>
              <CardDescription>
                Personalized techniques and exercises tailored to your emotional needs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-privacy">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-5/20 mb-4">
                <Shield className="h-6 w-6 text-chart-5" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your data is encrypted and secure. We never share your personal information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-support">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>24/7 Availability</CardTitle>
              <CardDescription>
                Access your wellness tools anytime, anywhere, whenever you need support
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="text-center space-y-8 py-12 bg-card/50 rounded-lg p-12">
          <h3 className="text-3xl font-bold text-foreground">Ready to start your wellness journey?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust Aceso by origin8 for their mental wellness
          </p>
          <Button size="lg" onClick={() => setLocation("/signup")} data-testid="button-cta-signup">
            Create Free Account
          </Button>
        </section>

        <footer className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>© 2025 origin8. All rights reserved.</p>
          <div className="flex gap-6 justify-center mt-4">
            <button
              className="hover:text-foreground cursor-pointer"
              onClick={() => setLocation("/about")}
              data-testid="link-about"
            >
              About Us
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
