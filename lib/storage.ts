import { AnalysisResult } from "./types";

const KEY = "asio_analyses";

export function getAnalyses(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(result: AnalysisResult): void {
  const all = getAnalyses();
  all.unshift(result);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getAnalysisById(id: string): AnalysisResult | null {
  return getAnalyses().find((a) => a.id === id) ?? null;
}

export function deleteAnalysis(id: string): void {
  const filtered = getAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(filtered));
}
