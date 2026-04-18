"use client";
import { QUESTIONS, InputType } from "./questions";
import { QuestionnaireAnswers } from "@/lib/types";
import { HE } from "@/i18n/he";

interface Props {
  inputType: InputType;
  answers: QuestionnaireAnswers;
  onChange: (answers: QuestionnaireAnswers) => void;
}

export default function QuestionSection({ inputType, answers, onChange }: Props) {
  const questions = QUESTIONS[inputType];
  if (!questions?.length) return null;

  const handleChange = (id: string, value: string) => {
    onChange({ ...answers, [id]: value });
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-600 mb-3">{HE.questionnaire.title}</h4>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="text-sm font-medium text-gray-700 mb-1">{q.text}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChange(q.id, answers[q.id] === opt ? "" : opt)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    answers[q.id] === opt
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : opt === "לא רלוונטי"
                      ? "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
