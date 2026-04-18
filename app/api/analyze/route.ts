import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { buildPromptParts } from "@/lib/prompt";
import { AnalysisInputs } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { subjectName, inputs }: { subjectName: string; inputs: AnalysisInputs } = await req.json();

    const parts = buildPromptParts(subjectName, inputs);
    const raw = await callGemini(parts);

    // Extract JSON from response (may be wrapped in ```json ... ```)
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ?? raw.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch?.[1] ?? raw;
    const analysis = JSON.parse(jsonStr);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
