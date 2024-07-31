import React, { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { animated, useTransition, config } from '@react-spring/web';
import { FaTimes } from 'react-icons/fa';

interface AddListModalProps {
  isOpen: boolean;
  isClosing: boolean;
  newListName: string;
  onClose: () => void;
  onAddList: (name: string) => void;
  onChange: (name: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const AddListModal: React.FC<AddListModalProps> = ({
  isOpen,
  isClosing,
  newListName,
  onClose,
  onAddList,
  onChange,
  onKeyPress,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleModalClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const modalTransitions = useTransition(isOpen && !isClosing, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: [
      { transform: 'scale(1.1)', config: config.stiff },
      { opacity: 0, transform: 'scale(0)', config: { duration: 300, easing: (t: number) => t * t } },
    ],
    config: { tension: 300, friction: 20 },
  });

  return modalTransitions((style, item) =>
    item ? (
      <animated.div style={style} className="modal" onClick={handleModalClick}>
        <div className="modal-content">
          <span className="close-btn" onClick={onClose}>
            <FaTimes />
          </span>
          <h2>{t('Add New List')}</h2>
          <input
            type="text"
            value={newListName}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('New List Name')}
            className="new-list-input"
            onKeyPress={onKeyPress}
            ref={inputRef}
          />
          <button onClick={() => onAddList(newListName)} className="add-btn">
            {t('Add')}
          </button>
        </div>
      </animated.div>
    ) : null
  );
};

export default AddListModal;