"use client";
import { useRef } from "react";
import { HE } from "@/i18n/he";
import { QuestionnaireAnswers } from "@/lib/types";
import QuestionSection from "@/components/questionnaire/QuestionSection";

interface Props {
  value: string;
  onChange: (base64: string) => void;
  answers: QuestionnaireAnswers;
  onAnswersChange: (a: QuestionnaireAnswers) => void;
}

export default function DrawingInput({ value, onChange, answers, onAnswersChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {value ? (
          <img src={value} alt="ציור" className="max-h-48 mx-auto rounded-lg object-contain" />
        ) : (
          <>
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-gray-500 text-sm">{HE.inputs.uploadDrawing}</p>
            <p className="text-gray-400 text-xs mt-1">{HE.inputs.dragOrClick}</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 text-xs text-red-500 hover:underline"
        >
          {HE.inputs.remove}
        </button>
      )}
      <QuestionSection inputType="drawing" answers={answers} onChange={onAnswersChange} />
    </div>
  );
}
