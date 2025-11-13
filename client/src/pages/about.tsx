import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Users, Sparkles, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">About Aceso</h1>
            <p className="text-muted-foreground mt-2">Built with care by origin8</p>
          </div>
        </div>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                At origin8, we believe mental wellness should be accessible, personalized, and judgment-free.
                Aceso combines cutting-edge AI technology with evidence-based therapeutic approaches to provide
                everyone with a compassionate companion on their wellness journey.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-2/20">
                  <Target className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle className="text-2xl">What We Do</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">AI-Powered Emotion Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced AI models analyze your journal entries to identify emotional patterns,
                  themes, and sentiment, helping you gain deeper insights into your mental state.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Personalized Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your emotional journey over time with beautiful visualizations and actionable
                  insights tailored to your unique wellness path.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">24/7 AI Companion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chat with an empathetic AI wellness coach trained to provide emotional support,
                  coping strategies, and encouragement whenever you need it.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-4/20">
                  <Users className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle className="text-2xl">The origin8 Team</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                We are origin8 - a passionate team of developers, designers, and mental health advocates
                dedicated to making wellness technology that truly makes a difference. Our multidisciplinary
                approach combines expertise in AI, psychology, and user experience to create tools that
                support your mental health journey with empathy and innovation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Why Aceso?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Named after the Greek goddess of healing and wellness, Aceso represents our commitment
                to helping you achieve holistic mental health. Just as Aceso symbolized the healing process
                itself, our platform guides you through your personal journey of self-discovery and emotional growth.
              </p>
              <p>
                We believe that everyone deserves access to mental wellness support that is private, accessible,
                and free from judgment. Aceso by origin8 is our contribution to making that vision a reality.
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="text-center py-8 space-y-4">
          <h3 className="text-2xl font-semibold">Ready to begin your wellness journey?</h3>
          <Button size="lg" onClick={() => setLocation("/signup")} data-testid="button-get-started">
            Get Started Today
          </Button>
        </div>

        <footer className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>© 2025 origin8. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
