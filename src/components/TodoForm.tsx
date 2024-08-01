import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue, ActionMeta } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import customStyles, { OptionType } from '../styles/customStyles';
import '../styles/TodoListPage.css';

type Priority = 'Low' | 'Medium' | 'High';

interface TodoFormProps {
  addTodo: (text: string, priority: Priority, dueDate: string, tags: string[]) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<MultiValue<OptionType>>([]);
  const [tagOptions, setTagOptions] = useState<OptionType[]>([]);
  const [createdAt] = useState(new Date().toISOString());
  const { t } = useTranslation();

  const fetchTags = useCallback(async () => {
    try {
      const response = await axios.get('https://66a89223e40d3aa6ff588463.mockapi.io/api/v1/todos');
      const allTags = response.data.flatMap((todo: any) => todo.tags as string[]);
      const uniqueTags = Array.from(new Set<string>(allTags)).map((tag: string) => ({ value: tag, label: tag }));
      setTagOptions(uniqueTags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    addTodo(text, priority, dueDate ? dueDate.toISOString() : '', tags.map(tag => tag.value));
    setText('');
    setPriority('Low');
    setDueDate(null);
    setTags([]);
  }, [addTodo, text, priority, dueDate, tags]);

  const handleTagsChange = useCallback((newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    setTags(newValue);
  }, []);

  const getPriorityIcon = useCallback((priority: Priority) => {
    switch (priority) {
      case 'Low':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'High':
        return '🔴';
      default:
        return '';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  return (
    <div className="todo-item" style={{ width: 'min(770px, 86%)', paddingBottom: '9px' }}>
      <form onSubmit={handleSubmit} className="todo-header">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={`priority-icon select-edit priority-select ${priority.toLowerCase()}`}
        >
          <option value="Low">{getPriorityIcon('Low')}</option>
          <option value="Medium">{getPriorityIcon('Medium')}</option>
          <option value="High">{getPriorityIcon('High')}</option>
        </select>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('New List Name')}
          aria-label="New List Name"
          className="input-edit todo-text-edit"
        />
        <button type="submit" className="icon-container" style={{ width: '80px' }}>
          <IoSend />
        </button>
      </form>
      <div className="progress-bar">
        <div className="progress" style={{ width: `1%` }}></div>
      </div>
      <div className="date-info" style={{ marginTop: 0, marginRight: 0 }}>
        <span className="created-date">{formatDate(createdAt)}</span>
        <DatePicker
          selected={dueDate}
          onChange={(date: Date | null) => setDueDate(date)}
          dateFormat="dd. MM. yyyy"
          className="input-edit date-edit"
          wrapperClassName="date-picker-wrapper"
          placeholderText={t('Select due date')}
        />
      </div>
      <div className="edit-tags">
        <CreatableSelect
          isMulti
          value={tags}
          onChange={handleTagsChange}
          options={tagOptions}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          placeholder={t('Tags')}
        />
      </div>
    </div>
  );
};

export default React.memo(TodoForm);