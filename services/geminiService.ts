import { GoogleGenAI, Type, Chat } from "@google/genai";
import { JournalAnalysis, Mood, JournalEntry } from '../types';
import { knowledgeBase } from './knowledge-base';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const journalAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        mood: {
            type: Type.STRING,
            enum: Object.values(Mood),
            description: "The primary mood of the journal entry."
        },
        keyInsight: {
            type: Type.STRING,
            description: "A single, concise insight summarizing the user's main emotional state or concern."
        },
        thoughtPatterns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of identified cognitive distortions or recurring thought patterns."
        },
        copingStrategies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            },
            description: "A list of 3 actionable coping strategies based on CBT or mindfulness."
        }
    },
    required: ["mood", "keyInsight", "thoughtPatterns", "copingStrategies"]
};


export const analyzeJournalEntry = async (text: string): Promise<JournalAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an empathetic AI mental health assistant named MindWeave. Analyze the following journal entry. Be gentle, supportive, and insightful. Identify the primary mood, a key insight, any cognitive distortions or thought patterns, and suggest 3 actionable, personalized coping strategies based on CBT and mindfulness.
            
            Journal Entry: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: journalAnalysisSchema,
                temperature: 0.5,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse;
    } catch (error) {
        console.error("Error analyzing journal entry:", error);
        throw new Error("Failed to get analysis from AI. Please try again.");
    }
};

export const createEchoMindChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are EchoMind, a compassionate conversational therapy companion. Your goal is to help the user explore their thoughts and feelings in a safe, non-judgmental space. Use techniques from Cognitive Behavioral Therapy (CBT), like guided discovery and Socratic questioning. Ask open-ended questions to encourage reflection. Never give direct advice or diagnoses. Keep your responses concise and empathetic.",
            temperature: 0.7,
        },
    });
};

export const explainMentalHealthTopic = async (topic: string): Promise<string> => {
    try {
        const context = knowledgeBase[topic];
        if (!context) {
            throw new Error(`No context found for topic: ${topic}`);
        }

        const prompt = `You are SelfSage, an AI mental health educator. Using ONLY the following context, explain the concept of "${topic}" in a simple, compassionate, and easy-to-understand way. Structure your response in Markdown. Include a brief definition, common examples or feelings associated with it, and one simple, actionable tip to manage it. Do not use any information outside of the provided context.

CONTEXT:
---
${context}
---
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        return response.text;
    } catch (error) {
        console.error(`Error explaining topic ${topic}:`, error);
        throw new Error("Failed to get explanation from AI. Please try again.");
    }
}

export const generateJournalSummary = async (entries: JournalEntry[]): Promise<string> => {
    try {
        // Sanitize entries to only include relevant data for the prompt
        const sanitizedEntries = entries.map(entry => ({
            date: entry.date,
            analysis: entry.analysis ? {
                mood: entry.analysis.mood,
                keyInsight: entry.analysis.keyInsight,
                thoughtPatterns: entry.analysis.thoughtPatterns
            } : null
        }));

        const prompt = `
You are MindWeave, an empathetic AI mental health assistant. Analyze the following collection of journal entries to provide a periodic summary for the user.
Your tone should be gentle, insightful, and encouraging.

**Instructions:**
1.  **Overall Mood Trend:** Start by describing the general mood trend over this period. Was it consistent, fluctuating? Note any dominant moods.
2.  **Recurring Themes:** Identify and synthesize 2-3 key recurring themes, thought patterns, or concerns that appeared across the entries.
3.  **Moments of Progress:** Highlight any specific moments of resilience, self-awareness, or positive coping mentioned in the insights.
4.  **Gentle Summary:** Conclude with a brief, compassionate summary of the period, offering encouragement for their continued journey of self-reflection.
5.  **Formatting:** Use Markdown for clarity (e.g., headings, bold text, and bullet points).

**Journal Data:**
\`\`\`json
${JSON.stringify(sanitizedEntries, null, 2)}
\`\`\`
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;

    } catch (error) {
        console.error("Error generating journal summary:", error);
        throw new Error("Failed to generate summary from AI. Please try again.");
    }
};

export const generateDailyAffirmation = async (entries: JournalEntry[]): Promise<string> => {
    try {
        const recentInsights = entries.slice(0, 3).map(e => e.analysis?.keyInsight).filter(Boolean);
        
        let prompt;
        if (recentInsights.length > 0) {
            prompt = `You are MindWeave, an empathetic AI assistant. Based on these recent user thoughts, create a single, short, positive affirmation for their day. The affirmation should be encouraging and forward-looking. Keep it to one sentence.

Recent thoughts:
- "${recentInsights.join('"\n- "')}"

Your affirmation for today is:`;
        } else {
            prompt = `You are MindWeave, an empathetic AI assistant. Create a single, short, positive, and general affirmation for the user's day. Keep it to one sentence.`;
        }
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        // Clean up response, remove quotes if AI adds them
        return response.text.replace(/"/g, '').trim();

    } catch (error) {
        console.error("Error generating daily affirmation:", error);
        // Provide a graceful fallback
        return "You are capable of amazing things.";
    }
};