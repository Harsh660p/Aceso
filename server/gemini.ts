import { GoogleGenAI } from "@google/genai";
import type { AssistantMessage } from "@shared/schema";

// the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithAssistant(
  userMessage: string,
  conversationHistory: AssistantMessage[]
): Promise<string> {
  try {
    const systemInstruction = `You are a compassionate AI wellness companion named Aceso. Your role is to:
- Provide emotional support and empathetic listening
- Help users process their feelings without judgment
- Suggest healthy coping strategies when appropriate
- Encourage professional help for serious mental health concerns
- Be warm, supportive, and understanding
- Keep responses concise but meaningful (2-4 sentences typically)
- Never diagnose or replace professional therapy
- Focus on validation, reflection, and gentle guidance

Important: If the user expresses suicidal thoughts or severe crisis, immediately encourage them to contact crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line: text HOME to 741741).`;

    const contents = conversationHistory
      .slice(-5)
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      },
      contents,
    });

    return response.text || "I'm here to listen. How are you feeling?";
  } catch (error) {
    console.error("Gemini chat error:", error);
    throw new Error("I'm having trouble responding right now. Please try again.");
  }
}
