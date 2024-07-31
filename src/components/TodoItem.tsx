import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Priority = 'Low' | 'Medium' | 'High';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
  tags: string[];
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  editTodo: (id: number) => void;
  updateTodo: (id: number, newText: string, newPriority: Priority, newDueDate: string, newTags: string[]) => void;
  isEditing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, removeTodo, editTodo, updateTodo, isEditing }) => {
  const [newText, setNewText] = useState(todo.text);
  const [newPriority, setNewPriority] = useState<Priority>(todo.priority);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate);
  const [newTags, setNewTags] = useState(todo.tags.join(', '));
  const { t } = useTranslation();

  const handleUpdate = () => {
    updateTodo(todo.id, newText, newPriority, newDueDate, newTags.split(',').map(tag => tag.trim()));
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input 
            type="text" 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)} 
          />
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)}>
            <option value="Low">{t('Low')}</option>
            <option value="Medium">{t('Medium')}</option>
            <option value="High">{t('High')}</option>
          </select>
          <input 
            type="date" 
            value={newDueDate} 
            onChange={(e) => setNewDueDate(e.target.value)} 
          />
          <input 
            type="text" 
            value={newTags} 
            onChange={(e) => setNewTags(e.target.value)} 
            placeholder={t('Filter Tags')}
          />
          <button onClick={handleUpdate}>{t('Edit')}</button>
        </>
      ) : (
        <>
          <span 
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} 
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text} ({t('Priority')}: {t(todo.priority)}, {t('Due Date')}: {todo.dueDate}, {t('Tags')}: {todo.tags.join(', ')})
          </span>
          <button onClick={() => editTodo(todo.id)}>{t('Edit')}</button>
          <button onClick={() => removeTodo(todo.id)}>{t('Delete')}</button>
          <button onClick={() => toggleTodo(todo.id)}>
            {todo.completed ? t('Incomplete') : t('Complete')}
          </button>
        </>
      )}
    </li>
  );
};

export default TodoItem;