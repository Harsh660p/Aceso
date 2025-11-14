import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Heart, Move, Hand, Sparkles, Play, Pause, RotateCcw, Check, Circle } from "lucide-react";
import type { CopingStrategy } from "@shared/schema";

const categoryIcons = {
  breathing: Wind,
  meditation: Heart,
  movement: Move,
  grounding: Hand,
};

const categoryColors = {
  breathing: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  meditation: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  movement: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  grounding: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
};

function useTimer(duration: number, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevDurationRef = useRef(duration);

  useEffect(() => {
    if (duration !== prevDurationRef.current && !isRunning) {
      prevDurationRef.current = duration;
      setTimeLeft(duration);
    }
  }, [duration, isRunning]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };
  const restart = () => {
    setTimeLeft(duration);
    setIsRunning(true);
  };

  return { timeLeft, isRunning, start, pause, reset, restart, progress: ((duration - timeLeft) / duration) * 100 };
}

function BreathingExercise() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phaseTime, setPhaseTime] = useState(0);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhaseTime(prev => {
        if (prev >= phaseDurations[phase]) {
          const nextPhase = phase === 'inhale' ? 'hold' : 
                          phase === 'hold' ? 'exhale' : 
                          phase === 'exhale' ? 'rest' : 'inhale';
          
          if (phase === 'rest') {
            setCycleCount(c => c + 1);
          }
          
          setPhase(nextPhase);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, phase, phaseTime]);

  const getCircleScale = () => {
    if (phase === 'inhale') return 0.5 + (phaseTime / phaseDurations.inhale) * 0.5;
    if (phase === 'exhale') return 1 - (phaseTime / phaseDurations.exhale) * 0.5;
    return phase === 'hold' ? 1 : 0.5;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-blue-500';
      case 'hold': return 'bg-purple-500';
      case 'exhale': return 'bg-green-500';
      case 'rest': return 'bg-orange-500';
    }
  };

  return (
    <Card className="border-blue-500/20" data-testid="card-breathing-exercise">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-blue-500/10">
            <Wind className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Deep Breathing</CardTitle>
            <CardDescription>Follow the visual guide to regulate your breath</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div 
              className={`absolute rounded-full ${getPhaseColor()} transition-all duration-200`}
              style={{
                width: `${getCircleScale() * 200}px`,
                height: `${getCircleScale() * 200}px`,
                opacity: 0.3,
              }}
              data-testid="breathing-circle"
            />
            <div 
              className={`absolute rounded-full ${getPhaseColor()} transition-all duration-200`}
              style={{
                width: `${getCircleScale() * 160}px`,
                height: `${getCircleScale() * 160}px`,
                opacity: 0.5,
              }}
            />
            <div 
              className={`absolute rounded-full ${getPhaseColor()} flex items-center justify-center transition-all duration-200`}
              style={{
                width: `${getCircleScale() * 120}px`,
                height: `${getCircleScale() * 120}px`,
              }}
            >
              <span className="text-white font-semibold text-lg capitalize" data-testid="text-breathing-phase">
                {phase}
              </span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-2xl font-semibold text-foreground" data-testid="text-breathing-count">
              {Math.ceil(phaseDurations[phase] - phaseTime)}s
            </p>
            <p className="text-muted-foreground">Cycles completed: {cycleCount}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button onClick={() => setIsActive(true)} data-testid="button-breathing-start">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={() => setIsActive(false)} variant="secondary" data-testid="button-breathing-pause">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => {
              setIsActive(false);
              setPhase('inhale');
              setPhaseTime(0);
              setCycleCount(0);
            }}
            data-testid="button-breathing-reset"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="p-4 rounded-md bg-muted/50 space-y-2">
          <p className="text-sm font-medium">How it works:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Breathe in for 4 seconds</li>
            <li>• Hold for 4 seconds</li>
            <li>• Breathe out for 6 seconds</li>
            <li>• Rest for 2 seconds</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function BoxBreathing() {
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const phaseDuration = 4;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhaseTime(prev => {
        if (prev >= phaseDuration) {
          const nextPhase = phase === 'inhale' ? 'hold1' : 
                          phase === 'hold1' ? 'exhale' : 
                          phase === 'exhale' ? 'hold2' : 'inhale';
          
          if (phase === 'hold2') {
            setRounds(r => r + 1);
          }
          
          setPhase(nextPhase);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getBoxPosition = () => {
    const progress = phaseTime / phaseDuration;
    switch (phase) {
      case 'inhale': return { top: `${100 - progress * 100}%`, left: '0%' };
      case 'hold1': return { top: '0%', left: `${progress * 100}%` };
      case 'exhale': return { top: `${progress * 100}%`, left: '100%' };
      case 'hold2': return { top: '100%', left: `${100 - progress * 100}%` };
    }
  };

  return (
    <Card className="border-purple-500/20" data-testid="card-box-breathing">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-purple-500/10">
            <Circle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Box Breathing</CardTitle>
            <CardDescription>Equal breathing for calm and focus</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="relative w-64 h-64 border-2 border-purple-500/30 rounded-lg">
            <div 
              className="absolute w-4 h-4 bg-purple-500 rounded-full transition-all duration-100"
              style={{
                ...getBoxPosition(),
                transform: 'translate(-50%, -50%)',
              }}
              data-testid="box-breathing-dot"
            />
            <div className="absolute top-0 left-0 w-full flex justify-between p-2">
              <span className="text-xs text-muted-foreground">Hold</span>
              <span className="text-xs text-muted-foreground">Hold</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full flex justify-between p-2">
              <span className="text-xs text-muted-foreground">Inhale</span>
              <span className="text-xs text-muted-foreground">Exhale</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-2xl font-semibold capitalize text-foreground" data-testid="text-box-phase">
              {phase === 'hold1' ? 'Hold' : phase === 'hold2' ? 'Hold' : phase}
            </p>
            <p className="text-lg text-muted-foreground" data-testid="text-box-timer">
              {Math.ceil(phaseDuration - phaseTime)}s
            </p>
            <p className="text-sm text-muted-foreground">Rounds: {rounds}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button onClick={() => setIsActive(true)} data-testid="button-box-start">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={() => setIsActive(false)} variant="secondary" data-testid="button-box-pause">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => {
              setIsActive(false);
              setPhase('inhale');
              setPhaseTime(0);
              setRounds(0);
            }}
            data-testid="button-box-reset"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GroundingExercise() {
  const [items, setItems] = useState({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: [''],
  });
  
  const [completedItems, setCompletedItems] = useState<Record<string, boolean[]>>({
    see: [false, false, false, false, false],
    touch: [false, false, false, false],
    hear: [false, false, false],
    smell: [false, false],
    taste: [false],
  });

  const toggleItem = (category: keyof typeof items, index: number) => {
    setCompletedItems(prev => ({
      ...prev,
      [category]: prev[category].map((val, i) => i === index ? !val : val),
    }));
  };

  const totalCompleted = Object.values(completedItems).flat().filter(Boolean).length;
  const totalItems = 15;
  const progress = (totalCompleted / totalItems) * 100;

  return (
    <Card className="border-orange-500/20" data-testid="card-grounding">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-orange-500/10">
            <Hand className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <CardTitle>5-4-3-2-1 Grounding</CardTitle>
            <CardDescription>Connect with your present environment</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid="text-grounding-progress">
              {totalCompleted}/{totalItems}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {Object.entries(items).map(([category, categoryItems]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium capitalize flex items-center gap-2">
                <Badge variant="outline">{categoryItems.length}</Badge>
                {category === 'see' ? 'Things you can see' :
                 category === 'touch' ? 'Things you can touch' :
                 category === 'hear' ? 'Sounds you can hear' :
                 category === 'smell' ? 'Things you can smell' :
                 'Things you can taste'}
              </h4>
              <div className="space-y-2 pl-2">
                {categoryItems.map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Checkbox
                      checked={completedItems[category][index]}
                      onCheckedChange={() => toggleItem(category as keyof typeof items, index)}
                      data-testid={`checkbox-grounding-${category}-${index}`}
                    />
                    <span className={`text-sm ${completedItems[category][index] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      Identify item {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setCompletedItems({
              see: [false, false, false, false, false],
              touch: [false, false, false, false],
              hear: [false, false, false],
              smell: [false, false],
              taste: [false],
            });
          }}
          data-testid="button-grounding-reset"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Exercise
        </Button>

        {totalCompleted === totalItems && (
          <div className="p-4 rounded-md bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Check className="h-5 w-5" />
              <span className="font-medium">Exercise completed! Well done.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MeditationTimer() {
  const durations = [3, 5, 10, 15, 20];
  const [selectedDuration, setSelectedDuration] = useState(5);
  const { timeLeft, isRunning, start, pause, reset, progress } = useTimer(selectedDuration * 60);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-purple-500/20" data-testid="card-meditation">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-purple-500/10">
            <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Guided Meditation</CardTitle>
            <CardDescription>Set your intention and find stillness</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning && timeLeft === selectedDuration * 60 ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Select duration:</p>
              <div className="flex gap-2 flex-wrap">
                {durations.map(duration => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? "default" : "outline"}
                    onClick={() => setSelectedDuration(duration)}
                    data-testid={`button-meditation-${duration}min`}
                  >
                    {duration} min
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="text-purple-500 transition-all duration-300"
                  data-testid="meditation-progress-circle"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold" data-testid="text-meditation-timer">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">remaining</p>
              </div>
            </div>

            {timeLeft === 0 && (
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Session complete
                </p>
                <p className="text-sm text-muted-foreground">
                  Take a moment to notice how you feel
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <Button onClick={start} data-testid="button-meditation-start">
              <Play className="h-4 w-4 mr-2" />
              {timeLeft === selectedDuration * 60 ? 'Begin' : 'Resume'}
            </Button>
          ) : (
            <Button onClick={pause} variant="secondary" data-testid="button-meditation-pause">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button variant="outline" onClick={reset} data-testid="button-meditation-reset">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressiveMuscleRelaxation() {
  const muscleGroups = [
    { name: 'Hands and forearms', instruction: 'Make tight fists, then release' },
    { name: 'Upper arms', instruction: 'Tense your biceps, then relax' },
    { name: 'Shoulders', instruction: 'Raise shoulders to ears, then drop' },
    { name: 'Neck', instruction: 'Gently tilt head back, then return to center' },
    { name: 'Face', instruction: 'Scrunch facial muscles, then release' },
    { name: 'Chest and back', instruction: 'Take deep breath and hold, then exhale' },
    { name: 'Stomach', instruction: 'Tighten abdominal muscles, then release' },
    { name: 'Hips and buttocks', instruction: 'Squeeze glutes, then relax' },
    { name: 'Thighs', instruction: 'Tense thigh muscles, then release' },
    { name: 'Calves', instruction: 'Point toes up, then relax' },
    { name: 'Feet', instruction: 'Curl toes, then release' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(muscleGroups.length).fill(false));
  const [isActive, setIsActive] = useState(false);
  const [shouldAdvance, setShouldAdvance] = useState(false);

  const { timeLeft, isRunning, start, pause, reset, restart } = useTimer(10, () => {
    if (currentStep < muscleGroups.length - 1) {
      setCompleted(prev => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
      setCurrentStep(prev => prev + 1);
      setShouldAdvance(true);
    } else {
      setCompleted(prev => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
      setIsActive(false);
    }
  });

  useEffect(() => {
    if (shouldAdvance && isActive) {
      setShouldAdvance(false);
      restart();
    }
  }, [shouldAdvance, isActive, restart]);

  const handleStart = () => {
    setIsActive(true);
    start();
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStep(0);
    setCompleted(new Array(muscleGroups.length).fill(false));
    setShouldAdvance(false);
    reset();
  };

  const allCompleted = completed.every(Boolean);

  return (
    <Card className="border-green-500/20" data-testid="card-muscle-relaxation">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-green-500/10">
            <Move className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Progressive Muscle Relaxation</CardTitle>
            <CardDescription>Release tension throughout your body</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isActive && !allCompleted && (
          <div className="p-4 rounded-md bg-muted/50">
            <p className="text-sm text-muted-foreground">
              This exercise guides you through tensing and relaxing different muscle groups. 
              Each step lasts 10 seconds. Tense the muscles for 5 seconds, then release for 5 seconds.
            </p>
          </div>
        )}

        {isActive && (
          <div className="space-y-4">
            <div className="p-6 rounded-md bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary" data-testid="text-pmr-step">
                    {currentStep + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-lg" data-testid="text-pmr-muscle-group">
                    {muscleGroups[currentStep].name}
                  </h4>
                  <p className="text-muted-foreground" data-testid="text-pmr-instruction">
                    {muscleGroups[currentStep].instruction}
                  </p>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {timeLeft > 5 ? 'Tense' : 'Release'}
                      </span>
                      <span className="font-medium" data-testid="text-pmr-timer">{timeLeft}s</span>
                    </div>
                    <Progress value={(10 - timeLeft) * 10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">Progress:</span>
              <div className="flex gap-1 flex-wrap">
                {muscleGroups.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      completed[index] ? 'bg-green-500' : 
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                    data-testid={`pmr-progress-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {allCompleted && (
          <div className="p-6 rounded-md bg-green-500/10 border border-green-500/20 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
              <Check className="h-6 w-6" />
              <span className="text-lg font-semibold">Exercise Complete!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Notice the relaxation throughout your body
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!isActive && !allCompleted && (
            <Button onClick={handleStart} data-testid="button-pmr-start">
              <Play className="h-4 w-4 mr-2" />
              Begin Exercise
            </Button>
          )}
          {isActive && (
            <>
              {isRunning ? (
                <Button onClick={pause} variant="secondary" data-testid="button-pmr-pause">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={start} data-testid="button-pmr-resume">
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={handleReset} data-testid="button-pmr-reset">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Strategies() {
  const { data: strategies, isLoading } = useQuery<CopingStrategy[]>({
    queryKey: ["/api/strategies"],
  });

  const personalizedStrategies = strategies?.filter((s) => s.personalizedReason) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Coping Strategies</h1>
          <p className="text-muted-foreground leading-relaxed">
            Interactive exercises and personalized techniques for emotional wellbeing
          </p>
        </div>

        {personalizedStrategies.length > 0 && !isLoading && (
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
              <div className="grid gap-3">
                {personalizedStrategies.map((strategy) => {
                  const Icon = categoryIcons[strategy.category as keyof typeof categoryIcons] || Heart;
                  return (
                    <div 
                      key={strategy.id} 
                      className={`p-4 rounded-md border ${categoryColors[strategy.category as keyof typeof categoryColors] || 'bg-muted/50'}`}
                      data-testid={`strategy-recommendation-${strategy.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{strategy.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {strategy.personalizedReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Interactive Sessions</h2>
          <Tabs defaultValue="breathing" className="w-full" data-testid="tabs-interactive-sessions">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="breathing" data-testid="tab-breathing">
                <Wind className="h-4 w-4 mr-2" />
                Breathing
              </TabsTrigger>
              <TabsTrigger value="box" data-testid="tab-box">
                <Circle className="h-4 w-4 mr-2" />
                Box
              </TabsTrigger>
              <TabsTrigger value="grounding" data-testid="tab-grounding">
                <Hand className="h-4 w-4 mr-2" />
                Grounding
              </TabsTrigger>
              <TabsTrigger value="meditation" data-testid="tab-meditation">
                <Heart className="h-4 w-4 mr-2" />
                Meditation
              </TabsTrigger>
              <TabsTrigger value="muscle" data-testid="tab-muscle">
                <Move className="h-4 w-4 mr-2" />
                Muscle
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breathing">
              <BreathingExercise />
            </TabsContent>

            <TabsContent value="box">
              <BoxBreathing />
            </TabsContent>

            <TabsContent value="grounding">
              <GroundingExercise />
            </TabsContent>

            <TabsContent value="meditation">
              <MeditationTimer />
            </TabsContent>

            <TabsContent value="muscle">
              <ProgressiveMuscleRelaxation />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
