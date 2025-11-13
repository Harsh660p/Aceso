import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Calendar, Heart, Brain } from "lucide-react";
import { Link } from "wouter";
import type { JournalEntry, MoodInsight } from "@shared/schema";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

export default function Insights() {
  const { data: entries, isLoading: entriesLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal"],
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<MoodInsight>({
    queryKey: ["/api/insights"],
  });

  const getMoodTrendData = () => {
    if (!entries) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayEntries = entries.filter(
        (e) => new Date(e.timestamp).toDateString() === date.toDateString()
      );
      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + (e.moodRating || 0), 0) / dayEntries.length
        : 0;

      return {
        date: format(date, "EEE"),
        mood: avgMood ? parseFloat(avgMood.toFixed(1)) : 0,
        entries: dayEntries.length,
      };
    });

    return last7Days;
  };

  const getEmotionDistributionData = () => {
    if (!insights?.emotionDistribution) return [];
    
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];

    return Object.entries(insights.emotionDistribution)
      .map(([emotion, count], index) => ({
        name: emotion,
        value: count,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getTrendIcon = () => {
    if (!insights?.trend) return <Minus className="h-5 w-5" />;
    if (insights.trend === "improving") return <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />;
    if (insights.trend === "declining") return <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />;
    return <Minus className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
  };

  const moodTrendData = getMoodTrendData();
  const emotionDistributionData = getEmotionDistributionData();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Mental Health Insights</h1>
          <p className="text-muted-foreground leading-relaxed">
            Track your emotional patterns and progress over time
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card data-testid="card-insights-weekly">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Weekly Average</CardTitle>
              {getTrendIcon()}
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-semibold">
                    {insights?.weeklyAverage?.toFixed(1) || "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {insights?.trend || "No data yet"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-insights-total">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Entries</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-semibold">
                    {insights?.totalEntries || 0}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Journal entries recorded
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-insights-consistency">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Consistency</CardTitle>
              <Heart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-semibold">
                    {insights?.streakDays || 0} days
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current streak
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="mood" className="space-y-6" data-testid="tabs-insights">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="mood" data-testid="tab-insights-mood">
              <Brain className="h-4 w-4 mr-2" />
              Mood Trends
            </TabsTrigger>
            <TabsTrigger value="emotions" data-testid="tab-insights-emotions">
              <Heart className="h-4 w-4 mr-2" />
              Emotions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Mood Trend</CardTitle>
                <CardDescription>
                  Your average mood rating over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entriesLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : moodTrendData.length === 0 || moodTrendData.every(d => d.mood === 0) ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No mood data available yet. Start journaling to see your trends.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={moodTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="date"
                        className="text-sm"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        className="text-sm"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Mood Rating"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>
                  Number of journal entries per day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entriesLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={moodTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="date"
                        className="text-sm"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        className="text-sm"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="entries"
                        fill="hsl(var(--chart-2))"
                        radius={[4, 4, 0, 0]}
                        name="Entries"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Emotion Distribution</CardTitle>
                  <CardDescription>
                    Most common emotions detected in your entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {insightsLoading || !emotionDistributionData.length ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      {insightsLoading ? (
                        <Skeleton className="h-[300px] w-full" />
                      ) : (
                        "No emotion data available yet."
                      )}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={emotionDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {emotionDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Emotions</CardTitle>
                  <CardDescription>
                    Your most frequent emotional states
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {insightsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : !emotionDistributionData.length ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No emotion data available yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {emotionDistributionData.slice(0, 5).map((emotion, index) => (
                        <div
                          key={emotion.name}
                          className="flex items-center justify-between p-3 rounded-md bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: emotion.color }}
                            />
                            <span className="font-medium capitalize">{emotion.name}</span>
                          </div>
                          <Badge variant="secondary">{emotion.value} times</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
