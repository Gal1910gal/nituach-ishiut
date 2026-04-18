"use client";
import { FacetScore, BigFive } from "@/lib/types";
import { HE } from "@/i18n/he";

const DIM_COLORS: Record<keyof BigFive, string> = {
  O: "bg-purple-100 text-purple-800 border-purple-200",
  C: "bg-blue-100 text-blue-800 border-blue-200",
  E: "bg-yellow-100 text-yellow-800 border-yellow-200",
  A: "bg-green-100 text-green-800 border-green-200",
  N: "bg-red-100 text-red-800 border-red-200",
};

const BAR_COLORS: Record<keyof BigFive, string> = {
  O: "bg-purple-500",
  C: "bg-blue-500",
  E: "bg-yellow-500",
  A: "bg-green-500",
  N: "bg-red-400",
};

interface Props { facets: FacetScore[] }

export default function FacetsGrid({ facets }: Props) {
  const grouped = (Object.keys(DIM_COLORS) as (keyof BigFive)[]).reduce((acc, key) => {
    acc[key] = facets.filter((f) => f.dimension === key);
    return acc;
  }, {} as Record<keyof BigFive, FacetScore[]>);

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{HE.results.facets}</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(Object.keys(grouped) as (keyof BigFive)[]).map((dim) => (
          <div key={dim} className={`rounded-xl border p-3 ${DIM_COLORS[dim]}`}>
            <h4 className="font-bold text-sm mb-3">{HE.results.dimensionShort[dim]}</h4>
            <div className="space-y-2">
              {grouped[dim].map((f) => (
                <div key={f.name}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span>{f.name}</span>
                    <span className="font-medium">{f.score}</span>
                  </div>
                  <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${BAR_COLORS[dim]}`}
                      style={{ width: `${(f.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
