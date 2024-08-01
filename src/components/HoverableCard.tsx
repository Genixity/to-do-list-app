import React, { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FaTrashAlt, FaEdit, FaCheck } from 'react-icons/fa';
import '../styles/App.css';

interface HoverableCardProps {
  style: any;
  list: { id: number; name: string };
  editingListId: number | null;
  editingListName: string;
  handleListSelect: (id: number) => void;
  startEditing: (id: number, name: string) => void;
  saveEdit: () => void;
  removeTodoList: (id: number) => void;
  setEditingListName: (name: string) => void;
}

const HoverableCard: React.FC<HoverableCardProps> = ({
  style,
  list,
  editingListId,
  editingListName,
  handleListSelect,
  startEditing,
  saveEdit,
  removeTodoList,
  setEditingListName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (editingListId === list.id && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingListId, list.id]);

  const [hoverStyle, setHoverStyle] = useSpring(() => ({
    transform: 'scale(1)',
    config: { tension: 300, friction: 20 },
  }));

  const handleMouseEnter = () => {
    if (!isDeleting) {
      setHover(true);
      setHoverStyle.start({ transform: 'scale(1.05)' });
    }
  };

  const handleMouseLeave = () => {
    setHoverStyle.start({ transform: 'scale(1)' });
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setHover(false);
    await removeTodoList(id);
    setIsDeleting(false);
    console.log(`Deleted card ${id}`);
  };

  return (
    <animated.div
      style={{ ...style, ...(hover && !isDeleting ? hoverStyle : {}) }}
      className={`todo-list-card ${isDeleting ? 'deleting' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {editingListId === list.id ? (
        <input
          type="text"
          value={editingListName}
          onChange={(e) => setEditingListName(e.target.value)}
          onBlur={saveEdit}
          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
          className="edit-input"
          ref={inputRef}
        />
      ) : (
        <span onClick={() => handleListSelect(list.id)} className="todo-list-name">
          {list.name}
        </span>
      )}
      <div className="todo-list-actions">
        <div className="icon-container">
          <FaEdit
            className={`${editingListId === list.id ? 'hidden' : 'visible'}`}
            onClick={() => startEditing(list.id, list.name)}
          />
          <FaCheck
            className={`${editingListId === list.id ? 'visible' : 'hidden'}`}
            onClick={saveEdit}
          />
        </div>
        <div onClick={() => handleDelete(list.id)} className="icon-container">
          <FaTrashAlt />
        </div>
      </div>
    </animated.div>
  );
};

export default HoverableCard;