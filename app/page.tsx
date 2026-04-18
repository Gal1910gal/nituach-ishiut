import Link from "next/link";
import { HE } from "@/i18n/he";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{HE.appName}</h1>
        <p className="text-gray-500 mb-10 text-sm leading-relaxed">
          ניתוח אישיות מקצועי בשיטת Big Five (OCEAN) — תמונות, טקסט, ציורים, מוזיקה וקעקועים
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/analyze"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <span>+</span> {HE.newAnalysis}
          </Link>
          <Link
            href="/library"
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            📚 {HE.library}
          </Link>
        </div>
      </div>
    </div>
  );
}
