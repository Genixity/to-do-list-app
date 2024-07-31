import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import cs from './locales/cs.json';
import sk from './locales/sk.json';
import de from './locales/de.json';
import hu from './locales/hu.json';
import ro from './locales/ro.json';
import hr from './locales/hr.json';
import bg from './locales/bg.json';
import pl from './locales/pl.json';
import sl from './locales/sl.json';
import bs from './locales/bs.json';
import uk from './locales/uk.json';
import sr from './locales/sr.json';
import el from './locales/el.json';
import it from './locales/it.json';

const resources = {
  en: { translation: en },
  cs: { translation: cs },
  sk: { translation: sk },
  de: { translation: de },
  hu: { translation: hu },
  ro: { translation: ro },
  hr: { translation: hr },
  bg: { translation: bg },
  pl: { translation: pl },
  sl: { translation: sl },
  bs: { translation: bs },
  uk: { translation: uk },
  sr: { translation: sr },
  el: { translation: el },
  it: { translation: it },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18n;