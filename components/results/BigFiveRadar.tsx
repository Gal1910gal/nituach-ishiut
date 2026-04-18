"use client";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { BigFive } from "@/lib/types";
import { HE } from "@/i18n/he";

interface Props { bigFive: BigFive }

export default function BigFiveRadar({ bigFive }: Props) {
  const data = (Object.keys(bigFive) as (keyof BigFive)[]).map((key) => ({
    subject: HE.results.dimensionShort[key],
    score: bigFive[key].score,
    fullMark: 10,
  }));

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{HE.results.bigFive}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fill: "#374151" }} />
          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
          <Radar name="ציון" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
          <Tooltip formatter={(v) => [`${v}/10`, "ציון"]} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Score cards */}
      <div className="grid grid-cols-5 gap-3 mt-4">
        {(Object.keys(bigFive) as (keyof BigFive)[]).map((key) => {
          const d = bigFive[key];
          return (
            <div key={key} className="bg-indigo-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-indigo-700">{d.score}</div>
              <div className="text-xs font-medium text-indigo-900 mt-1">{HE.results.dimensionShort[key]}</div>
              <div className="text-xs text-gray-500 mt-0.5">{d.label}</div>
              <div className="text-xs text-gray-400 mt-1">ביטחון: {d.confidence}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
