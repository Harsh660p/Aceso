import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Bot, User, Loader2, ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import { Link } from "wouter";
import type { AssistantMessage } from "@shared/schema";
import Vapi from "@vapi-ai/web";

export default function Assistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI wellness companion. I'm here to provide emotional support and guidance. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCallConnecting, setIsCallConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const vapiRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const vapiApiKey = import.meta.env.VITE_VAPI_API_KEY;
    if (vapiApiKey) {
      vapiRef.current = new Vapi(vapiApiKey);

      vapiRef.current.on('call-start', () => {
        setIsCallActive(true);
        setIsCallConnecting(false);
        toast({
          title: "Call started",
          description: "You're now connected to your wellness assistant",
        });
      });

      vapiRef.current.on('call-end', () => {
        setIsCallActive(false);
        setIsCallConnecting(false);
        setIsMuted(false);
        setVolumeLevel(0);
        toast({
          title: "Call ended",
          description: "Your voice session has ended",
        });
      });

      vapiRef.current.on('speech-start', () => {
        console.log('Assistant speaking');
      });

      vapiRef.current.on('speech-end', () => {
        console.log('Assistant finished speaking');
      });

      vapiRef.current.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiRef.current.on('message', (message: any) => {
        console.log('Vapi message:', message);
        if (message.type === 'transcript' && message.role === 'user') {
          const userMessage: AssistantMessage = {
            id: `${Date.now()}-user-voice`,
            role: 'user',
            content: message.transcript,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, userMessage]);
        } else if (message.type === 'transcript' && message.role === 'assistant') {
          const assistantMessage: AssistantMessage = {
            id: `${Date.now()}-assistant-voice`,
            role: 'assistant',
            content: message.transcript,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      });

      vapiRef.current.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setIsCallActive(false);
        setIsCallConnecting(false);
        toast({
          title: "Call error",
          description: error.message || "An error occurred during the call",
          variant: "destructive",
        });
      });
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [toast]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest<{ response: string }>("POST", "/api/assistant", {
        message,
        conversationHistory: messages.slice(-5),
      });
    },
    onSuccess: (data, userMessage) => {
      const assistantMessage: AssistantMessage = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (!message) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    chatMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast({
          title: "Not supported",
          description: "Voice input is not supported in your browser.",
          variant: "destructive",
        });
      }
    }
  };

  const startVoiceCall = async () => {
    if (!vapiRef.current) {
      toast({
        title: "Voice assistant not available",
        description: "Vapi AI is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsCallConnecting(true);

    try {
      await vapiRef.current.start({
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a compassionate mental health and emotional wellness AI companion. Your role is to provide empathetic support, active listening, and gentle guidance to users dealing with emotional challenges, stress, anxiety, or general mental wellness needs. Always be non-judgmental, validating, and supportive. If a user expresses thoughts of self-harm or crisis, encourage them to seek professional help immediately and provide crisis resources. Keep responses conversational, warm, and accessible."
            }
          ]
        },
        voice: {
          provider: "openai",
          voiceId: "nova"
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2"
        },
        name: "Wellness Companion"
      });
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setIsCallConnecting(false);
      toast({
        title: "Failed to start call",
        description: error.message || "Could not connect to voice assistant",
        variant: "destructive",
      });
    }
  };

  const endVoiceCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current && isCallActive) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">AI Wellness Assistant</h1>
          <p className="text-muted-foreground leading-relaxed">
            Get emotional support and guidance through conversation
          </p>
        </div>

        <Card className="h-[calc(100vh-16rem)]">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Wellness Companion</CardTitle>
                  <CardDescription>
                    Always here to listen and support
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isCallActive && (
                  <Badge variant="default" className="gap-1" data-testid="badge-call-active">
                    <Volume2 className="h-3 w-3" />
                    Voice Active
                  </Badge>
                )}
                {!isCallActive && !isCallConnecting && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={startVoiceCall}
                    className="gap-2"
                    data-testid="button-start-voice-call"
                  >
                    <Phone className="h-4 w-4" />
                    Voice Call
                  </Button>
                )}
                {isCallConnecting && (
                  <Button variant="default" size="sm" disabled data-testid="button-voice-connecting">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </Button>
                )}
                {isCallActive && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleMute}
                      className={isMuted ? "bg-destructive/10" : ""}
                      data-testid="button-toggle-mute"
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={endVoiceCall}
                      className="gap-2"
                      data-testid="button-end-voice-call"
                    >
                      <PhoneOff className="h-4 w-4" />
                      End Call
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                    data-testid={`message-${message.id}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex-1 max-w-[80%] ${
                        message.role === "user" ? "items-end" : "items-start"
                      } flex flex-col gap-1`}
                    >
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                        data-testid={`text-message-content-${message.id}`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground px-2">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {chatMutation.isPending && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={isListening ? "bg-destructive text-destructive-foreground" : ""}
                  data-testid="button-voice-input"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={chatMutation.isPending}
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={chatMutation.isPending || !inputMessage.trim()}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
