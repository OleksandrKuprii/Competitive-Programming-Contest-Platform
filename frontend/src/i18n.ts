import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en_common from './locales/en/common.json';
import en_pagenames from './locales/en/pagenames.json';
import en_homepage from './locales/en/homepage.json';
import en_taskspage from './locales/en/taskspage.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        common: en_common,
        pagenames: en_pagenames,
        homepage: en_homepage,
        taskspage: en_taskspage
      }
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["common", "pagenames", "homepage", "taskspage"],
    defaultNS: "common",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
