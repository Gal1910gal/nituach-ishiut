export interface DimensionScore {
  score: number;       // 1–10
  confidence: number;  // 0–100
  label: string;
}

export interface FacetScore {
  name: string;
  dimension: keyof BigFive;
  score: number; // 1–10
}

export interface Indicator {
  source: "תמונה" | "טקסט" | "ציור" | "מוזיקה" | "קעקוע" | "שאלון";
  observation: string;
  trait: string;
  direction: "חיובי" | "שלילי" | "ניטרלי";
}

export interface BigFive {
  O: DimensionScore; // Openness
  C: DimensionScore; // Conscientiousness
  E: DimensionScore; // Extraversion
  A: DimensionScore; // Agreeableness
  N: DimensionScore; // Neuroticism
}

export interface MusicEntry {
  title: string;
  artist: string;
  genre: string;
}

export interface QuestionnaireAnswers {
  [questionId: string]: string;
}

export interface AnalysisInputs {
  image?: string;       // base64 data URL
  text?: string;
  drawing?: string;     // base64 data URL
  music?: MusicEntry[];
  tattoos?: string[];   // base64 data URLs
  questionnaire?: QuestionnaireAnswers;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  subjectName: string;
  inputs: AnalysisInputs;
  bigFive: BigFive;
  facets: FacetScore[];
  narrative: string;
  indicators: Indicator[];
  reliability: number; // 0–100
}
