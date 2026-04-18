"use client";
import { Indicator } from "@/lib/types";
import { HE } from "@/i18n/he";

const SOURCE_ICONS: Record<string, string> = {
  "תמונה": "🖼️", "טקסט": "📝", "ציור": "🎨",
  "מוזיקה": "🎵", "קעקוע": "🖊️", "שאלון": "📋",
};

const DIR_COLORS: Record<string, string> = {
  "חיובי": "text-green-600", "שלילי": "text-red-500", "ניטרלי": "text-gray-500",
};

interface Props { indicators: Indicator[] }

export default function IndicatorsList({ indicators }: Props) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{HE.results.indicators}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="text-right py-2 px-3 font-medium border-b">{HE.results.source}</th>
              <th className="text-right py-2 px-3 font-medium border-b">{HE.results.observation}</th>
              <th className="text-right py-2 px-3 font-medium border-b">{HE.results.trait}</th>
              <th className="text-right py-2 px-3 font-medium border-b">{HE.results.direction}</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((ind, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-2 px-3 whitespace-nowrap">
                  {SOURCE_ICONS[ind.source] ?? "•"} {ind.source}
                </td>
                <td className="py-2 px-3 text-gray-700">{ind.observation}</td>
                <td className="py-2 px-3 font-medium text-indigo-700">{ind.trait}</td>
                <td className={`py-2 px-3 font-medium ${DIR_COLORS[ind.direction] ?? ""}`}>
                  {ind.direction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
