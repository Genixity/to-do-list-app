import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Priority = 'Low' | 'Medium' | 'High';

interface TodoFormProps {
  addTodo: (text: string, priority: Priority, dueDate: string, tags: string[]) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    addTodo(text, priority, dueDate, tags);
    setText('');
    setPriority('Low');
    setDueDate('');
    setTags([]);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(',').map(tag => tag.trim()));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('New List Name')}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
        <option value="Low">{t('Low')}</option>
        <option value="Medium">{t('Medium')}</option>
        <option value="High">{t('High')}</option>
      </select>
      <input 
        type="date" 
        value={dueDate} 
        onChange={(e) => setDueDate(e.target.value)} 
      />
      <input 
        type="text" 
        value={tags.join(', ')} 
        onChange={handleTagsChange}
        placeholder={t('Filter Tags')}
      />
      <button type="submit">{t('Add New List')}</button>
    </form>
  );
};

export default TodoForm;
