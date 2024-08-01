import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaSun, FaMoon } from 'react-icons/fa';
import LanguageSelector from './LanguageSelector';
import '../styles/App.css';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  openModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, openModal }) => {
  const { t } = useTranslation();

  return (
    <header className="App-header">
      <h1>{t('Todo Lists')}</h1>
      <div className="controls">
        <button onClick={toggleTheme} className="toggle-theme" aria-label="toggle theme">
          {theme === 'light-mode' ? <FaMoon /> : <FaSun />}
        </button>
        <LanguageSelector />
        <button onClick={openModal} className="add-btn">
          <FaPlus /> {t('Add New List')}
        </button>
      </div>
    </header>
  );
};

export default Header;