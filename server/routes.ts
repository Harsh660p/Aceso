import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeEmotion, calculateMoodRating } from "./openai";
import { chatWithAssistant } from "./gemini";
import { insertJournalEntrySchema, insertUserSchema, loginSchema, type UserProfile } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.findUserByEmail(validatedData.email);
      if (existingUser) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }

      const passwordHash = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser(
        validatedData.email,
        passwordHash,
        validatedData.displayName,
        validatedData.teamName
      );

      req.session.userId = user.id;
      
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        teamName: user.teamName,
        createdAt: user.createdAt,
      };
      
      res.json({ user: userProfile });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create account" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.findUserByEmail(validatedData.email);
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      req.session.userId = user.id;
      
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        teamName: user.teamName,
        createdAt: user.createdAt,
      };
      
      res.json({ user: userProfile });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to login" });
      }
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        res.status(500).json({ message: "Failed to logout" });
        return;
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    if (!req.session?.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await storage.findUserById(req.session.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      teamName: user.teamName,
      createdAt: user.createdAt,
    };
    
    res.json({ user: userProfile });
  });

  app.post("/api/journal", requireAuth, async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);

      const emotionAnalysis = await analyzeEmotion(validatedData.content);
      const moodRating = await calculateMoodRating(emotionAnalysis);

      const entry = await storage.createJournalEntry({
        ...validatedData,
        emotions: emotionAnalysis,
        moodRating,
      });

      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create journal entry" });
      }
    }
  });

  app.get("/api/journal", requireAuth, async (_req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/insights", requireAuth, async (_req, res) => {
    try {
      const insights = await storage.getMoodInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  app.get("/api/strategies", requireAuth, async (req, res) => {
    try {
      const emotions = req.query.emotions 
        ? (req.query.emotions as string).split(",")
        : undefined;
      
      const strategies = await storage.getCopingStrategies(emotions);
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coping strategies" });
    }
  });

  app.post("/api/assistant", requireAuth, async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== "string") {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      const response = await chatWithAssistant(message, conversationHistory || []);
      res.json({ response });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to get assistant response" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
