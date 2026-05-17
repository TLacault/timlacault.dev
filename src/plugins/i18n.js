import { reactive } from "vue";
import en from "@/locales/en";
import fr from "@/locales/fr";

const messages = { en, fr };

export const localeState = reactive({
  locale: localStorage.getItem("locale") || "en",
});

export function setLocale(lang) {
  localeState.locale = lang;
  localStorage.setItem("locale", lang);
  document.documentElement.lang = lang;
}

function t(key) {
  const msgs = messages[localeState.locale] || messages.en;
  return key.split(".").reduce((obj, k) => obj?.[k], msgs) ?? key;
}

function ta(key) {
  const msgs = messages[localeState.locale] || messages.en;
  const val = key.split(".").reduce((obj, k) => obj?.[k], msgs);
  return Array.isArray(val) ? val : [];
}

export const i18nPlugin = {
  install(app) {
    document.documentElement.lang = localeState.locale;
    app.config.globalProperties.$t = t;
    app.config.globalProperties.$ta = ta;
    app.config.globalProperties.$locale = localeState;
    app.config.globalProperties.$setLocale = setLocale;
  },
};
