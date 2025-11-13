import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeEmotion, calculateMoodRating } from "./openai";
import { chatWithAssistant } from "./gemini";
import { insertJournalEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/journal", async (req, res) => {
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

  app.get("/api/journal", async (_req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/insights", async (_req, res) => {
    try {
      const insights = await storage.getMoodInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  app.get("/api/strategies", async (req, res) => {
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

  app.post("/api/assistant", async (req, res) => {
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
