import type { Answers, QuestionDef } from "../lib/types";
import { SECTIONS } from "../data/briefing";
import { answerLines, sectionStats } from "../lib/engine";
import { HardButton, IcAlert, IcCheck, IcEdit, IcSend } from "./primitives";

function summarize(q: QuestionDef, answers: Answers): { lines: string[]; missing: boolean } {
  const raw = answerLines(q, answers[q.id]);
  const missing = raw.length === 1 && raw[0] === "_Por responder_";
  const lines = raw.map((l) =>
    l
      .replace(/^- /, "")
      .replace(/\*\*/g, "")
      .replace(/_Por responder_/, "Por responder")
  );
  return { lines, missing };
}

export function Review({
  answers,
  onJump,
  onGenerate,
  contactInvalid,
}: {
  answers: Answers;
  onJump: (i: number) => void;
  onGenerate: () => void;
  contactInvalid: boolean;
}) {
  let missingTotal = 0;
  const body = SECTIONS.map((s, si) => {
    const st = sectionStats(s, answers);
    missingTotal += st.total - st.answered;
    return (
      <section key={s.id} className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-hard-sm">
        <header className="flex flex-wrap items-center gap-3 border-b-2 border-ink/10 bg-paper/70 px-5 py-3.5">
          <span className="font-mono text-xs font-bold text-leaf">{s.num}</span>
          <h3 className="font-display text-base font-extrabold md:text-lg">{s.title}</h3>
          <span
            className={`ml-auto rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
              st.complete ? "bg-mint text-moss" : "bg-flamesoft text-flame"
            }`}
          >
            {st.complete ? "Completa ✓" : `${st.total - st.answered} em falta`}
          </span>
          <button
            onClick={() => onJump(si)}
            className="flex items-center gap-1.5 rounded-md border-2 border-ink/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <IcEdit size={11} /> Editar
          </button>
        </header>
        <ul className="divide-y divide-ink/8">
          {s.questions.map((q) => {
            const { lines, missing } = summarize(q, answers);
            return (
              <li key={q.id} className="grid gap-1.5 px-5 py-3.5 md:grid-cols-[76px_1fr] md:gap-4">
                <span className="font-mono text-[11px] font-bold text-ink/40">{q.code}</span>
                <div>
                  <p className="text-sm font-semibold leading-snug">{q.title}</p>
                  {missing ? (
                    <button
                      onClick={() => onJump(si)}
                      className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-flame underline decoration-dashed underline-offset-4 transition-colors hover:text-ink"
                    >
                      <IcAlert size={11} /> Por responder — toca para preencher
                    </button>
                  ) : (
                    <ul className="mt-1 space-y-0.5">
                      {lines.map((l, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink/70">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  });

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 -top-9 select-none font-display text-[8rem] font-extrabold leading-none text-ink/6"
        >
          ✳
        </span>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-leaf">Passo final</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Revisão & envio</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60 md:text-base">
          Confere as respostas secção a secção. Podes voltar a qualquer ponto para editar — o documento
          final exporta em Markdown, pronto para a reunião de validação.
        </p>
      </header>

      {contactInvalid && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-flame bg-flamesoft/60 px-5 py-3.5 animate-pop">
          <IcAlert size={17} className="shrink-0 text-flame" />
          <p className="flex-1 text-sm font-semibold text-flame">
            Falta o contacto do responsável para fechar o briefing (secção 08).
          </p>
          <HardButton variant="flame" className="!px-4 !py-2 text-xs" onClick={() => onJump(SECTIONS.length - 1)}>
            Ir para o contacto
          </HardButton>
        </div>
      )}

      {body}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-ink bg-pine px-6 py-5 text-paper shadow-hard">
        <div>
          {missingTotal === 0 ? (
            <p className="flex items-center gap-2 font-display text-lg font-extrabold text-gold">
              <IcCheck size={18} /> Tudo respondido — ficha impecável.
            </p>
          ) : (
            <p className="font-display text-lg font-extrabold">
              {missingTotal} pergunta{missingTotal > 1 ? "s" : ""} por responder
            </p>
          )}
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-paper/55">
            {missingTotal === 0
              ? "Gera o documento quando quiseres"
              : "Podes gerar mesmo assim — as omissões ficam marcadas"}
          </p>
        </div>
        <HardButton variant="gold" onClick={onGenerate} className="px-7 py-3.5 text-base">
          Gerar briefing <IcSend size={16} />
        </HardButton>
        <p className="w-full font-mono text-[10px] uppercase tracking-[0.15em] text-paper/45">
          ✳ Sem envio automático — depois de gerar, descarrega ou copia e envia ao teu consultor
        </p>
      </div>
    </div>
  );
}
