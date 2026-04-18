"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnalysisResult } from "@/lib/types";
import { getAnalyses, deleteAnalysis } from "@/lib/storage";
import { HE } from "@/i18n/he";
import AnalysisCard from "@/components/library/AnalysisCard";

export default function LibraryPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setAnalyses(getAnalyses());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("למחוק ניתוח זה?")) return;
    deleteAnalysis(id);
    setAnalyses(getAnalyses());
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6 pt-4">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← ראשי</Link>
        <h1 className="text-xl font-bold text-gray-900">📚 {HE.library}</h1>
        <Link
          href="/analyze"
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          + {HE.newAnalysis}
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🗂️</div>
          <p>{HE.noAnalyses}</p>
          <Link href="/analyze" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
            התחל ניתוח ראשון
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map((a) => (
            <AnalysisCard key={a.id} analysis={a} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
