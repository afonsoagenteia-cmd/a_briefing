import { useCallback, useEffect, useMemo, useState } from "react";
import { SECTIONS, TOTAL_QUESTIONS } from "./data/briefing";
import {
  buildMarkdown,
  clearDraft,
  clearLogo,
  copyText,
  defaultAnswers,
  detectBundledLogo,
  downloadMarkdown,
  loadDraft,
  loadLogo,
  overallStats,
  saveDraft,
  saveLogo,
  validateContact,
} from "./lib/engine";
import type { Answers, Section, ToastMsg } from "./lib/types";
import { Cover } from "./components/Cover";
import { Review } from "./components/Review";
import { Success } from "./components/Success";
import { MobileSteps, Sidebar } from "./components/Sidebar";
import { QuestionCard } from "./components/questions";
import {
  HardButton,
  IcArrowL,
  IcArrowR,
  IcDot,
  IcReset,
  IcSend,
  Logo,
  Modal,
  ToastHost,
} from "./components/primitives";

const REVIEW_STEP = SECTIONS.length;

type Screen = "cover" | "form" | "success";

function mergeWithDefaults(saved: Answers): Answers {
  const base = defaultAnswers();
  for (const id of Object.keys(base)) {
    if (saved[id] && saved[id].kind === base[id].kind) base[id] = saved[id];
  }
  return base;
}

function SectionHeader({ section, index }: { section: Section; index: number }) {
  return (
    <header className="noise relative overflow-hidden rounded-xl border-2 border-ink bg-pine p-6 text-paper shadow-hard md:p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-10 select-none font-display text-[8.5rem] font-extrabold leading-none text-paper/8"
      >
        {section.num}
      </span>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
        Secção {section.num} · {index + 1} de {SECTIONS.length}
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{section.title}</h2>
      <p className="relative mt-2 max-w-xl text-sm font-medium leading-relaxed text-paper/70 md:text-[15px]">
        {section.blurb}
      </p>
      <div className="mt-5 flex gap-1.5">
        {SECTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              i < index ? "bg-gold" : i === index ? "bg-leaf" : "bg-paper/15"
            }`}
          />
        ))}
      </div>
    </header>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("cover");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => defaultAnswers());
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [contactInvalid, setContactInvalid] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState("—");
  const [markdown, setMarkdown] = useState("");
  const [finalStats, setFinalStats] = useState({ answered: 0, total: TOTAL_QUESTIONS, pct: 0 });
  const [customLogo, setCustomLogo] = useState<string | null>(() => loadLogo());
  const [bundledLogo, setBundledLogo] = useState<string | null>(null);

  const draft = useMemo(() => loadDraft(), []);
  const draftStats = useMemo(() => (draft ? overallStats(draft.answers) : null), [draft]);
  const hasDraft = Boolean(draft && draftStats && draftStats.answered > 0);
  const effectiveLogo = customLogo ?? bundledLogo;

  useEffect(() => {
    let on = true;
    detectBundledLogo().then((src) => {
      if (on) setBundledLogo(src);
    });
    return () => {
      on = false;
    };
  }, []);

  const pushToast = useCallback((msg: string, tone: ToastMsg["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2900);
  }, []);

  /* autosave */
  useEffect(() => {
    if (screen !== "form") return;
    const t = window.setTimeout(() => {
      saveDraft({ answers, step, startedAt, savedAt: Date.now() });
      setSavedAt(new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }));
    }, 650);
    return () => window.clearTimeout(t);
  }, [answers, step, screen, startedAt]);

  const start = (fresh: boolean) => {
    if (fresh || !draft) {
      clearDraft();
      setAnswers(defaultAnswers());
      setStep(0);
      setStartedAt(Date.now());
      if (fresh) pushToast("Folha em branco — rascunho apagado", "info");
    } else {
      setAnswers(mergeWithDefaults(draft.answers));
      setStep(Math.min(draft.step ?? 0, REVIEW_STEP));
      setStartedAt(draft.startedAt ?? Date.now());
      pushToast(`Rascunho retomado aos ${draftStats?.pct ?? 0}%`, "ok");
    }
    setShowErrors(false);
    setContactInvalid(false);
    setScreen("form");
    window.scrollTo({ top: 0 });
  };

  const goto = (i: number) => {
    setStep(Math.max(0, Math.min(REVIEW_STEP, i)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setAnswer = (qid: string, a: Answers[string]) => {
    setAnswers((prev) => ({ ...prev, [qid]: a }));
    if (qid === "q82") {
      const errs = validateContact(a);
      setContactInvalid(Object.keys(errs).length > 0 && contactInvalid);
    }
  };

  const finalize = useCallback(() => {
    const md = buildMarkdown(answers);
    setMarkdown(md);
    const st = overallStats(answers);
    setFinalStats(st);
    const secs = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    setElapsed(secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, "0")}s`);
    setScreen("success");
    window.scrollTo({ top: 0 });
  }, [answers, startedAt]);

  const submit = () => {
    const errs = validateContact(answers["q82"]);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      setContactInvalid(true);
      pushToast("Falta o contacto do responsável (secção 08)", "warn");
      goto(REVIEW_STEP);
      return;
    }
    setShowErrors(false);
    setContactInvalid(false);
    const st = overallStats(answers);
    if (st.answered < st.total) {
      setConfirmOpen(true);
    } else {
      finalize();
    }
  };

  const uploadLogo = (file: File) => {
    if (file.size > 1.5 * 1024 * 1024) {
      pushToast("Ficheiro demasiado grande — máximo 1,5 MB", "warn");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      saveLogo(url);
      setCustomLogo(url);
      pushToast("Logotipo aplicado — guardado neste navegador", "ok");
    };
    reader.onerror = () => pushToast("Não foi possível ler o ficheiro", "warn");
    reader.readAsDataURL(file);
  };

  const resetLogo = () => {
    clearLogo();
    setCustomLogo(null);
    pushToast("Monograma RB·360 reposto", "info");
  };

  const restart = () => {
    clearDraft();
    setAnswers(defaultAnswers());
    setStep(0);
    setStartedAt(Date.now());
    setSavedAt(null);
    setShowErrors(false);
    setContactInvalid(false);
    setResetOpen(false);
    setConfirmOpen(false);
    setScreen("cover");
    window.scrollTo({ top: 0 });
    pushToast("Novo briefing pronto a preencher", "info");
  };

  const sendWhatsApp = () =>
    copyText(markdown).then((ok) => {
      pushToast(
        ok ? "Briefing copiado — cola na conversa do WhatsApp" : "Copia manualmente e cola no WhatsApp",
        ok ? "ok" : "warn"
      );
      window.open("https://web.whatsapp.com/", "_blank", "noopener");
    });

  const sendEmail = () =>
    copyText(markdown).then((ok) => {
      pushToast(
        ok ? "Briefing copiado — cola no corpo do email" : "Copia manualmente e cola no email",
        ok ? "ok" : "warn"
      );
      window.location.href = `mailto:?subject=${encodeURIComponent("Briefing Rebranding 360º — preenchido")}`;
    });

  const stats = overallStats(answers);
  const section = step < REVIEW_STEP ? SECTIONS[step] : null;
  const missing = stats.total - stats.answered;

  return (
    <div className="min-h-screen">
      {screen === "cover" && (
        <Cover
          hasDraft={hasDraft}
          draftPct={draftStats?.pct ?? 0}
          onStart={start}
          logoSrc={effectiveLogo}
          hasCustomLogo={Boolean(customLogo)}
          onUploadLogo={uploadLogo}
          onResetLogo={resetLogo}
        />
      )}

      {screen === "form" && (
        <div className="pb-16">
          {/* top bar */}
          <header className="sticky top-0 z-50 border-b-2 border-gold bg-pine text-paper">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 md:px-8">
              <button
                onClick={() => setScreen("cover")}
                className="flex items-center transition-opacity hover:opacity-80"
                title="Voltar à capa"
              >
                <Logo size={30} dark src={effectiveLogo} />
                <span className="ml-3 hidden border-l-2 border-paper/15 pl-3 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45 sm:block">
                  briefing interativo
                </span>
              </button>
              <div className="ml-auto flex items-center gap-3 md:gap-5">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper/60">
                  <IcDot size={8} className={savedAt ? "animate-blink text-gold" : "text-paper/30"} />
                  <span className="hidden sm:inline">{savedAt ? `Guardado às ${savedAt}` : "Autosave ativo"}</span>
                  <span className="sm:hidden">{savedAt ? savedAt : "auto"}</span>
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-paper/15 md:w-32">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-700"
                      style={{ width: `${stats.pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-gold">{stats.pct}%</span>
                </div>
                <button
                  onClick={() => setResetOpen(true)}
                  className="rounded-md border-2 border-paper/25 p-2 text-paper/70 transition-colors hover:border-flame hover:text-flame"
                  title="Recomeçar do zero"
                  aria-label="Recomeçar do zero"
                >
                  <IcReset size={14} />
                </button>
              </div>
            </div>
          </header>

          <MobileSteps answers={answers} step={step} onJump={goto} />

          <div className="mx-auto grid max-w-7xl gap-7 px-4 py-7 md:px-8 lg:grid-cols-[290px_1fr]">
            <Sidebar answers={answers} step={step} onJump={goto} />

            <main>
              {section ? (
                <div key={section.id} className="animate-rise">
                  <SectionHeader section={section} index={step} />
                  <div className="mt-6 space-y-6">
                    {section.questions.map((q, i) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        answer={answers[q.id]}
                        accent={section.accent}
                        index={i}
                        showErrors={showErrors}
                        onChange={(a) => setAnswer(q.id, a)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Review
                  answers={answers}
                  onJump={goto}
                  onGenerate={submit}
                  contactInvalid={contactInvalid}
                />
              )}

              {/* nav */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <HardButton variant="ghost" onClick={() => goto(step - 1)} disabled={step === 0}>
                  <IcArrowL size={15} /> Anterior
                </HardButton>
                <span className="hidden font-mono text-[11px] font-bold uppercase tracking-wider text-ink/40 sm:block">
                  {step < REVIEW_STEP ? `${step + 1} / ${SECTIONS.length + 1}` : "Revisão"}
                </span>
                {step < REVIEW_STEP ? (
                  <HardButton variant="ink" onClick={() => goto(step + 1)}>
                    Próxima secção <IcArrowR size={15} />
                  </HardButton>
                ) : (
                  <HardButton variant="gold" onClick={submit}>
                    Gerar briefing <IcSend size={15} />
                  </HardButton>
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {screen === "success" && (
        <Success
          pct={finalStats.pct}
          answered={finalStats.answered}
          total={finalStats.total}
          elapsed={elapsed}
          logoSrc={effectiveLogo}
          onDownload={() => {
            downloadMarkdown(markdown);
            pushToast("briefing-rebranding-360.md descarregado", "ok");
          }}
          onCopy={() =>
            copyText(markdown).then((ok) =>
              pushToast(ok ? "Briefing copiado para a área de transferência" : "Não foi possível copiar", ok ? "ok" : "warn")
            )
          }
          onWhatsApp={sendWhatsApp}
          onEmail={sendEmail}
          onRestart={restart}
        />
      )}

      {/* modals */}
      <Modal
        open={resetOpen}
        title="Recomeçar do zero?"
        onClose={() => setResetOpen(false)}
        actions={
          <>
            <HardButton variant="ghost" onClick={() => setResetOpen(false)}>
              Manter rascunho
            </HardButton>
            <HardButton variant="flame" onClick={restart}>
              <IcReset size={14} /> Apagar tudo
            </HardButton>
          </>
        }
      >
        Isto apaga todas as respostas guardadas neste navegador ({stats.answered} de {stats.total} perguntas).
        Não dá para recuperar.
      </Modal>

      <Modal
        open={confirmOpen}
        title="Gerar com perguntas em falta?"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <HardButton variant="ghost" onClick={() => setConfirmOpen(false)}>
              Voltar e completar
            </HardButton>
            <HardButton variant="gold" onClick={() => { setConfirmOpen(false); finalize(); }}>
              Gerar mesmo assim
            </HardButton>
          </>
        }
      >
        Ainda faltam <strong>{missing}</strong> pergunta{missing > 1 ? "s" : ""} por responder. Podes gerar o
        documento já — as omissões ficam marcadas como “_Por responder_” — ou voltar para completar.
      </Modal>

      <ToastHost toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
