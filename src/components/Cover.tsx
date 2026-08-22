import { useRef } from "react";
import { TOTAL_QUESTIONS, SECTIONS, MARQUEE_ITEMS } from "../data/briefing";
import { Dial, HardButton, IcArrowR, IcDot, IcEdit, IcSpark, IcX, Logo, Marquee, Stamp } from "./primitives";

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
  logoSrc,
  hasCustomLogo,
  onUploadLogo,
  onResetLogo,
}: {
  hasDraft: boolean;
  draftPct: number;
  onStart: (fresh: boolean) => void;
  logoSrc: string | null;
  hasCustomLogo: boolean;
  onUploadLogo: (file: File) => void;
  onResetLogo: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="min-h-screen">
      <Marquee items={MARQUEE_ITEMS} />

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* top strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink/12 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Logo size={44} caption src={logoSrc} />
            <span className="hidden rounded-md border-2 border-ink/15 bg-card px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink/45 xl:inline">
              ficha de briefing · v.2026
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUploadLogo(f);
                e.currentTarget.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              title="Substituir o monograma pelo teu logotipo (fica guardado neste navegador)"
              className="group flex items-center gap-1.5 rounded-md border-2 border-dashed border-ink/30 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-ink/55 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-goldsoft hover:text-ink"
            >
              <IcEdit size={11} className="transition-transform group-hover:-rotate-12" />
              {hasCustomLogo ? "trocar logo" : "o teu logo"}
            </button>
            {hasCustomLogo && (
              <button
                onClick={onResetLogo}
                title="Repor o monograma RB·360"
                className="flex items-center rounded-md border-2 border-ink/15 px-1.5 py-1.5 text-ink/45 transition-colors hover:border-flame hover:text-flame animate-pop"
              >
                <IcX size={11} />
              </button>
            )}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Luanda · AO — Kz · PT-PT
          </span>
        </div>

        {/* masthead */}
        <div className="grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.35fr_1fr]">
          <div className="animate-rise">
            <p className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-leaf">
              <IcSpark size={12} /> Diagnóstico → Estratégia → Lançamento
            </p>
            <h1 className="font-display font-extrabold leading-[0.94] tracking-tight">
              <span className="block text-[clamp(2.9rem,8.5vw,6.2rem)]">Rebranding</span>
              <span className="mt-2 inline-block -rotate-2 rounded-xl border-2 border-ink bg-gold px-4 pb-1 pr-5 text-[#f4f7ff] text-[clamp(2.9rem,8.5vw,6.2rem)] shadow-hard">
                360º
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
              Uma ficha guiada para tirar a marca da cabeça e pô-la no papel: motivação, mercado,
              posicionamento, tom de voz, canais, experiência interna e métricas de sucesso —
              tudo num só documento, pronto a virar estratégia.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[`${SECTIONS.length} secções`, `${TOTAL_QUESTIONS} perguntas`, "±15 min", "autosave local"].map((c) => (
                <span key={c} className="rounded-md border-2 border-ink/15 bg-card px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink/65">
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <HardButton variant="gold" className="px-7 py-3.5 text-base" onClick={() => onStart(false)}>
                Começar briefing <IcArrowR size={16} />
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
            {hasDraft && (
              <p className="mt-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wide text-leaf animate-pop">
                <IcDot size={8} className="animate-blink" /> Rascunho encontrado — retomas aos {draftPct}%
              </p>
            )}
          </div>

          {/* dial + stamp */}
          <div className="relative hidden items-center justify-center lg:flex" aria-hidden="true">
            <div className="relative">
              <Dial value={hasDraft ? draftPct : 0} size={230} label={hasDraft ? "do rascunho" : "pronto a iniciar"} />
              <Stamp className="absolute -right-10 -top-8 h-28 w-28 text-ink/70" />
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
          <Logo size={26} dark src={logoSrc} />
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
