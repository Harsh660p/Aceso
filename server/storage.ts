import { type JournalEntry, type InsertJournalEntry, type MoodInsight, type CopingStrategy, type User, users, journalEntries } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createUser(email: string, passwordHash: string, displayName: string, teamName?: string): Promise<User>;
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserById(id: string): Promise<User | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  getMoodInsights(): Promise<MoodInsight>;
  getCopingStrategies(emotions?: string[]): Promise<CopingStrategy[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private journalEntries: Map<string, JournalEntry>;

  constructor() {
    this.users = new Map();
    this.journalEntries = new Map();
  }

  async createUser(email: string, passwordHash: string, displayName: string, teamName?: string | null): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      teamName: teamName || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.toLowerCase();
    return Array.from(this.users.values()).find(u => u.email === normalizedEmail);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      ...insertEntry,
      id,
      timestamp: new Date(),
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async getMoodInsights(): Promise<MoodInsight> {
    const entries = await this.getJournalEntries();
    
    if (entries.length === 0) {
      return {
        weeklyAverage: 0,
        trend: 'stable',
        emotionDistribution: {},
        totalEntries: 0,
        streakDays: 0,
      };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekEntries = entries.filter(e => new Date(e.timestamp) >= sevenDaysAgo);

    const weeklyMoodSum = weekEntries.reduce((sum, e) => sum + (e.moodRating || 0), 0);
    const weeklyAverage = weekEntries.length > 0 ? weeklyMoodSum / weekEntries.length : 0;

    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const previousWeekEntries = entries.filter(
      e => new Date(e.timestamp) >= fourteenDaysAgo && new Date(e.timestamp) < sevenDaysAgo
    );
    const previousWeekMoodSum = previousWeekEntries.reduce((sum, e) => sum + (e.moodRating || 0), 0);
    const previousWeekAverage = previousWeekEntries.length > 0 ? previousWeekMoodSum / previousWeekEntries.length : 0;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (weeklyAverage > previousWeekAverage + 0.3) trend = 'improving';
    else if (weeklyAverage < previousWeekAverage - 0.3) trend = 'declining';

    const emotionDistribution: Record<string, number> = {};
    entries.forEach(entry => {
      if (entry.emotions) {
        const primary = entry.emotions.primaryEmotion;
        emotionDistribution[primary] = (emotionDistribution[primary] || 0) + 1;
        
        entry.emotions.secondaryEmotions?.forEach(emotion => {
          emotionDistribution[emotion] = (emotionDistribution[emotion] || 0) + 1;
        });
      }
    });

    let streakDays = 0;
    const sortedDates = entries
      .map(e => new Date(e.timestamp).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const expectedDate = new Date(now);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (currentDate.toDateString() === expectedDate.toDateString()) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      weeklyAverage: parseFloat(weeklyAverage.toFixed(1)),
      trend,
      emotionDistribution,
      totalEntries: entries.length,
      streakDays,
    };
  }

  async getCopingStrategies(emotions?: string[]): Promise<CopingStrategy[]> {
    const allStrategies: CopingStrategy[] = [
      {
        id: '1',
        title: 'Box Breathing',
        category: 'breathing',
        description: 'A simple yet powerful breathing technique used by Navy SEALs to reduce stress and increase focus.',
        steps: [
          'Breathe in slowly through your nose for 4 counts',
          'Hold your breath for 4 counts',
          'Exhale slowly through your mouth for 4 counts',
          'Hold your breath for 4 counts',
          'Repeat for 4-5 minutes'
        ],
        duration: '5 minutes',
        difficulty: 'beginner',
      },
      {
        id: '2',
        title: 'Body Scan Meditation',
        category: 'meditation',
        description: 'Progressive relaxation technique that helps you connect with your body and release tension.',
        steps: [
          'Lie down or sit comfortably',
          'Close your eyes and take 3 deep breaths',
          'Starting from your toes, notice sensations in each body part',
          'Move slowly upward through your legs, torso, arms, and head',
          'Notice tension and consciously relax each area',
          'Take 3 final deep breaths before opening your eyes'
        ],
        duration: '10-15 minutes',
        difficulty: 'beginner',
      },
      {
        id: '3',
        title: 'Mindful Walking',
        category: 'movement',
        description: 'Gentle physical activity combined with mindfulness to ground yourself in the present moment.',
        steps: [
          'Find a quiet place to walk, indoors or outdoors',
          'Walk at a slow, comfortable pace',
          'Notice the sensation of your feet touching the ground',
          'Pay attention to your breath and the rhythm of your steps',
          'If your mind wanders, gently bring focus back to walking',
          'Continue for at least 10 minutes'
        ],
        duration: '10-20 minutes',
        difficulty: 'beginner',
      },
      {
        id: '4',
        title: '5-4-3-2-1 Grounding',
        category: 'grounding',
        description: 'A sensory awareness technique to help manage anxiety and bring you back to the present.',
        steps: [
          'Acknowledge 5 things you can see around you',
          'Acknowledge 4 things you can touch',
          'Acknowledge 3 things you can hear',
          'Acknowledge 2 things you can smell',
          'Acknowledge 1 thing you can taste',
          'Take a deep breath and notice how you feel'
        ],
        duration: '5 minutes',
        difficulty: 'beginner',
      },
      {
        id: '5',
        title: 'Reach Out to Someone',
        category: 'social',
        description: 'Social connection is a powerful tool for emotional wellbeing. Share your feelings with someone you trust.',
        steps: [
          'Think of someone you trust and feel comfortable with',
          'Reach out via call, text, or in person',
          'Share how you\'re feeling without judgment',
          'Ask if they have time to listen or meet',
          'Practice vulnerability and accept their support',
          'Express gratitude for their time and presence'
        ],
        duration: '15-30 minutes',
        difficulty: 'intermediate',
      },
      {
        id: '6',
        title: 'Expressive Journaling',
        category: 'creative',
        description: 'Free-form writing to process emotions and gain clarity on your thoughts.',
        steps: [
          'Set aside 15-20 minutes of uninterrupted time',
          'Write continuously without editing or judging',
          'Explore your deepest thoughts and feelings',
          'Don\'t worry about grammar or structure',
          'Write until the timer goes off',
          'Reflect on what you discovered'
        ],
        duration: '15-20 minutes',
        difficulty: 'beginner',
      },
      {
        id: '7',
        title: 'Progressive Muscle Relaxation',
        category: 'meditation',
        description: 'Systematically tense and relax muscle groups to reduce physical stress and anxiety.',
        steps: [
          'Sit or lie in a comfortable position',
          'Starting with your feet, tense muscles for 5 seconds',
          'Release tension and notice the relaxation for 10 seconds',
          'Move upward through calves, thighs, abdomen, arms, and face',
          'Pay attention to the difference between tension and relaxation',
          'Finish with 3 deep breaths'
        ],
        duration: '10-15 minutes',
        difficulty: 'intermediate',
      },
      {
        id: '8',
        title: 'Yoga Flow',
        category: 'movement',
        description: 'Gentle yoga sequence to release tension and improve mood through movement.',
        steps: [
          'Start in child\'s pose for 1 minute',
          'Move to cat-cow stretches (10 repetitions)',
          'Transition to downward dog (hold 30 seconds)',
          'Flow through sun salutations (3-5 rounds)',
          'End in seated meditation (2-3 minutes)',
          'Notice how your body and mind feel'
        ],
        duration: '15-20 minutes',
        difficulty: 'intermediate',
      },
    ];

    if (!emotions || emotions.length === 0) {
      return allStrategies;
    }

    const emotionStrategyMap: Record<string, string[]> = {
      anxious: ['1', '4', '7'],
      stressed: ['1', '3', '7'],
      sad: ['2', '5', '6'],
      angry: ['3', '7', '8'],
      overwhelmed: ['1', '4', '6'],
      lonely: ['5', '6'],
      worried: ['1', '2', '4'],
      tired: ['2', '8'],
    };

    const recommendedIds = new Set<string>();
    emotions.forEach(emotion => {
      const lowerEmotion = emotion.toLowerCase();
      Object.keys(emotionStrategyMap).forEach(key => {
        if (lowerEmotion.includes(key)) {
          emotionStrategyMap[key].forEach(id => recommendedIds.add(id));
        }
      });
    });

    const strategiesWithReasons = allStrategies.map(strategy => {
      if (recommendedIds.has(strategy.id)) {
        return {
          ...strategy,
          personalizedReason: `Recommended based on your recent ${emotions[0].toLowerCase()} feelings`,
        };
      }
      return strategy;
    });

    return strategiesWithReasons.sort((a, b) => {
      if (a.personalizedReason && !b.personalizedReason) return -1;
      if (!a.personalizedReason && b.personalizedReason) return 1;
      return 0;
    });
  }
}

export const storage = new MemStorage();
