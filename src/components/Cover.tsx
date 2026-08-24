import { TOTAL_QUESTIONS, SECTIONS, MARQUEE_ITEMS } from "../data/briefing";
import { Dial, HardButton, IcAlert, IcArrowR, IcDot, IcGem, IcLock, Marquee, Stamp } from "./primitives";

const HOWTO = [
  {
    n: "01",
    t: "Formato digital, zero fricção",
    d: "Preenche aqui mesmo — no fim, exportas em Markdown para partilha ou para o teu Typeform/Google Forms.",
  },
  {
    n: "02",
    t: "15–20 minutos",
    d: "É o tempo médio de preenchimento com calma. O rascunho guarda-se sozinho no teu navegador.",
  },
  {
    n: "03",
    t: "Reunião de validação",
    d: "Agenda uma sessão de 1 hora para rever as respostas e aprofundar os pontos-chave com a equipa.",
  },
  {
    n: "04",
    t: "Enviar ao estúdio",
    d: "No final, descarrega o ficheiro .md (ou copia o texto) e envia-nos por WhatsApp ou email — seguimos com a estratégia completa.",
  },
];

export function Cover({
  hasDraft,
  draftPct,
  onStart,
}: {
  hasDraft: boolean;
  draftPct: number;
  onStart: (fresh: boolean) => void;
}) {
  return (
    <div className="min-h-screen">
      <Marquee items={MARQUEE_ITEMS} />

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* masthead */}
        <div className="grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.35fr_1fr]">
          <div className="animate-rise">
            <h1 className="font-display font-extrabold leading-[0.94] tracking-tight">
              <span className="block text-[clamp(2.5rem,7vw,5.2rem)]">Antes de</span>
              <span className="mt-2 inline-block -rotate-2 rounded-xl border-2 border-ink bg-gold px-4 pb-1 pr-5 text-[#f4f7ff] text-[clamp(2.5rem,7vw,5.2rem)] shadow-hard">
                começarmos
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
              Leia com atenção as informações abaixo para aproveitar ao máximo este briefing.
            </p>

            <ul className="stagger mt-8 max-w-xl space-y-4">
              <li className="group flex gap-4 transition-transform duration-200 hover:-translate-y-0.5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-goldsoft text-ink shadow-hard-sm transition-transform duration-200 group-hover:-rotate-6">
                  <IcAlert size={17} />
                </span>
                <p className="text-[15px] leading-relaxed text-ink/75">
                  <span className="mb-0.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                    A base do projeto
                  </span>
                  É importante que responda cada questão com atenção — serão a base de toda a
                  identidade visual que vamos desenvolver juntos.
                </p>
              </li>
              <li className="group flex gap-4 transition-transform duration-200 hover:-translate-y-0.5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-mint text-ink shadow-hard-sm transition-transform duration-200 group-hover:-rotate-6">
                  <IcLock size={17} />
                </span>
                <p className="text-[15px] leading-relaxed text-ink/75">
                  <span className="mb-0.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                    Confidencialidade
                  </span>
                  As suas respostas são confidenciais e não serão partilhadas com terceiros.
                </p>
              </li>
              <li className="group flex gap-4 transition-transform duration-200 hover:-translate-y-0.5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-flamesoft text-ink shadow-hard-sm transition-transform duration-200 group-hover:-rotate-6">
                  <IcGem size={17} />
                </span>
                <p className="text-[15px] leading-relaxed text-ink/75">
                  <span className="mb-0.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                    O que ganha
                  </span>
                  Este briefing permite-me entender bem a sua marca e desenvolver uma identidade
                  visual forte, autêntica e de grande valor.
                </p>
              </li>
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <HardButton variant="gold" className="px-7 py-3.5 text-base" onClick={() => onStart(false)}>
                Iniciar briefing <IcArrowR size={16} />
              </HardButton>
              {hasDraft && (
                <button
                  onClick={() => onStart(true)}
                  className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink/50 underline decoration-dashed underline-offset-4 transition-colors hover:text-flame"
                >
                  recomeçar do zero
                </button>
              )}
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/55">
              Não é necessário responder todas as perguntas. Mas quanto mais detalhes, melhor o resultado.
            </p>
            {hasDraft && (
              <p className="mt-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wide text-leaf animate-pop">
                <IcDot size={8} className="animate-blink" /> Rascunho encontrado — retoma aos {draftPct}%
              </p>
            )}
          </div>

          {/* dial + stamp + stats */}
          <div className="relative hidden flex-col items-center justify-center gap-7 lg:flex">
            <div className="relative">
              <Dial value={hasDraft ? draftPct : 0} size={230} label={hasDraft ? "do rascunho" : "pronto a iniciar"} />
              <Stamp className="absolute -right-10 -top-8 h-28 w-28 text-ink/70" />
            </div>
            <div className="flex max-w-[280px] flex-wrap justify-center gap-2">
              {[`${SECTIONS.length} secções`, `${TOTAL_QUESTIONS} perguntas`, "±15 min", "autosave local"].map((c) => (
                <span key={c} className="rounded-md border-2 border-ink/15 bg-card px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink/65">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* how to use — ledger */}
        <div className="pb-16">
          <div className="mb-5 flex items-baseline gap-3">
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Como usar esta ficha</h2>
            <span className="hidden flex-1 border-t-2 border-dashed border-ink/20 md:block" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">guia rápido</span>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-hard">
            {HOWTO.map((h, i) => (
              <div
                key={h.n}
                className={`group grid gap-2 px-5 py-4 transition-colors hover:bg-goldsoft/50 md:grid-cols-[64px_220px_1fr] md:items-baseline md:gap-6 md:px-7 ${
                  i > 0 ? "border-t-2 border-ink/10" : ""
                }`}
              >
                <span className="font-mono text-sm font-bold text-flame">{h.n}</span>
                <h3 className="font-display text-base font-extrabold md:text-lg">{h.t}</h3>
                <p className="text-sm leading-relaxed text-ink/65">{h.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t-2 border-ink bg-ink py-5 text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 md:px-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">
            Briefing interativo de rebranding
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            pronto para começar? ✳
          </span>
        </div>
      </footer>
    </div>
  );
}
