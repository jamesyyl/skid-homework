import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommons from "../public/locales/en/commons.json";
import zhCommons from "../public/locales/zh/commons.json";

const resources = {
  en: { commons: enCommons },
  zh: { commons: zhCommons },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    supportedLngs: ["en", "zh"],
    lng: "en",
    fallbackLng: "en",
    ns: ["commons"],
    defaultNS: "commons",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
