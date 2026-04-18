"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { AnalysisInputs, MusicEntry, QuestionnaireAnswers } from "@/lib/types";
import { saveAnalysis } from "@/lib/storage";
import { HE } from "@/i18n/he";
import ImageInput from "@/components/inputs/ImageInput";
import TextInput from "@/components/inputs/TextInput";
import DrawingInput from "@/components/inputs/DrawingInput";
import MusicInput from "@/components/inputs/MusicInput";
import TattooInput from "@/components/inputs/TattooInput";

type TabKey = "image" | "text" | "drawing" | "music" | "tattoos";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "image",   label: HE.tabs.image,    icon: "🖼️" },
  { key: "text",    label: HE.tabs.text,     icon: "📝" },
  { key: "drawing", label: HE.tabs.drawing,  icon: "🎨" },
  { key: "music",   label: HE.tabs.music,    icon: "🎵" },
  { key: "tattoos", label: HE.tabs.tattoos,  icon: "🖊️" },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("image");
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input values
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [drawing, setDrawing] = useState("");
  const [music, setMusic] = useState<MusicEntry[]>([{ title: "", artist: "", genre: "" }]);
  const [tattoos, setTattoos] = useState<string[]>([]);

  // Questionnaire answers per tab
  const [imgAnswers, setImgAnswers] = useState<QuestionnaireAnswers>({});
  const [txtAnswers, setTxtAnswers] = useState<QuestionnaireAnswers>({});
  const [drwAnswers, setDrwAnswers] = useState<QuestionnaireAnswers>({});
  const [musAnswers, setMusAnswers] = useState<QuestionnaireAnswers>({});
  const [tatAnswers, setTatAnswers] = useState<QuestionnaireAnswers>({});

  const allAnswers: QuestionnaireAnswers = {
    ...imgAnswers, ...txtAnswers, ...drwAnswers, ...musAnswers, ...tatAnswers,
  };

  const hasInput = image || text.trim() || drawing || music.some(m => m.title || m.artist) || tattoos.length > 0;

  const handleSubmit = async () => {
    if (!subjectName.trim()) { setError(HE.errors.noName); return; }
    if (!hasInput) { setError(HE.errors.noInput); return; }
    setError("");
    setLoading(true);

    const inputs: AnalysisInputs = {
      ...(image && { image }),
      ...(text.trim() && { text: text.trim() }),
      ...(drawing && { drawing }),
      ...(music.some(m => m.title || m.artist) && { music: music.filter(m => m.title || m.artist) }),
      ...(tattoos.length > 0 && { tattoos }),
      ...(Object.keys(allAnswers).length > 0 && { questionnaire: allAnswers }),
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName: subjectName.trim(), inputs }),
      });
      if (!res.ok) throw new Error(await res.text());
      const analysis = await res.json();

      const id = uuidv4();
      saveAnalysis({ id, createdAt: new Date().toISOString(), subjectName: subjectName.trim(), inputs, ...analysis });
      router.push(`/results/${id}`);
    } catch (e) {
      setError(HE.errors.analysisFailed + " " + String(e));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← חזרה</Link>
        <h1 className="text-xl font-bold text-gray-900">{HE.newAnalysis}</h1>
        <div />
      </div>

      {/* Subject name */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{HE.subjectName}</label>
        <input
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder={HE.subjectNamePlaceholder}
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          dir="auto"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg mb-0.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === "image"   && <ImageInput   value={image}   onChange={setImage}   answers={imgAnswers} onAnswersChange={setImgAnswers} />}
          {activeTab === "text"    && <TextInput    value={text}    onChange={setText}    answers={txtAnswers} onAnswersChange={setTxtAnswers} />}
          {activeTab === "drawing" && <DrawingInput value={drawing} onChange={setDrawing} answers={drwAnswers} onAnswersChange={setDrwAnswers} />}
          {activeTab === "music"   && <MusicInput   value={music}   onChange={setMusic}   answers={musAnswers} onAnswersChange={setMusAnswers} />}
          {activeTab === "tattoos" && <TattooInput  value={tattoos} onChange={setTattoos} answers={tatAnswers} onAnswersChange={setTatAnswers} />}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-base font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {HE.analyzing}
          </span>
        ) : (
          `🔍 ${HE.analyze}`
        )}
      </button>
    </div>
  );
}
