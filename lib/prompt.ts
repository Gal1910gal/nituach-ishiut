import { Part } from "@google/generative-ai";
import { AnalysisInputs } from "./types";
import { QUESTIONS } from "@/components/questionnaire/questions";

function base64ToInlinePart(dataUrl: string, mimeType = "image/jpeg"): Part {
  const base64 = dataUrl.split(",")[1];
  return { inlineData: { data: base64, mimeType } };
}

function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match?.[1] ?? "image/jpeg";
}

export function buildPromptParts(subjectName: string, inputs: AnalysisInputs): Part[] {
  const parts: Part[] = [];

  // ── System instruction as first text part ──────────────────
  let systemText = `אתה מנתח אישיות מקצועי המתמחה במודל Big Five (OCEAN) ובמדריך ASIO לניתוח אישיות.
שמך נבדק: ${subjectName}

מטרתך: לנתח את כל הנתונים שסופקו ולהפיק ניתוח אישיות מובנה ומעמיק.

## מתודולוגיה
1. **תמונה**: נתח על פי Liu et al. (2016) — הבע פנים, יציבה, מבט, לבוש, רקע → Big Five
2. **טקסט**: נתח על פי LBA (Pennebaker) — כינויי גוף, מילות פונקציה, תוכן רגשי, סגנון
3. **ציור**: נתח לחץ עט, גודל, מיקום, פירוט, נושא → Big Five
4. **מוזיקה**: נתח על פי Rentfrow & Gosling (2003) — ז'אנר, טמפו, מצב רוח → Big Five
5. **קעקועים**: נתח על פי Soulliere et al. (2025) — נושא, גודל, מיקום (O בעיקר)
6. **שאלון**: שקול את תשובות המשתמש כמידע נוסף

## 5 ממדי Big Five (OCEAN)
- **O** = Openness to Experience (פתיחות לחוויה): סקרנות, דמיון, אסתטיקה, חדשנות
- **C** = Conscientiousness (מצפוניות): ארגון, משמעת, תכנון, אמינות
- **E** = Extraversion (אקסטרוברסיה): חברותיות, אסרטיביות, מרץ, חיוביות
- **A** = Agreeableness (נעימות): אמפתיה, שיתוף פעולה, אמון, אלטרואיזם
- **N** = Neuroticism (נוירוטיות): חרדה, כעס, דיכאון, פגיעות — ציון גבוה = אי-יציבות

## 30 פאסטות
O: פנטזיה, אסתטיקה, רגשות, חקרנות, רעיונות, ערכים
C: כשירות, סדר, ציות לחובה, שאפתנות, משמעת עצמית, זהירות
E: חממה, חברותיות, אסרטיביות, מרץ, חיפוש ריגושים, רגשות חיוביים
A: אמון, כנות, אלטרואיזם, ציות, צניעות, רכות
N: חרדה, כעסנות, דיכאון, מודעות עצמית, פזיזות, פגיעות

## הנחיות ציון
- ציון 1–10 לכל ממד ופאסטה (5 = ממוצע)
- confidence = רמת ביטחון 0–100 לכל ממד (נמוכה כאשר מקורות מידע מועטים)
- label: בחר מ: "נמוך מאוד" / "נמוך" / "מתחת לממוצע" / "ממוצע" / "מעל הממוצע" / "גבוה" / "גבוה מאוד"
- reliability = אמינות כוללת 0–100 (עולה עם כמות ומגוון המקורות)

## פורמט תשובה — JSON בלבד, ללא טקסט נוסף
\`\`\`json
{
  "bigFive": {
    "O": {"score": 7, "confidence": 80, "label": "גבוה"},
    "C": {"score": 5, "confidence": 70, "label": "ממוצע"},
    "E": {"score": 6, "confidence": 75, "label": "מעל הממוצע"},
    "A": {"score": 8, "confidence": 85, "label": "גבוה"},
    "N": {"score": 4, "confidence": 65, "label": "מתחת לממוצע"}
  },
  "facets": [
    {"name": "פנטזיה", "dimension": "O", "score": 8},
    {"name": "אסתטיקה", "dimension": "O", "score": 7},
    ...כל 30 פאסטות...
  ],
  "narrative": "פסקת פרופיל נרטיבית בעברית, 3-5 פסקאות, מעמיקה ומקצועית",
  "indicators": [
    {"source": "תמונה", "observation": "חיוך אותנטי עם קמטי עיניים", "trait": "אקסטרוברסיה", "direction": "חיובי"},
    ...כל האינדיקטורים שזיהית...
  ],
  "reliability": 78
}
\`\`\`
`;

  // Add questionnaire answers to system text
  if (inputs.questionnaire && Object.keys(inputs.questionnaire).length > 0) {
    systemText += "\n\n## תשובות שאלון המשתמש\n";
    for (const [id, answer] of Object.entries(inputs.questionnaire)) {
      if (!answer || answer === "לא רלוונטי") continue;
      // Find question text
      for (const [type, qs] of Object.entries(QUESTIONS)) {
        const q = qs.find((q) => q.id === id);
        if (q) {
          systemText += `- [${type}] ${q.text}: **${answer}**\n`;
          break;
        }
      }
    }
  }

  if (inputs.music?.length) {
    systemText += "\n\n## רשימת מוזיקה\n";
    inputs.music.forEach((m, i) => {
      systemText += `${i + 1}. "${m.title}" — ${m.artist} (${m.genre})\n`;
    });
  }

  if (inputs.text) {
    systemText += `\n\n## טקסט לניתוח\n${inputs.text}`;
  }

  parts.push({ text: systemText });

  // Add image parts
  if (inputs.image) {
    parts.push({ text: "\n\n## תמונת פרופיל" });
    parts.push(base64ToInlinePart(inputs.image, getMimeType(inputs.image)));
  }

  if (inputs.drawing) {
    parts.push({ text: "\n\n## ציור" });
    parts.push(base64ToInlinePart(inputs.drawing, getMimeType(inputs.drawing)));
  }

  if (inputs.tattoos?.length) {
    parts.push({ text: `\n\n## קעקועים (${inputs.tattoos.length} תמונות)` });
    inputs.tattoos.forEach((t, i) => {
      parts.push({ text: `קעקוע ${i + 1}:` });
      parts.push(base64ToInlinePart(t, getMimeType(t)));
    });
  }

  parts.push({ text: "\n\nהפק את הניתוח בפורמט JSON בלבד, ללא הסברים נוספים מחוץ ל-JSON." });

  return parts;
}
