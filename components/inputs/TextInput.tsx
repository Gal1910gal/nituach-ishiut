"use client";
import { HE } from "@/i18n/he";
import { QuestionnaireAnswers } from "@/lib/types";
import QuestionSection from "@/components/questionnaire/QuestionSection";

interface Props {
  value: string;
  onChange: (text: string) => void;
  answers: QuestionnaireAnswers;
  onAnswersChange: (a: QuestionnaireAnswers) => void;
}

export default function TextInput({ value, onChange, answers, onAnswersChange }: Props) {
  return (
    <div>
      <textarea
        className="w-full h-48 border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder={HE.inputs.textPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="auto"
      />
      <p className="text-xs text-gray-400 mt-1">{value.length} תווים</p>
      <QuestionSection inputType="text" answers={answers} onChange={onAnswersChange} />
    </div>
  );
}
