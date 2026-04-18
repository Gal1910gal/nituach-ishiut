"use client";
import { HE } from "@/i18n/he";
import { MusicEntry, QuestionnaireAnswers } from "@/lib/types";
import QuestionSection from "@/components/questionnaire/QuestionSection";

interface Props {
  value: MusicEntry[];
  onChange: (entries: MusicEntry[]) => void;
  answers: QuestionnaireAnswers;
  onAnswersChange: (a: QuestionnaireAnswers) => void;
}

const empty = (): MusicEntry => ({ title: "", artist: "", genre: "" });

export default function MusicInput({ value, onChange, answers, onAnswersChange }: Props) {
  const update = (index: number, field: keyof MusicEntry, val: string) => {
    const updated = value.map((e, i) => (i === index ? { ...e, [field]: val } : e));
    onChange(updated);
  };

  return (
    <div>
      <div className="space-y-3">
        {value.map((entry, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder={HE.inputs.songTitle}
              value={entry.title}
              onChange={(e) => update(i, "title", e.target.value)}
              dir="auto"
            />
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder={HE.inputs.artist}
              value={entry.artist}
              onChange={(e) => update(i, "artist", e.target.value)}
              dir="auto"
            />
            <input
              className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder={HE.inputs.genre}
              value={entry.genre}
              onChange={(e) => update(i, "genre", e.target.value)}
              dir="auto"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, empty()])}
        className="mt-3 flex items-center gap-1 text-sm text-indigo-600 hover:underline"
      >
        <span className="text-lg">+</span> {HE.inputs.addSong}
      </button>
      <QuestionSection inputType="music" answers={answers} onChange={onAnswersChange} />
    </div>
  );
}
