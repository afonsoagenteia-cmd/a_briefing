import { useState } from "react";
import type {
  Accent,
  Answer,
  Answers,
  CompetitorsAnswer,
  ContactAnswer,
  GridAnswer,
  LinesAnswer,
  MultiAnswer,
  OptionDef,
  QuestionDef,
  ScaleAnswer,
  SingleAnswer,
  TextAnswer,
} from "../lib/types";
import { validateContact } from "../lib/engine";
import { IcAlert, IcCheck, IcDot, IcMail, IcPhone, IcUser } from "./primitives";

export interface QProps {
  question: QuestionDef;
  answer: Answer;
  accent: Accent;
  index: number;
  showErrors: boolean;
  onChange: (a: Answer) => void;
}

const ACC: Record<Accent, { chip: string; soft: string; softHover: string; var: string }> = {
  leaf: { chip: "bg-leaf text-paper", soft: "bg-mint/60", softHover: "hover:bg-mint/45", var: "#1f5fd6" },
  gold: { chip: "bg-gold text-[#f4f7ff]", soft: "bg-goldsoft/70", softHover: "hover:bg-goldsoft/50", var: "#2f6bff" },
  flame: { chip: "bg-flame text-paper", soft: "bg-flamesoft/70", softHover: "hover:bg-flamesoft/50", var: "#d94320" },
};

function accentVar(acc: Accent) {
  return acc === "leaf" ? "#1f5fd6" : acc === "gold" ? "#2f6bff" : "#d94320";
}
function focusVar(acc: Accent) {
  return acc === "leaf" ? "#7fb0ff" : acc === "gold" ? "#7fa5ff" : "#ff9d80";
}

function QCard({
  question: q,
  accent,
  index,
  children,
}: {
  question: QuestionDef;
  accent: Accent;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <section className="animate-rise rounded-xl border-2 border-ink bg-card p-5 shadow-hard-sm md:p-6" style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}>
      <header className="mb-4 flex items-start gap-3.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink font-mono text-[11px] font-bold shadow-hard-sm ${ACC[accent].chip}`}>
          {q.code}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-snug md:text-xl">{q.title}</h3>
          {q.hint && <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">{q.hint}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function OptionCheck({
  opt,
  checked,
  acc,
  onClick,
  disabled,
}: {
  opt: OptionDef;
  checked: boolean;
  acc: Accent;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !checked}
      className={`group flex w-full items-center gap-3 rounded-lg border-2 px-3.5 py-2.5 text-left transition-all duration-150 ${
        checked
          ? `border-ink ${ACC[acc].soft} shadow-hard-sm`
          : `border-ink/15 bg-paper/60 ${ACC[acc].softHover} hover:border-ink/50`
      } ${disabled && !checked ? "cursor-not-allowed opacity-35" : "active:translate-y-px"}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150 ${
          checked ? "border-ink bg-ink text-paper" : "border-ink/30 bg-card group-hover:border-ink/60"
        }`}
      >
        {checked && <IcCheck size={12} />}
      </span>
      <span className={`text-sm font-medium leading-snug ${checked ? "text-ink" : "text-ink/75"}`}>{opt.label}</span>
    </button>
  );
}

function OptionRadio({
  opt,
  checked,
  acc,
  onClick,
}: {
  opt: OptionDef;
  checked: boolean;
  acc: Accent;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg border-2 px-3.5 py-2.5 text-left transition-all duration-150 ${
        checked
          ? `border-ink ${ACC[acc].soft} shadow-hard-sm`
          : `border-ink/15 bg-paper/60 ${ACC[acc].softHover} hover:border-ink/50`
      } active:translate-y-px`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
          checked ? "border-ink" : "border-ink/30 group-hover:border-ink/60"
        }`}
      >
        <span className={`h-2.5 w-2.5 rounded-full transition-transform duration-150 ${checked ? "scale-100 bg-ink" : "scale-0"}`} />
      </span>
      <span className={`text-sm font-medium leading-snug ${checked ? "text-ink" : "text-ink/75"}`}>{opt.label}</span>
    </button>
  );
}

function renderQuestion(p: QProps) {
  const { question: q, accent: acc } = p;

  /* ---------- multi ---------- */
  if (q.type === "multi") {
    const a = p.answer as MultiAnswer;
    const [shake, setShake] = useState(false);
    const atMax = q.max !== undefined && a.sel.length >= q.max;
    const toggle = (id: string) => {
      const on = a.sel.includes(id);
      if (!on && atMax) {
        setShake(true);
        return;
      }
      p.onChange({ ...a, sel: on ? a.sel.filter((x) => x !== id) : [...a.sel, id] });
    };
    const setText = (id: string, v: string) => p.onChange({ ...a, text: { ...a.text, [id]: v } });
    return (
      <div key={q.id}>
        {q.max !== undefined && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: q.max }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i < a.sel.length ? ACC[acc].chip : "bg-ink/12"}`}
                />
              ))}
            </div>
            <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${atMax ? "text-flame" : "text-ink/40"}`}>
              {a.sel.length}/{q.max} selecionadas
            </span>
          </div>
        )}
        <div className={shake ? "animate-shake" : ""} onAnimationEnd={() => setShake(false)}>
          <div className="grid gap-2 sm:grid-cols-2">
            {(q.options ?? []).map((o) => (
              <OptionCheck key={o.id} opt={o} acc={acc} checked={a.sel.includes(o.id)} disabled={atMax} onClick={() => toggle(o.id)} />
            ))}
          </div>
          {atMax && shake && (
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-flame animate-pop">
              <IcAlert size={12} /> Limite de {q.max} opções atingido — desmarca uma para trocar
            </p>
          )}
        </div>
        {(q.options ?? [])
          .filter((o) => (o.other || o.inputLabel) && a.sel.includes(o.id))
          .map((o) => (
            <div key={`in-${o.id}`} className="mt-3 animate-pop">
              <input
                value={a.text[o.id] ?? ""}
                onChange={(e) => setText(o.id, e.target.value)}
                placeholder={o.inputLabel ? `${o.inputLabel}…` : "Especifica…"}
                className="w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm font-medium outline-none transition-shadow placeholder:text-ink/35"
                onFocus={(e) => (e.currentTarget.style.borderColor = accentVar(acc))}
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              />
            </div>
          ))}
      </div>
    );
  }

  /* ---------- single ---------- */
  if (q.type === "single") {
    const a = p.answer as SingleAnswer;
    const pick = (id: string) => p.onChange({ ...a, value: a.value === id ? null : id });
    const selected = (q.options ?? []).find((o) => o.id === a.value);
    return (
      <div key={q.id}>
        <div className="grid gap-2 sm:grid-cols-2">
          {(q.options ?? []).map((o) => (
            <OptionRadio key={o.id} opt={o} acc={acc} checked={a.value === o.id} onClick={() => pick(o.id)} />
          ))}
        </div>
        {selected?.other && (
          <div className="mt-3 animate-pop">
            <input
              autoFocus
              value={a.text}
              onChange={(e) => p.onChange({ ...a, text: e.target.value })}
              placeholder="Especifica…"
              className="w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm font-medium outline-none placeholder:text-ink/35"
              onFocus={(e) => (e.currentTarget.style.borderColor = accentVar(acc))}
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            />
          </div>
        )}
        {selected?.inputLabel && (
          <div className="mt-3 animate-pop">
            <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-ink/45">
              {selected.inputLabel}
            </label>
            <input
              autoFocus
              value={a.inline[selected.id] ?? ""}
              onChange={(e) => p.onChange({ ...a, inline: { ...a.inline, [selected.id]: e.target.value } })}
              placeholder="Escreve aqui…"
              className="w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm font-medium outline-none placeholder:text-ink/35"
              onFocus={(e) => (e.currentTarget.style.borderColor = accentVar(acc))}
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            />
          </div>
        )}
        {selected?.prefix !== undefined && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border-2 border-ink bg-paper px-4 py-3.5 animate-pop">
            <span className="font-display text-base font-bold md:text-lg">{selected.prefix}</span>
            <input
              autoFocus
              value={a.text}
              onChange={(e) => p.onChange({ ...a, text: e.target.value })}
              placeholder="…"
              className="min-w-[220px] flex-1 border-b-2 border-ink/25 bg-transparent px-1 py-0.5 font-bold outline-none transition-colors placeholder:font-normal placeholder:text-ink/30 md:text-lg"
              onFocus={(e) => (e.currentTarget.style.borderColor = accentVar(acc))}
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            />
            {selected.suffix && <span className="font-display text-base font-bold md:text-lg">{selected.suffix}</span>}
          </div>
        )}
      </div>
    );
  }

  /* ---------- text ---------- */
  if (q.type === "text") {
    const a = p.answer as TextAnswer;
    return (
      <div key={q.id} className="flex flex-wrap items-center gap-2 rounded-lg border-2 border-ink bg-paper px-4 py-3.5">
        {q.prefix && <span className="font-display text-base font-bold md:text-lg">{q.prefix}</span>}
        <input
          value={a.value}
          onChange={(e) => p.onChange({ ...a, value: e.target.value })}
          placeholder={q.placeholder}
          className="min-w-[220px] flex-1 border-b-2 border-ink/25 bg-transparent px-1 py-0.5 font-bold outline-none transition-colors placeholder:font-normal placeholder:text-ink/30 md:text-lg"
          onFocus={(e) => (e.currentTarget.style.borderColor = accentVar(acc))}
          onBlur={(e) => (e.currentTarget.style.borderColor = "")}
        />
        {q.suffix && <span className="font-display text-base font-bold md:text-lg">{q.suffix}</span>}
      </div>
    );
  }

  /* ---------- scale ---------- */
  if (q.type === "scale") {
    const a = p.answer as ScaleAnswer;
    const captions = q.scaleCaptions ?? [];
    return (
      <div key={q.id}>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const on = a.value === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => p.onChange({ ...a, value: on ? null : n })}
                className={`flex h-12 items-center justify-center rounded-lg border-2 font-display text-lg font-extrabold transition-all duration-150 md:h-14 md:w-14 ${
                  on
                    ? `${ACC[acc].chip} border-ink shadow-hard-sm -translate-y-0.5`
                    : "border-ink/15 bg-paper/60 hover:border-ink/50 hover:-translate-y-0.5"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] font-bold uppercase tracking-wider text-ink/40 md:text-[10px]">
          <span className="max-w-[46%] text-left">{q.scaleLow}</span>
          <span className="max-w-[46%] text-right">{q.scaleHigh}</span>
        </div>
        <div className="mt-3 h-8">
          {a.value && (
            <p key={a.value} className="rounded-md border-2 border-ink/12 bg-paper px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide animate-pop">
              Nível {a.value} — {captions[a.value - 1]}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ---------- competitors ---------- */
  if (q.type === "competitors") {
    const a = p.answer as CompetitorsAnswer;
    const set = (i: number, k: keyof CompetitorsAnswer["rows"][number], v: string) => {
      const rows = a.rows.map((r, ri) => (ri === i ? { ...r, [k]: v } : r));
      p.onChange({ ...a, rows });
    };
    const cell = "w-full rounded-lg border-2 border-ink/15 bg-paper px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/30";
    return (
      <div key={q.id} className="space-y-2.5">
        {a.rows.map((r, i) => (
          <div key={i} className="grid items-center gap-2 rounded-lg border-2 border-ink/10 bg-paper/50 p-2.5 md:grid-cols-[1.3fr_1fr_1fr_auto]">
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/40 md:col-span-4 md:hidden">
              Concorrente {i + 1}
            </span>
            <input value={r.name} onChange={(e) => set(i, "name", e.target.value)} placeholder={`Concorrente ${i + 1}`} className={`${cell} font-semibold`} />
            <input value={r.strong} onChange={(e) => set(i, "strong", e.target.value)} placeholder="Ponto forte" className={cell} />
            <input value={r.weak} onChange={(e) => set(i, "weak", e.target.value)} placeholder="Ponto fraco" className={cell} />
            <span className="hidden font-mono text-[10px] font-bold text-ink/25 md:block">{String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
    );
  }

  /* ---------- grid (canais) ---------- */
  if (q.type === "grid") {
    const a = p.answer as GridAnswer;
    const toggle = (gid: string, oid: string) => {
      const cur = a.groups[gid] ?? [];
      const opt = q.groups!.find((g) => g.id === gid)!.options.find((o) => o.id === oid)!;
      let next: string[];
      if (cur.includes(oid)) {
        next = cur.filter((x) => x !== oid);
      } else if (opt.exclusive) {
        next = [oid];
      } else {
        const hasExclusive = cur.some(
          (x) => q.groups!.find((g) => g.id === gid)!.options.find((o) => o.id === x)?.exclusive
        );
        next = hasExclusive ? [oid] : [...cur, oid];
      }
      p.onChange({ ...a, groups: { ...a.groups, [gid]: next } });
    };
    return (
      <div key={q.id} className="grid gap-3 md:grid-cols-2">
        {(q.groups ?? []).map((g) => {
          const sel = a.groups[g.id] ?? [];
          const off = sel.some(
            (x) => g.options.find((o) => o.id === x)?.exclusive
          );
          return (
            <div key={g.id} className={`rounded-lg border-2 p-3 transition-colors ${off ? "border-ink/15 bg-paper/40" : "border-ink bg-card shadow-hard-sm"}`}>
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <h4 className="font-display text-base font-extrabold">{g.label}</h4>
                <span className={`h-2 w-2 rounded-full transition-colors ${sel.length ? "bg-leaf" : "bg-ink/15"}`} />
              </div>
              <div className="space-y-1.5">
                {g.options.map((o) => {
                  const on = sel.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle(g.id, o.id)}
                      className={`flex w-full items-center gap-2.5 rounded-md border-2 px-2.5 py-1.5 text-left text-[13px] font-medium transition-all duration-150 ${
                        on
                          ? o.exclusive
                            ? "border-ink bg-moss text-paper"
                            : `border-ink ${ACC[acc].soft}`
                          : "border-transparent bg-paper/70 hover:border-ink/30"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          on ? "border-ink bg-ink text-paper" : "border-ink/30"
                        }`}
                      >
                        {on && <IcCheck size={10} />}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------- lines ---------- */
  if (q.type === "lines") {
    const a = p.answer as LinesAnswer;
    const set = (i: number, v: string) => {
      const lines = a.lines.map((x, xi) => (xi === i ? v : x));
      p.onChange({ ...a, lines });
    };
    return (
      <div key={q.id} className="space-y-2.5">
        {a.lines.map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold text-ink/30">+{i + 1}</span>
            <input
              value={l}
              onChange={(e) => set(i, e.target.value)}
              placeholder={`Informação adicional ${i + 1}…`}
              className="flex-1 border-b-2 border-ink/20 bg-transparent px-1 py-1.5 text-sm font-medium outline-none transition-colors placeholder:text-ink/30"
              onFocus={(e) => (e.currentTarget.style.borderColor = accentVar(acc))}
              onBlur={(e) => (e.currentTarget.style.borderColor = "")}
            />
          </div>
        ))}
      </div>
    );
  }

  /* ---------- contact ---------- */
  const a = p.answer as ContactAnswer;
  const errs = p.showErrors ? validateContact(p.answer) : {};
  const set = (k: keyof ContactAnswer, v: string) => p.onChange({ ...a, [k]: v });
  const field = (
    icon: React.ReactNode,
    k: keyof ContactAnswer,
    label: string,
    placeholder: string,
    type = "text"
  ) => {
    const err = errs[k];
    return (
      <label className="block">
        <span className={`mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${err ? "text-flame" : "text-ink/45"}`}>
          {icon} {label}
        </span>
        <input
          type={type}
          value={a[k]}
          onChange={(e) => set(k, e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border-2 bg-paper px-3.5 py-2.5 text-sm font-medium outline-none transition-colors placeholder:text-ink/30 ${
            err ? "border-flame animate-shake" : "border-ink"
          }`}
          onFocus={(e) => {
            if (!err) e.currentTarget.style.borderColor = focusVar(acc);
          }}
          onBlur={(e) => {
            if (!err) e.currentTarget.style.borderColor = "";
          }}
        />
        {err && (
          <span className="mt-1 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide text-flame animate-pop">
            <IcAlert size={10} /> {err}
          </span>
        )}
      </label>
    );
  };
  return (
    <div key={q.id} className="grid gap-4 md:grid-cols-3">
      {field(<IcUser size={12} />, "name", "Nome", "Quem lidera o projeto?")}
      {field(<IcMail size={12} />, "email", "Email", "nome@empresa.ao", "email")}
      {field(<IcPhone size={12} />, "phone", "Telefone / WhatsApp", "+244 9xx xxx xxx", "tel")}
    </div>
  );
}

export function QuestionCard(p: QProps) {
  return (
    <QCard question={p.question} accent={p.accent} index={p.index}>
      {renderQuestion(p)}
    </QCard>
  );
}

export function LimitPill({ used, max }: { used: number; max: number }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${used >= max ? "border-flame text-flame" : "border-ink/20 text-ink/45"}`}>
      <IcDot size={7} /> {used}/{max}
    </span>
  );
}
