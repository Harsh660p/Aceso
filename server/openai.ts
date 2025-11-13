import OpenAI from "openai";
import type { EmotionAnalysis } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeEmotion(text: string): Promise<EmotionAnalysis> {
  try {
    const systemPrompt = `You are an expert in emotional intelligence and mental health. Analyze the following journal entry and identify:
1. The primary emotion (one word)
2. Secondary emotions (up to 3)
3. Overall sentiment (positive, negative, neutral, or mixed)
4. Sentiment score (-1 to 1, where -1 is very negative and 1 is very positive)
5. Confidence in your analysis (0 to 1)
6. Emotional intensity (0 to 1)
7. Key themes (up to 3)
8. A brief supportive summary (1-2 sentences)

Respond with JSON in this exact format:
{
  "primaryEmotion": "string",
  "secondaryEmotions": ["string", "string"],
  "sentiment": "positive|negative|neutral|mixed",
  "sentimentScore": number,
  "confidence": number,
  "intensity": number,
  "themes": ["string", "string"],
  "summary": "string"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      primaryEmotion: result.primaryEmotion || "neutral",
      secondaryEmotions: result.secondaryEmotions || [],
      sentiment: result.sentiment || "neutral",
      sentimentScore: Math.max(-1, Math.min(1, result.sentimentScore || 0)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      intensity: Math.max(0, Math.min(1, result.intensity || 0.5)),
      themes: result.themes || [],
      summary: result.summary || "Your entry has been analyzed.",
    };
  } catch (error) {
    console.error("OpenAI emotion analysis error:", error);
    throw new Error("Failed to analyze emotions. Please try again.");
  }
}

export async function calculateMoodRating(emotionAnalysis: EmotionAnalysis): Promise<number> {
  const sentimentToMood: Record<string, number> = {
    positive: 4,
    neutral: 3,
    mixed: 2.5,
    negative: 2,
  };

  const baseMood = sentimentToMood[emotionAnalysis.sentiment] || 3;
  const adjustment = emotionAnalysis.sentimentScore * 0.5;
  const moodRating = baseMood + adjustment;

  return Math.max(1, Math.min(5, Math.round(moodRating * 10) / 10));
}
