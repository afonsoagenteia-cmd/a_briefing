export type Accent = "leaf" | "gold" | "flame";

export interface OptionDef {
  id: string;
  label: string;
  /** revela um campo de texto quando selecionada */
  other?: boolean;
  /** texto dentro do próprio campo (q32) */
  prefix?: string;
  suffix?: string;
  /** campo opcional ligado à opção (ex.: município, meta %) */
  inputLabel?: string;
  inputSuffix?: string;
  /** ao selecionar, desmarca as outras do grupo (canais: "não será usado") */
  exclusive?: boolean;
}

export interface QuestionDef {
  id: string;
  code: string;
  title: string;
  hint?: string;
  type: "single" | "multi" | "text" | "scale" | "competitors" | "grid" | "lines" | "contact";
  max?: number;
  options?: OptionDef[];
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  scaleLow?: string;
  scaleHigh?: string;
  scaleCaptions?: string[];
  groups?: { id: string; label: string; options: OptionDef[] }[];
  lines?: number;
}

export interface Section {
  id: string;
  num: string;
  title: string;
  blurb: string;
  accent: Accent;
  questions: QuestionDef[];
}

export interface MultiAnswer {
  kind: "multi";
  sel: string[];
  text: Record<string, string>;
}
export interface SingleAnswer {
  kind: "single";
  value: string | null;
  text: string;
  inline: Record<string, string>;
}
export interface TextAnswer {
  kind: "text";
  value: string;
}
export interface ScaleAnswer {
  kind: "scale";
  value: number | null;
}
export interface CompetitorsAnswer {
  kind: "competitors";
  rows: { name: string; strong: string; weak: string }[];
}
export interface GridAnswer {
  kind: "grid";
  groups: Record<string, string[]>;
}
export interface LinesAnswer {
  kind: "lines";
  lines: string[];
}
export interface ContactAnswer {
  kind: "contact";
  name: string;
  email: string;
  phone: string;
}

export type Answer =
  | MultiAnswer
  | SingleAnswer
  | TextAnswer
  | ScaleAnswer
  | CompetitorsAnswer
  | GridAnswer
  | LinesAnswer
  | ContactAnswer;

export type Answers = Record<string, Answer>;

export interface ToastMsg {
  id: number;
  msg: string;
  tone: "ok" | "warn" | "info";
}
