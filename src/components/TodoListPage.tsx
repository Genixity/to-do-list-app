import React, { useState, useCallback, useMemo } from 'react';
import useTodos from '../hooks/useTodos';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useTranslation } from 'react-i18next';
import CreatableSelect, { MultiValue } from 'react-select';
import { FaSun, FaMoon } from 'react-icons/fa';
import LanguageSelector from './LanguageSelector';
import customStyles, { OptionType } from '../styles/customStyles';
import '../styles/TodoListPage.css';

interface TodoListPageProps {
  listId: number;
  goBack: () => void;
  theme: string;
  toggleTheme: () => void;
}

const TodoListPage: React.FC<TodoListPageProps> = ({ listId, goBack, theme, toggleTheme }) => {
  const { todos, title, tagOptions, addTodo, toggleTodo, removeTodo, updateTodo } = useTodos(listId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filterTags, setFilterTags] = useState<MultiValue<OptionType>>([]);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const { t } = useTranslation();

  const priorityOrder = useMemo(() => ({ Low: 1, Medium: 2, High: 3 }), []);

  const filteredTodos = useMemo(() => todos
    .filter(todo =>
      todo.text.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterTags.length === 0 || filterTags.every(tag => todo.tags.includes(tag.value)))
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      }
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'text') {
        comparison = a.text.localeCompare(b.text);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    }), [todos, searchText, filterTags, sortBy, sortOrder, priorityOrder]);

  const handleFilterTagsChange = useCallback((selectedOptions: MultiValue<OptionType>) => {
    setFilterTags(selectedOptions as OptionType[]);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <div className="todo-list-page">
      <div className="sidebar">
        <button onClick={goBack} className="back-button">{t('Back')}</button>
        <div className="controls">
          <button onClick={toggleTheme} className="toggle-theme theme-button" aria-label="toggle theme" style={{ minWidth: '100%' }}>
            {theme === 'light-mode' ? <FaMoon /> : <FaSun />}
          </button>
          <LanguageSelector style={{ minWidth: '100%', marginBottom: '30px' }} />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('Search Todos')}
            className="input-search"
          />
          <CreatableSelect
            isMulti
            name="tags"
            options={tagOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={handleFilterTagsChange}
            value={filterTags}
            placeholder={t('Filter Tags')}
            styles={customStyles}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-sort">
            <option value="createdAt">{t('Created At')}</option>
            <option value="priority">{t('Priority')}</option>
            <option value="dueDate">{t('Due Date')}</option>
            <option value="text">{t('Alphabetically')}</option>
          </select>
          <button onClick={toggleSortOrder} className="sort-button">
            {t('Sort by')} {sortOrder === 'asc' ? t('Ascending') : t('Descending')}
          </button>
        </div>
      </div>
      <div className="main-content">
        <h2 className="page-title">{title}</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          editTodo={setEditingId}
          updateTodo={updateTodo}
          editingId={editingId}
        />
      </div>
    </div>
  );
};

export default TodoListPage;