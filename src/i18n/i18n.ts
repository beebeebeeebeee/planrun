import _i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export enum I18nLanguageConstant {
  EN_US = "en-US",
  ZH_HK = "zh-HK",
}

export const DefaultLanguage = I18nLanguageConstant.ZH_HK;

export const i18n = _i18n;

function pathJoin(...parts: string[]) {
  const separator = "/";
  const replace = new RegExp(`${separator}{1,}`, "g");
  return parts.join(separator).replace(replace, separator);
}

export function registerI18n() {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      backend: {
        loadPath: pathJoin(import.meta.env.BASE_URL, `/locale/{{lng}}.json`),
      },
      fallbackLng: DefaultLanguage,
      lng: DefaultLanguage,
      supportedLngs: Object.values(I18nLanguageConstant),
      preload: Object.values(I18nLanguageConstant),
      interpolation: {
        escapeValue: false,
      },
    });
}
