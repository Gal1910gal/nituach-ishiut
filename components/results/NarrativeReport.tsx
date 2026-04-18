"use client";
import { HE } from "@/i18n/he";

interface Props { narrative: string; reliability: number }

export default function NarrativeReport({ narrative, reliability }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{HE.results.narrative}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{HE.results.reliability}:</span>
          <div className="flex items-center gap-1">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${reliability}%`,
                  background: reliability > 70 ? "#22c55e" : reliability > 40 ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{reliability}%</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 print:bg-white">
        {narrative.split("\n").filter(Boolean).map((para, i) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
