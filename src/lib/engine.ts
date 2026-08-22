import { SECTIONS } from "../data/briefing";
import type {
  Answer,
  Answers,
  ContactAnswer,
  QuestionDef,
  Section,
} from "./types";

const DRAFT_KEY = "rb360-draft-v1";

/* ---------------- defaults ---------------- */

export function defaultAnswer(q: QuestionDef): Answer {
  switch (q.type) {
    case "multi":
      return { kind: "multi", sel: [], text: {} };
    case "single":
      return { kind: "single", value: null, text: "", inline: {} };
    case "text":
      return { kind: "text", value: "" };
    case "scale":
      return { kind: "scale", value: null };
    case "competitors":
      return {
        kind: "competitors",
        rows: [
          { name: "", strong: "", weak: "" },
          { name: "", strong: "", weak: "" },
          { name: "", strong: "", weak: "" },
        ],
      };
    case "grid":
      return { kind: "grid", groups: Object.fromEntries((q.groups ?? []).map((g) => [g.id, []])) };
    case "lines":
      return { kind: "lines", lines: Array(q.lines ?? 3).fill("") };
    case "contact":
      return { kind: "contact", name: "", email: "", phone: "" };
  }
}

export function defaultAnswers(): Answers {
  const a: Answers = {};
  for (const s of SECTIONS) for (const q of s.questions) a[q.id] = defaultAnswer(q);
  return a;
}

/* ---------------- progress ---------------- */

export function isAnswered(q: QuestionDef, a: Answer | undefined): boolean {
  if (!a) return false;
  switch (q.type) {
    case "multi": {
      const m = a as Extract<Answer, { kind: "multi" }>;
      if (m.sel.length === 0) return false;
      const other = q.options?.find((o) => o.other);
      if (other && m.sel.includes(other.id) && !(m.text[other.id] ?? "").trim()) return false;
      return true;
    }
    case "single": {
      const s = a as Extract<Answer, { kind: "single" }>;
      if (!s.value) return false;
      const opt = q.options?.find((o) => o.id === s.value);
      if (opt?.other && !s.text.trim()) return false;
      if (opt?.inputLabel && !(s.inline[opt.id] ?? "").trim()) return false;
      return true;
    }
    case "text":
      return (a as Extract<Answer, { kind: "text" }>).value.trim().length > 0;
    case "scale":
      return (a as Extract<Answer, { kind: "scale" }>).value !== null;
    case "competitors": {
      const c = a as Extract<Answer, { kind: "competitors" }>;
      return c.rows.some((r) => r.name.trim().length > 0);
    }
    case "grid": {
      const g = a as Extract<Answer, { kind: "grid" }>;
      return Object.values(g.groups).some((arr) => arr.length > 0);
    }
    case "lines": {
      const l = a as Extract<Answer, { kind: "lines" }>;
      return l.lines.some((x) => x.trim().length > 0);
    }
    case "contact": {
      const c = a as Extract<Answer, { kind: "contact" }>;
      return c.name.trim().length > 0 && c.email.trim().length > 0 && c.phone.trim().length > 0;
    }
  }
}

export function sectionStats(s: Section, answers: Answers) {
  const total = s.questions.length;
  const answered = s.questions.filter((q) => isAnswered(q, answers[q.id])).length;
  return { total, answered, complete: answered === total };
}

export function overallStats(answers: Answers) {
  let total = 0;
  let answered = 0;
  for (const s of SECTIONS) {
    total += s.questions.length;
    answered += s.questions.filter((q) => isAnswered(q, answers[q.id])).length;
  }
  return { total, answered, pct: total ? Math.round((answered / total) * 100) : 0 };
}

/* ---------------- validation ---------------- */

export function validateContact(a: Answer | undefined): Record<string, string> {
  const c = (a as ContactAnswer | undefined) ?? { kind: "contact" as const, name: "", email: "", phone: "" };
  const errs: Record<string, string> = {};
  if (!c.name.trim()) errs.name = "Indica o nome do responsável";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) errs.email = "Email inválido";
  if (!/^[+\d][\d\s().-]{7,}$/.test(c.phone.trim())) errs.phone = "Telefone inválido";
  return errs;
}

/* ---------------- draft persistence ---------------- */

export interface Draft {
  answers: Answers;
  step: number;
  startedAt: number;
  savedAt: number;
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (!d || typeof d !== "object" || !d.answers) return null;
    return d;
  } catch {
    return null;
  }
}

export function saveDraft(d: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* quota — ignora */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

/* ---------------- export ---------------- */

export function answerLines(q: QuestionDef, a: Answer | undefined): string[] {
  const empty = ["_Por responder_"];
  if (!a) return empty;
  switch (q.type) {
    case "multi": {
      const m = a as Extract<Answer, { kind: "multi" }>;
      if (!m.sel.length) return empty;
      return m.sel.map((id) => {
        const o = q.options!.find((x) => x.id === id)!;
        let s = o.label;
        if (o.other) s = `Outro: ${m.text[id] || "—"}`;
        if (o.inputLabel) s = `${o.label} (${o.inputLabel}: ${m.text[id] || "—"}${o.inputSuffix ?? ""})`;
        return `- ${s}`;
      });
    }
    case "single": {
      const s = a as Extract<Answer, { kind: "single" }>;
      if (!s.value) return empty;
      const o = q.options!.find((x) => x.id === s.value)!;
      if (o.other) return [s.text.trim() ? `- ${s.text.trim()}` : "- Outro"];
      if (o.prefix !== undefined)
        return [`- “${o.prefix} ${s.text.trim() || "…"} ${o.suffix ?? ""}”`.replace(/\s+"/g, "”")];
      if (o.inputLabel) return [`- ${o.label} — ${o.inputLabel}: ${s.inline[o.id] || "—"}`];
      return [`- ${o.label}`];
    }
    case "text": {
      const t = a as Extract<Answer, { kind: "text" }>;
      if (!t.value.trim()) return empty;
      return [`- “${q.prefix ?? ""} ${t.value.trim()} ${q.suffix ?? ""}”`.replace(/\s+"/g, "”")];
    }
    case "scale": {
      const sc = a as Extract<Answer, { kind: "scale" }>;
      if (sc.value === null) return empty;
      return [`- Nível ${sc.value}/5${q.scaleCaptions?.[sc.value - 1] ? ` — ${q.scaleCaptions[sc.value - 1]}` : ""}`];
    }
    case "competitors": {
      const c = a as Extract<Answer, { kind: "competitors" }>;
      const filled = c.rows.filter((r) => r.name.trim() || r.strong.trim() || r.weak.trim());
      if (!filled.length) return empty;
      return filled.map(
        (r, i) =>
          `- Concorrente ${i + 1}: ${r.name || "—"} · Ponto forte: ${r.strong || "—"} · Ponto fraco: ${r.weak || "—"}`
      );
    }
    case "grid": {
      const g = a as Extract<Answer, { kind: "grid" }>;
      const any = Object.values(g.groups).some((x) => x.length);
      if (!any) return empty;
      return (q.groups ?? [])
        .filter((gr) => (g.groups[gr.id] ?? []).length)
        .map((gr) => {
          const labels = (g.groups[gr.id] ?? [])
            .map((id) => gr.options.find((o) => o.id === id)?.label ?? id)
            .join(", ");
          return `- **${gr.label}:** ${labels}`;
        });
    }
    case "lines": {
      const l = a as Extract<Answer, { kind: "lines" }>;
      const filled = l.lines.map((x) => x.trim()).filter(Boolean);
      return filled.length ? filled.map((x) => `- ${x}`) : empty;
    }
    case "contact": {
      const c = a as Extract<Answer, { kind: "contact" }>;
      if (!c.name.trim() && !c.email.trim() && !c.phone.trim()) return empty;
      return [
        `- **Nome:** ${c.name || "—"}`,
        `- **Email:** ${c.email || "—"}`,
        `- **Telefone/WhatsApp:** ${c.phone || "—"}`,
      ];
    }
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function buildMarkdown(answers: Answers): string {
  const d = new Date();
  const stamp = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const lines: string[] = [
    "# BRIEFING DE REBRANDING 360º",
    `_Documento gerado automaticamente · ${stamp}_`,
    "",
  ];
  for (const s of SECTIONS) {
    lines.push(`## ${s.num}. ${s.title.toUpperCase()}`, "");
    for (const q of s.questions) {
      lines.push(`**${q.code}. ${q.title}**`, "");
      lines.push(...answerLines(q, answers[q.id]), "");
    }
  }
  lines.push("---", "", "_Ficha interativa RB·360 — do diagnóstico às métricas._");
  return lines.join("\n");
}

export function downloadMarkdown(md: string) {
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "briefing-rebranding-360.md";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}
