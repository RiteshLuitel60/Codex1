export const locales = ["en", "fr", "es", "ar", "ja"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const labels: Record<Locale, { directory: string; methodology: string; tracker: string }> = {
  en: { directory: "Directory", methodology: "Methodology", tracker: "Change Tracker" },
  fr: { directory: "Répertoire", methodology: "Méthodologie", tracker: "Suivi des changements" },
  es: { directory: "Directorio", methodology: "Metodología", tracker: "Seguimiento de cambios" },
  ar: { directory: "الدليل", methodology: "المنهجية", tracker: "متتبع التغييرات" },
  ja: { directory: "ディレクトリ", methodology: "方法論", tracker: "変更トラッカー" }
};
