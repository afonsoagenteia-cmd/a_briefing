import type { Answers } from "../lib/types";
import { SECTIONS } from "../data/briefing";
import { sectionStats } from "../lib/engine";
import { Dial, IcCheck, IcSend } from "./primitives";

export function Sidebar({
  answers,
  step,
  onJump,
}: {
  answers: Answers;
  step: number;
  onJump: (i: number) => void;
}) {
  let answered = 0;
  let total = 0;
  return (
    <aside className="noise sticky top-[92px] hidden max-h-[calc(100vh-116px)] flex-col overflow-hidden rounded-xl border-2 border-ink bg-pine text-paper shadow-hard lg:flex">
      <div className="border-b border-paper/15 px-4 py-3.5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Índice da ficha</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2.5">
        {SECTIONS.map((s, i) => {
          const st = sectionStats(s, answers);
          answered += st.answered;
          total += st.total;
          const active = step === i;
          return (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              className={`group mb-1 flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-all duration-150 ${
                active
                  ? "border-gold bg-paper text-ink shadow-hard-sm"
                  : "border-transparent hover:border-paper/25 hover:bg-paper/5"
              }`}
            >
              <span
                className={`font-mono text-[11px] font-bold ${active ? "text-flame" : st.complete ? "text-gold" : "text-paper/45"}`}
              >
                {s.num}
              </span>
              <span className="flex-1 font-display text-[13px] font-bold leading-tight">{s.title}</span>
              {st.complete ? (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${active ? "bg-leaf text-paper" : "bg-gold text-ink"}`}>
                  <IcCheck size={11} />
                </span>
              ) : (
                <span className={`font-mono text-[10px] font-bold ${active ? "text-ink/50" : "text-paper/40"}`}>
                  {st.answered}/{st.total}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={() => onJump(SECTIONS.length)}
          className={`mt-2 flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-all duration-150 ${
            step === SECTIONS.length
              ? "border-gold bg-gold text-[#f4f7ff] shadow-hard-sm"
              : "border-dashed border-paper/30 hover:border-gold hover:text-gold"
          }`}
        >
          <IcSend size={13} />
          <span className="flex-1 font-display text-[13px] font-extrabold uppercase tracking-wide">Revisão & envio</span>
        </button>
      </nav>
      <div className="flex items-center justify-center gap-4 border-t border-paper/15 px-4 py-4">
        <Dial value={total ? Math.round((answered / total) * 100) : 0} size={84} label="completo" dark />
        <p className="max-w-[110px] font-mono text-[10px] leading-relaxed text-paper/55">
          {answered} de {total} perguntas respondidas
        </p>
      </div>
    </aside>
  );
}

export function MobileSteps({
  answers,
  step,
  onJump,
}: {
  answers: Answers;
  step: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto border-b-2 border-ink/10 bg-card/70 px-4 py-2.5 lg:hidden">
      {SECTIONS.map((s, i) => {
        const st = sectionStats(s, answers);
        const active = step === i;
        return (
          <button
            key={s.id}
            onClick={() => onJump(i)}
            className={`relative shrink-0 rounded-lg border-2 px-3 py-1.5 font-mono text-[11px] font-bold transition-all ${
              active
                ? "border-ink bg-ink text-gold"
                : st.complete
                  ? "border-leaf/60 bg-mint/60 text-moss"
                  : "border-ink/15 bg-paper/60 text-ink/60"
            }`}
          >
            {s.num}
            <span
              className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-ink ${
                st.complete ? "bg-leaf" : st.answered > 0 ? "bg-gold" : "bg-sand"
              }`}
            />
          </button>
        );
      })}
      <button
        onClick={() => onJump(SECTIONS.length)}
        className={`shrink-0 rounded-lg border-2 px-3 py-1.5 font-mono text-[11px] font-bold ${
          step === SECTIONS.length ? "border-ink bg-gold text-[#f4f7ff]" : "border-ink/15 bg-paper/60 text-ink/60"
        }`}
      >
        ✳
      </button>
    </div>
  );
}
