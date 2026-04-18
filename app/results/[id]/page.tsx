"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnalysisResult } from "@/lib/types";
import { getAnalysisById } from "@/lib/storage";
import { HE } from "@/i18n/he";
import BigFiveRadar from "@/components/results/BigFiveRadar";
import FacetsGrid from "@/components/results/FacetsGrid";
import NarrativeReport from "@/components/results/NarrativeReport";
import IndicatorsList from "@/components/results/IndicatorsList";
import { exportToWord } from "@/lib/exportWord";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const a = getAnalysisById(id);
    setAnalysis(a);
  }, [id]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>לא נמצא ניתוח. <Link href="/library" className="text-indigo-600 underline">חזרה לספרייה</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 print:p-0">
      {/* Header — hidden in print */}
      <div className="flex items-center justify-between mb-6 pt-4 print:hidden">
        <Link href="/library" className="text-gray-400 hover:text-gray-600 text-sm">← {HE.backToLibrary}</Link>
        <div className="flex gap-2">
          <button
            onClick={() => analysis && exportToWord(analysis)}
            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            📄 Word
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            🖨️ {HE.print}
          </button>
        </div>
      </div>

      {/* Print header — visible only in print */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">ניתוח אישיות ASIO</h1>
        <p className="text-gray-600">נבדק: {analysis.subjectName} | {new Date(analysis.createdAt).toLocaleDateString("he-IL")}</p>
      </div>

      {/* Subject title */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{analysis.subjectName}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date(analysis.createdAt).toLocaleDateString("he-IL", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-indigo-700">{analysis.reliability}%</div>
            <div className="text-xs text-gray-500">{HE.results.reliability}</div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Big Five Radar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 print:break-inside-avoid">
          <BigFiveRadar bigFive={analysis.bigFive} />
        </div>

        {/* Facets */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 print:break-inside-avoid">
          <FacetsGrid facets={analysis.facets} />
        </div>

        {/* Narrative */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 print:break-inside-avoid">
          <NarrativeReport narrative={analysis.narrative} reliability={analysis.reliability} />
        </div>

        {/* Indicators */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 print:break-inside-avoid">
          <IndicatorsList indicators={analysis.indicators} />
        </div>
      </div>

      <div className="h-10 print:hidden" />
    </div>
  );
}
