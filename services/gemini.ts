
import { GoogleGenAI, Type } from "@google/genai";
import { CompleteInteractionFeedback, ICulture, IScenarioTemplate, ISystemSettings, IUserCulturalProfile } from "../types";

// Always use named parameter for apiKey and assume it is provided via environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FEEDBACK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    aiResponse: {
      type: Type.STRING,
      description: "The in-character response from the counterparts in the simulation."
    },
    feedbackSummary: {
      type: Type.STRING,
      description: "A brief summary of how well the user's action aligned with cultural norms."
    },
    severity: {
      type: Type.STRING,
      enum: ["Positive", "Neutral", "Negative", "Critical", "Advisory"],
      description: "The overall severity of the user's cultural alignment."
    },
    detailedFeedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dimension: { type: Type.STRING, description: "The cultural dimension being addressed (e.g. Communication, Etiquette)." },
          score: { type: Type.NUMBER, description: "A score from -5 to +5 reflecting appropriateness." },
          explanation: { type: Type.STRING, description: "Explanation of why this score was given." },
          severity: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative", "Critical", "Advisory"] },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable advice for improvement." }
        },
        required: ["dimension", "score", "explanation", "severity", "recommendations"]
      }
    },
    competenceImpact: {
      type: Type.NUMBER,
      description: "Numerical impact on cultural competence score (-25 to +25)."
    }
  },
  required: ["aiResponse", "feedbackSummary", "severity", "detailedFeedback", "competenceImpact"]
};

export async function processInteraction(
  userAction: string,
  history: { role: 'user' | 'model'; content: string }[],
  culture: ICulture,
  template: IScenarioTemplate,
  userProfile: IUserCulturalProfile,
  settings: ISystemSettings
): Promise<CompleteInteractionFeedback> {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are the "Cultural Intelligence Agent" for a simulation platform.
    Target Culture: ${culture.name} (${culture.continent}).
    Scenario: ${template.title} - ${template.description}.
    User Origin: ${userProfile.originCultureId}.
    AI Persona: ${settings.aiPersona}.
    Feedback Verbosity: ${settings.feedbackVerbosity}.

    Your role:
    1. Respond as the people in the scenario in the "aiResponse" field.
    2. Analyze the user's input for cultural appropriateness based on:
       - Communication directness (${culture.communicationStyle.directness}/100)
       - Formalitiy level (${culture.communicationStyle.formalityLevel}/100)
       - Known etiquette rules: ${JSON.stringify(culture.etiquetteRules)}
    3. Provide structured feedback in the JSON format specified.
    4. Maintain the persona. If 'challenging', be more critical. If 'supportive', be encouraging.
    5. 'Critical' severity should be reserved for major cultural taboos.
  `;

  const contents = [
    ...history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    })),
    {
      role: 'user',
      parts: [{ text: `User Action: ${userAction}` }]
    }
  ];

  const response = await ai.models.generateContent({
    model: modelName,
    contents: contents as any,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: FEEDBACK_SCHEMA as any
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as CompleteInteractionFeedback;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI agent.");
  }
}
