import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mic, MicOff, FileText, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { JournalEntry, InsertJournalEntry } from "@shared/schema";

export default function Journal() {
  const [, setLocation] = useLocation();
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [textContent, setTextContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<JournalEntry | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEntryMutation = useMutation({
    mutationFn: async (data: InsertJournalEntry) => {
      return await apiRequest<JournalEntry>("POST", "/api/journal", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      setAnalysisResult(data);
      setTextContent("");
      toast({
        title: "Entry saved",
        description: "Your journal entry has been analyzed and saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTextContent((prev) => {
          const withoutInterim = prev.replace(/\[.*\]$/, '').trim();
          const newText = withoutInterim + (finalTranscript ? ' ' + finalTranscript : '');
          return interimTranscript ? newText + ` [${interimTranscript}]` : newText.trim();
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);
        
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    setTextContent((prev) => prev.replace(/\[.*\]$/, '').trim());
  };

  const handleSubmit = () => {
    const content = textContent.trim();
    
    if (!content) {
      toast({
        title: "Empty entry",
        description: "Please write or record something before submitting.",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      content,
      inputMode,
      emotions: null,
      moodRating: null,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Analysis Complete</h2>
            <Button
              variant="ghost"
              onClick={() => setAnalysisResult(null)}
              data-testid="button-new-entry"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>

          <Card data-testid="card-analysis-result">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>AI Analysis Complete</CardTitle>
              </div>
              <CardDescription>
                Here's what I detected from your entry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Your Entry</h3>
                <p className="text-foreground leading-relaxed bg-muted p-4 rounded-md" data-testid="text-analyzed-entry">
                  {analysisResult.content}
                </p>
              </div>

              {analysisResult.emotions && (
                <>
                  <div>
                    <h3 className="font-medium mb-3">Detected Emotions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary text-primary-foreground text-base px-3 py-1" data-testid="badge-primary-emotion">
                        {analysisResult.emotions.primaryEmotion}
                      </Badge>
                      {analysisResult.emotions.secondaryEmotions?.map((emotion, idx) => (
                        <Badge key={emotion} variant="secondary" className="text-base px-3 py-1" data-testid={`badge-secondary-emotion-${idx}`}>
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Sentiment</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize" data-testid="badge-sentiment">
                          {analysisResult.emotions.sentiment}
                        </Badge>
                        <span className="text-sm text-muted-foreground" data-testid="text-confidence">
                          {(analysisResult.emotions.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <Progress value={analysisResult.emotions.confidence * 100} data-testid="progress-confidence" />
                    </div>
                  </div>

                  {analysisResult.emotions.summary && (
                    <div>
                      <h3 className="font-medium mb-2">Summary</h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid="text-summary">
                        {analysisResult.emotions.summary}
                      </p>
                    </div>
                  )}

                  {analysisResult.emotions.themes && analysisResult.emotions.themes.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.emotions.themes.map((theme, idx) => (
                          <Badge key={theme} variant="outline" data-testid={`badge-theme-${idx}`}>
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setLocation("/insights")}
                  className="flex-1"
                  data-testid="button-view-insights"
                >
                  View Insights
                </Button>
                <Button
                  onClick={() => setLocation("/strategies")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-view-strategies"
                >
                  Get Coping Strategies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Journal Entry</h1>
          <p className="text-muted-foreground leading-relaxed">
            Express your thoughts and feelings through voice or text
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>
              Choose your preferred input method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "text" | "voice")} data-testid="tabs-input-mode">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" data-testid="tab-input-text">
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="voice" data-testid="tab-input-voice">
                  <Mic className="h-4 w-4 mr-2" />
                  Voice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Write about your day, thoughts, or feelings..."
                  className="min-h-[200px] resize-none text-base leading-relaxed"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  data-testid="input-journal-text"
                />
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <div className="flex flex-col items-center gap-6 py-8">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className={`h-32 w-32 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    data-testid="button-voice-toggle"
                  >
                    {isRecording ? (
                      <MicOff className="h-12 w-12" />
                    ) : (
                      <Mic className="h-12 w-12" />
                    )}
                  </Button>
                  
                  {isRecording && (
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-semibold text-destructive">
                        {formatTime(recordingTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recording... Click to stop
                      </p>
                    </div>
                  )}

                  {!isRecording && textContent && (
                    <div className="w-full">
                      <p className="text-sm font-medium mb-2">Transcript:</p>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-foreground leading-relaxed">
                          {textContent}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSubmit}
              disabled={createEntryMutation.isPending || !textContent.trim()}
              className="w-full"
              size="lg"
              data-testid="button-submit-entry"
            >
              {createEntryMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Save & Analyze Entry
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
