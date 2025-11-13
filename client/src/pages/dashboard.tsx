import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic, MessageSquare, TrendingUp, Calendar, Heart, Brain } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { JournalEntry, MoodInsight } from "@shared/schema";

export default function Dashboard() {
  const { data: entries, isLoading: entriesLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal"],
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<MoodInsight>({
    queryKey: ["/api/insights"],
  });

  const todayEntries = entries?.filter(
    (entry) => new Date(entry.timestamp).toDateString() === new Date().toDateString()
  ) || [];

  const recentEntries = entries?.slice(0, 5) || [];

  const getMoodColor = (rating: number | null | undefined) => {
    if (!rating) return "bg-muted";
    if (rating >= 4) return "bg-green-500/20 text-green-700 dark:text-green-400";
    if (rating >= 3) return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    if (rating >= 2) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    return "bg-red-500/20 text-red-700 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            How are you feeling today?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-elevate" data-testid="card-today-entries">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Today's Entries</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold" data-testid="text-today-count">{todayEntries.length}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {todayEntries.length === 0 ? "Start your day with a journal entry" : "Keep it up!"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-weekly-average">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Weekly Average</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-semibold" data-testid="text-weekly-average">
                    {insights?.weeklyAverage?.toFixed(1) || "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insights?.trend === "improving" && "Trending upward"}
                    {insights?.trend === "stable" && "Staying steady"}
                    {insights?.trend === "declining" && "Needs attention"}
                    {!insights?.trend && "Track your mood"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-streak">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Streak</CardTitle>
              <Heart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-semibold" data-testid="text-streak-days">
                    {insights?.streakDays || 0} days
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insights?.streakDays && insights.streakDays > 0 ? "Great consistency!" : "Start your journey"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/journal">
              <Button
                variant="default"
                className="w-full h-auto py-6 flex flex-col items-center gap-3"
                data-testid="button-journal"
              >
                <Mic className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium text-base">Record Your Feelings</div>
                  <div className="text-sm opacity-90 font-normal">Voice or text entry</div>
                </div>
              </Button>
            </Link>

            <Link href="/assistant">
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex flex-col items-center gap-3"
                data-testid="button-assistant"
              >
                <MessageSquare className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium text-base">Talk to AI Assistant</div>
                  <div className="text-sm opacity-75 font-normal">Get emotional support</div>
                </div>
              </Button>
            </Link>

            <Link href="/insights">
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex flex-col items-center gap-3"
                data-testid="button-insights"
              >
                <Brain className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium text-base">View Progress</div>
                  <div className="text-sm opacity-75 font-normal">Track your journey</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Recent Entries</h2>
          {entriesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentEntries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No journal entries yet. Start by recording your thoughts and feelings.
                </p>
                <Link href="/journal">
                  <Button className="mt-4" data-testid="button-create-first-entry">
                    Create Your First Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <Card key={entry.id} className="hover-elevate" data-testid={`card-entry-${entry.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium" data-testid={`text-entry-date-${entry.id}`}>
                          {format(new Date(entry.timestamp), "EEEE, MMMM d, yyyy")}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {format(new Date(entry.timestamp), "h:mm a")} • {entry.inputMode === "voice" ? "Voice" : "Text"} entry
                        </CardDescription>
                      </div>
                      {entry.moodRating && (
                        <Badge variant="secondary" className={getMoodColor(entry.moodRating)} data-testid={`badge-mood-${entry.id}`}>
                          Mood: {entry.moodRating}/5
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed line-clamp-3" data-testid={`text-entry-content-${entry.id}`}>
                      {entry.content}
                    </p>
                    {entry.emotions && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary" data-testid={`badge-primary-emotion-${entry.id}`}>
                          {entry.emotions.primaryEmotion}
                        </Badge>
                        {entry.emotions.secondaryEmotions?.slice(0, 3).map((emotion, idx) => (
                          <Badge key={emotion} variant="outline" data-testid={`badge-secondary-emotion-${entry.id}-${idx}`}>
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
