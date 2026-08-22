import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Dial, HardButton, IcCheck, IcCopy, IcDownload, IcMail, IcReset, IcWhatsApp, Logo, Stamp } from "./primitives";

export function Success({
  pct,
  answered,
  total,
  elapsed,
  logoSrc,
  onDownload,
  onCopy,
  onWhatsApp,
  onEmail,
  onRestart,
}: {
  pct: number;
  answered: number;
  total: number;
  elapsed: string;
  logoSrc: string | null;
  onDownload: () => void;
  onCopy: () => void;
  onWhatsApp: () => void;
  onEmail: () => void;
  onRestart: () => void;
}) {
  useEffect(() => {
    const colors = ["#2f6bff", "#5b8cff", "#1f5fd6", "#eef1f6", "#1e242e"];
    confetti({ particleCount: 130, spread: 75, origin: { y: 0.65 }, colors, ticks: 220 });
    const t1 = window.setTimeout(
      () => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }),
      260
    );
    const t2 = window.setTimeout(
      () => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }),
      420
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 md:px-8">
      <div className="flex flex-1 items-center py-14">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[auto_1fr]">
          <div className="relative mx-auto animate-pop">
            <div className="noise flex h-56 w-56 items-center justify-center rounded-full border-2 border-ink bg-pine shadow-hard">
              <div className="pulse-gold flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-gold text-[#f4f7ff]">
                <IcCheck size={46} />
              </div>
              <Stamp className="absolute -right-7 -top-5 h-24 w-24 text-flame" />
            </div>
          </div>

          <div className="animate-rise" style={{ animationDelay: "0.1s" }}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-flame">
              Briefing fechado ✳ documento gerado
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight md:text-6xl">
              Pronto para a
              <br />
              <span className="inline-block -rotate-1 rounded-lg border-2 border-ink bg-gold px-3 text-[#f4f7ff] shadow-hard-sm">
                próxima marca.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70">
              O briefing está consolidado em Markdown. Descarrega-o, cola-o onde fizer falta e agenda
              a reunião de validação de 1 hora — é aí que isto vira estratégia.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {[
                { v: `${answered}/${total}`, l: "perguntas" },
                { v: `${pct}%`, l: "completo" },
                { v: elapsed, l: "tempo" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border-2 border-ink/15 bg-card px-4 py-2.5 text-center">
                  <div className="font-display text-xl font-extrabold leading-none">{s.v}</div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">{s.l}</div>
                </div>
              ))}
              <div className="hidden md:block">
                <Dial value={pct} size={72} />
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                  1 · Enviar ao estúdio
                </p>
                <div className="flex flex-wrap gap-3">
                  <HardButton variant="ink" onClick={onWhatsApp} className="px-6 py-3">
                    <IcWhatsApp size={16} /> Abrir WhatsApp
                  </HardButton>
                  <HardButton variant="ghost" onClick={onEmail} className="px-6 py-3">
                    <IcMail size={16} /> Abrir email
                  </HardButton>
                </div>
                <p className="mt-2 font-mono text-[11px] text-ink/45">
                  O briefing é copiado automaticamente — basta colar na conversa ou no corpo do email.
                </p>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                  2 · Guardar o documento
                </p>
                <div className="flex flex-wrap gap-3">
                  <HardButton variant="gold" onClick={onDownload} className="px-6 py-3">
                    <IcDownload size={16} /> Descarregar .md
                  </HardButton>
                  <HardButton variant="ghost" onClick={onCopy} className="px-6 py-3">
                    <IcCopy size={16} /> Copiar conteúdo
                  </HardButton>
                  <HardButton variant="ghost" onClick={onRestart} className="px-5 py-3">
                    <IcReset size={15} /> Novo briefing
                  </HardButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex flex-col items-center gap-2 border-t-2 border-ink/12 py-6">
        <Logo size={28} src={logoSrc} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
          do diagnóstico às métricas — boa sorte com o lançamento ✳
        </span>
      </footer>
    </div>
  );
}
