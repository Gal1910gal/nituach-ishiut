"use client";
import Link from "next/link";
import { AnalysisResult } from "@/lib/types";
import { HE } from "@/i18n/he";

interface Props {
  analysis: AnalysisResult;
  onDelete: (id: string) => void;
}

export default function AnalysisCard({ analysis, onDelete }: Props) {
  const date = new Date(analysis.createdAt).toLocaleDateString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const dims = Object.keys(analysis.bigFive) as (keyof typeof analysis.bigFive)[];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{analysis.subjectName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5">
          <span className="text-xs text-gray-500">אמינות:</span>
          <span className="text-xs font-medium text-gray-700">{analysis.reliability}%</span>
        </div>
      </div>

      {/* Mini Big Five bars */}
      <div className="space-y-1.5 mb-4">
        {dims.map((dim) => (
          <div key={dim} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16 text-left">{HE.results.dimensionShort[dim]}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${(analysis.bigFive[dim].score / 10) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 w-4">{analysis.bigFive[dim].score}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/results/${analysis.id}`}
          className="flex-1 text-center bg-indigo-600 text-white text-sm py-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          צפה בניתוח
        </Link>
        <button
          onClick={() => onDelete(analysis.id)}
          className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm"
        >
          מחק
        </button>
      </div>
    </div>
  );
}
