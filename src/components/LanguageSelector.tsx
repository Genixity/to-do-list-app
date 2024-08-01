import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sk', name: 'Slovakia' },
  { code: 'cs', name: 'Czechia' },
  { code: 'hu', name: 'Hungary' },
  { code: 'ro', name: 'Romania' },
  { code: 'de', name: 'Germany' },
  { code: 'hr', name: 'Croatia' },
  { code: 'bg', name: 'Bulgaria' },
  { code: 'pl', name: 'Poland' },
  { code: 'sl', name: 'Slovenia' },
  { code: 'bs', name: 'Bosnia & Herzegovina' },
  { code: 'uk', name: 'Ukraine' },
  { code: 'sr', name: 'Serbia' },
  { code: 'el', name: 'Greece' },
  { code: 'it', name: 'Italy' },
];

interface LanguageSelectorProps {
  style?: React.CSSProperties;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="language-selector" style={style}>
      <select onChange={changeLanguage} value={i18n.language}>
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;