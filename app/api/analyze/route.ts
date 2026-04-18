import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { buildPromptParts } from "@/lib/prompt";
import { AnalysisInputs } from "@/lib/types";

function extractJson(raw: string): string {
  // 1. Try ```json ... ``` block
  const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlock?.[1]) return codeBlock[1].trim();

  // 2. Try to find outermost { ... }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return raw.slice(start, end + 1);

  return raw.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { subjectName, inputs }: { subjectName: string; inputs: AnalysisInputs } = await req.json();

    const parts = buildPromptParts(subjectName, inputs);
    const raw = await callGemini(parts);

    const jsonStr = extractJson(raw);

    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      // Last resort: log the raw response to help debugging
      console.error("JSON parse failed. Raw response (first 500 chars):", jsonStr.slice(0, 500));
      throw new Error("Gemini returned invalid JSON. Raw: " + jsonStr.slice(0, 200));
    }

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
