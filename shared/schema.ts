import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  inputMode: varchar("input_mode", { length: 10 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  emotions: jsonb("emotions").$type<EmotionAnalysis>(),
  moodRating: integer("mood_rating"),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  timestamp: true,
});

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

export interface EmotionAnalysis {
  primaryEmotion: string;
  secondaryEmotions: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentScore: number;
  confidence: number;
  intensity: number;
  themes: string[];
  summary: string;
}

export interface MoodInsight {
  weeklyAverage: number;
  trend: 'improving' | 'declining' | 'stable';
  emotionDistribution: Record<string, number>;
  totalEntries: number;
  streakDays: number;
}

export interface CopingStrategy {
  id: string;
  title: string;
  category: 'breathing' | 'meditation' | 'movement' | 'grounding' | 'social' | 'creative';
  description: string;
  steps: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  personalizedReason?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
