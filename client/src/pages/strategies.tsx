import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wind, Heart, Move, Hand, Users, Palette, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { CopingStrategy } from "@shared/schema";

const categoryIcons = {
  breathing: Wind,
  meditation: Heart,
  movement: Move,
  grounding: Hand,
  social: Users,
  creative: Palette,
};

const categoryColors = {
  breathing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  meditation: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  movement: "bg-green-500/10 text-green-700 dark:text-green-400",
  grounding: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  social: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  creative: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
};

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function Strategies() {
  const { data: strategies, isLoading } = useQuery<CopingStrategy[]>({
    queryKey: ["/api/strategies"],
  });

  const personalizedStrategies = strategies?.filter((s) => s.personalizedReason) || [];
  const allStrategies = strategies || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Coping Strategies</h1>
          <p className="text-muted-foreground leading-relaxed">
            Personalized techniques to support your emotional wellbeing
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {personalizedStrategies.length > 0 && (
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle>Recommended For You</CardTitle>
                  </div>
                  <CardDescription>
                    Based on your recent emotional patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full" data-testid="accordion-personalized">
                    {personalizedStrategies.map((strategy, index) => {
                      const Icon = categoryIcons[strategy.category];
                      return (
                        <AccordionItem key={strategy.id} value={strategy.id}>
                          <AccordionTrigger className="hover-elevate px-4 rounded-md" data-testid={`accordion-trigger-personalized-${strategy.id}`}>
                            <div className="flex items-center gap-4 flex-1 text-left">
                              <div className={`p-2 rounded-md ${categoryColors[strategy.category]}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{strategy.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {strategy.personalizedReason}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline" className={difficultyColors[strategy.difficulty]}>
                                  {strategy.difficulty}
                                </Badge>
                                <Badge variant="secondary">{strategy.duration}</Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-4">
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {strategy.description}
                              </p>
                              <div>
                                <h4 className="font-medium mb-2">Steps:</h4>
                                <ol className="space-y-2 list-decimal list-inside">
                                  {strategy.steps.map((step, i) => (
                                    <li key={i} className="text-muted-foreground leading-relaxed">
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Strategies</CardTitle>
                <CardDescription>
                  Explore different techniques for emotional wellness
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allStrategies.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No strategies available. Start journaling to receive personalized recommendations.
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full" data-testid="accordion-all-strategies">
                    {allStrategies.map((strategy) => {
                      const Icon = categoryIcons[strategy.category];
                      return (
                        <AccordionItem key={strategy.id} value={strategy.id}>
                          <AccordionTrigger className="hover-elevate px-4 rounded-md" data-testid={`accordion-trigger-${strategy.id}`}>
                            <div className="flex items-center gap-4 flex-1 text-left">
                              <div className={`p-2 rounded-md ${categoryColors[strategy.category]}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{strategy.title}</div>
                                <div className="text-sm text-muted-foreground capitalize">
                                  {strategy.category} • {strategy.duration}
                                </div>
                              </div>
                              <Badge variant="outline" className={difficultyColors[strategy.difficulty]}>
                                {strategy.difficulty}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-4">
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {strategy.description}
                              </p>
                              <div>
                                <h4 className="font-medium mb-2">Steps:</h4>
                                <ol className="space-y-2 list-decimal list-inside">
                                  {strategy.steps.map((step, i) => (
                                    <li key={i} className="text-muted-foreground leading-relaxed">
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
