
export type FeedbackSeverity = 'Positive' | 'Neutral' | 'Negative' | 'Critical' | 'Advisory';

export interface DetailedFeedbackDimension {
  dimension: string;
  score: number; // -5 to +5
  explanation: string;
  severity: FeedbackSeverity;
  recommendations: string[];
}

export interface CompleteInteractionFeedback {
  aiResponse: string;
  feedbackSummary: string;
  severity: FeedbackSeverity;
  detailedFeedback: DetailedFeedbackDimension[];
  competenceImpact: number;
}

export interface ICulture {
  id: string;
  name: string;
  continent: string;
  language: string;
  helloPhrase: string;
  goodbyePhrase: string;
  culturalDimensions: Record<string, number>;
  communicationStyle: {
    directness: number;
    contextSensitivity: number;
    formalityLevel: number;
    emotionalExpression: number;
  };
  etiquetteRules: IEtiquetteRule[];
  values: string[];
}

export interface IEtiquetteRule {
  id: string;
  category: string;
  rule: string;
  description: string;
  consequences: FeedbackSeverity;
}

export interface IScenarioTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Business' | 'Social' | 'Academic' | 'Personal' | 'Diplomacy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  initialSituation: string;
}

export interface IUserCulturalProfile {
  userId: string;
  username: string;
  originCultureId: string;
  culturalCompetenceScore: Record<string, number>;
  overallCompetence: number;
}

export interface IActiveScenarioInstance {
  id: string;
  template: IScenarioTemplate;
  culture: ICulture;
  turns: { role: 'user' | 'model'; content: string; feedback?: CompleteInteractionFeedback }[];
  status: 'active' | 'completed';
  successMetric: number;
}

export interface ISystemSettings {
  darkMode: boolean;
  aiPersona: 'supportive' | 'challenging' | 'formal_advisor';
  feedbackVerbosity: 'concise' | 'detailed' | 'pedagogical';
}
