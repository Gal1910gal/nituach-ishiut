"use client";
import { useRef } from "react";
import { HE } from "@/i18n/he";
import { QuestionnaireAnswers } from "@/lib/types";
import QuestionSection from "@/components/questionnaire/QuestionSection";
import { compressImage } from "@/lib/imageUtils";

interface Props {
  value: string[];
  onChange: (images: string[]) => void;
  answers: QuestionnaireAnswers;
  onAnswersChange: (a: QuestionnaireAnswers) => void;
}

export default function TattooInput({ value, onChange, answers, onAnswersChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const compressed = await compressImage(file);
    onChange([...value, compressed]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div key={i} className="relative">
            <img src={img} alt={`קעקוע ${i + 1}`} className="w-24 h-24 object-cover rounded-xl border" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
            >
              ×
            </button>
          </div>
        ))}
        <div
          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <span className="text-2xl text-gray-400">+</span>
          <span className="text-xs text-gray-400 mt-1">{HE.inputs.addTattoo}</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <QuestionSection inputType="tattoos" answers={answers} onChange={onAnswersChange} />
    </div>
  );
}
