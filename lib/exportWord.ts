import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType,
} from "docx";
import { saveAs } from "file-saver";
import { AnalysisResult, BigFive } from "./types";

const HE_DIMS: Record<keyof BigFive, string> = {
  O: "פתיחות לחוויה",
  C: "מצפוניות",
  E: "אקסטרוברסיה",
  A: "נעימות",
  N: "נוירוטיות",
};

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2): Paragraph {
  return new Paragraph({
    text,
    heading: level,
    bidirectional: true,
    spacing: { before: 300, after: 100 },
  });
}

function para(text: string, bold = false): Paragraph {
  return new Paragraph({
    bidirectional: true,
    children: [new TextRun({ text, bold, font: "David", size: 24 })],
    spacing: { after: 80 },
  });
}

function divider(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: "─────────────────────────────", color: "CCCCCC" })],
    spacing: { before: 200, after: 200 },
  });
}

export async function exportToWord(analysis: AnalysisResult): Promise<void> {
  const date = new Date(analysis.createdAt).toLocaleDateString("he-IL");
  const children: (Paragraph | Table)[] = [];

  // ── Title ────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "ניתוח אישיות ASIO", bold: true, size: 40, font: "David" })],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      bidirectional: true,
    }),
    new Paragraph({
      children: [new TextRun({ text: `נבדק: ${analysis.subjectName}  |  תאריך: ${date}  |  אמינות: ${analysis.reliability}%`, size: 22, font: "David", color: "666666" })],
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 300 },
    }),
    divider(),
  );

  // ── Big Five Scores ──────────────────────────────────────
  children.push(heading("Big Five — חמשת הממדים", HeadingLevel.HEADING_1));

  const bigFiveRows = [
    new TableRow({
      children: ["ממד", "ציון", "רמת ביטחון", "תיאור"].map((h) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, font: "David", size: 22 })], bidirectional: true })],
          shading: { type: ShadingType.CLEAR, fill: "E0E7FF" },
        })
      ),
    }),
    ...( Object.keys(analysis.bigFive) as (keyof BigFive)[]).map((key) => {
      const d = analysis.bigFive[key];
      return new TableRow({
        children: [
          new TableCell({ children: [para(HE_DIMS[key] + " (" + key + ")")] }),
          new TableCell({ children: [para(String(d.score) + " / 10", true)] }),
          new TableCell({ children: [para(d.confidence + "%")] }),
          new TableCell({ children: [para(d.label)] }),
        ],
      });
    }),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: bigFiveRows,
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: "C7D2FE" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "C7D2FE" },
        left:   { style: BorderStyle.SINGLE, size: 1, color: "C7D2FE" },
        right:  { style: BorderStyle.SINGLE, size: 1, color: "C7D2FE" },
      },
    }),
    divider(),
  );

  // ── Facets ───────────────────────────────────────────────
  children.push(heading("30 פאסטות — ניתוח מעמיק", HeadingLevel.HEADING_1));

  const grouped: Record<string, typeof analysis.facets> = {};
  analysis.facets.forEach((f) => {
    if (!grouped[f.dimension]) grouped[f.dimension] = [];
    grouped[f.dimension].push(f);
  });

  (Object.keys(analysis.bigFive) as (keyof BigFive)[]).forEach((dim) => {
    const facets = grouped[dim] ?? [];
    if (!facets.length) return;
    children.push(para(HE_DIMS[dim], true));
    facets.forEach((f) => {
      children.push(
        new Paragraph({
          bidirectional: true,
          children: [
            new TextRun({ text: `  • ${f.name}: `, font: "David", size: 22 }),
            new TextRun({ text: `${f.score}/10`, bold: true, font: "David", size: 22, color: "4F46E5" }),
          ],
          spacing: { after: 40 },
        })
      );
    });
    children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
  });

  children.push(divider());

  // ── Narrative ────────────────────────────────────────────
  children.push(heading("פרופיל נרטיבי", HeadingLevel.HEADING_1));
  analysis.narrative.split("\n").filter(Boolean).forEach((line) => {
    children.push(para(line));
  });
  children.push(divider());

  // ── Indicators ───────────────────────────────────────────
  children.push(heading("אינדיקטורים ומקורות", HeadingLevel.HEADING_1));

  const indRows = [
    new TableRow({
      children: ["מקור", "תצפית", "תכונה", "כיוון"].map((h) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, font: "David", size: 22 })], bidirectional: true })],
          shading: { type: ShadingType.CLEAR, fill: "F3F4F6" },
        })
      ),
    }),
    ...analysis.indicators.map((ind) =>
      new TableRow({
        children: [
          new TableCell({ children: [para(ind.source)] }),
          new TableCell({ children: [para(ind.observation)] }),
          new TableCell({ children: [para(ind.trait)] }),
          new TableCell({ children: [para(ind.direction)] }),
        ],
      })
    ),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: indRows,
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        left:   { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        right:  { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      },
    })
  );

  // ── Build & Save ─────────────────────────────────────────
  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: {
          run: { font: "David", size: 24, rightToLeft: true },
          paragraph: { },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `ניתוח_${analysis.subjectName}_${date.replace(/\//g, "-")}.docx`);
}
