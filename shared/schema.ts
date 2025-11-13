import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  teamName: varchar("team_name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProfile = Omit<User, 'passwordHash'>;

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
