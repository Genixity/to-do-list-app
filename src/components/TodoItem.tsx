import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreatableSelect from 'react-select/creatable';
import { FaTrashAlt, FaEdit, FaCheck } from 'react-icons/fa';
import { useSpring, animated } from '@react-spring/web';
import customStyles from '../styles/customStyles';
import '../styles/TodoListPage.css';

type Priority = 'Low' | 'Medium' | 'High';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
  tags: string[];
  createdAt?: string;
}

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  editTodo: (id: number | null) => void;
  updateTodo: (id: number, newText: string, newPriority: Priority, newDueDate: string, newTags: string[]) => void;
  isEditing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, removeTodo, editTodo, updateTodo, isEditing }) => {
  const [newText, setNewText] = useState(todo.text);
  const [newPriority, setNewPriority] = useState<Priority>(todo.priority);
  const [newDueDate, setNewDueDate] = useState<Date | null>(new Date(todo.dueDate));
  const [newTags, setNewTags] = useState(todo.tags.map(tag => ({ value: tag, label: tag })));
  const [isRemoving, setIsRemoving] = useState(false);

  const boxShadowSpring = useSpring({
    boxShadow: isEditing
      ? `inset 0 1px 3px rgba(0, 0, 0, 0.2), 8px 8px 8px rgba(0, 0, 0, 0.2), -6.67px -6.67px 6.67px var(--input-glow)`
      : 'inset 0 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(255, 255, 255, 0)',
    config: { duration: 300 },
  });

  const deleteSpring = useSpring({
    transform: isRemoving ? 'scale(0)' : 'scale(1)',
    opacity: isRemoving ? 0 : 1,
    config: { duration: 300 },
  });

  useEffect(() => {
    if (isRemoving) {
      const timer = setTimeout(() => {
        removeTodo(todo.id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRemoving, removeTodo, todo.id]);

  useEffect(() => {
    if (isEditing) {
      setNewText(todo.text);
      setNewPriority(todo.priority);
      setNewDueDate(new Date(todo.dueDate));
      setNewTags(todo.tags.map(tag => ({ value: tag, label: tag })));
    }
  }, [todo, isEditing]);

  const handleUpdate = useCallback(() => {
    updateTodo(
      todo.id,
      newText,
      newPriority,
      newDueDate ? newDueDate.toISOString() : '',
      newTags.map(tag => tag.value)
    );
    editTodo(null);
  }, [updateTodo, todo.id, newText, newPriority, newDueDate, newTags, editTodo]);

  const handleDelete = useCallback(async (id: number) => {
    setIsRemoving(true);
    await removeTodo(id);
    setIsRemoving(false);
    console.log(`Deleted card ${id}`);
  }, [removeTodo]);

  const getPriorityIcon = useCallback((priority: Priority, completed: boolean) => {
    if (completed) {
      return <FaCheck className={`priority-check ${priority.toLowerCase()}`} />;
    }
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

  const calculateProgress = useCallback((createdAt: string, dueDate: string) => {
    const now = new Date().getTime();
    const created = new Date(createdAt).getTime();
    const due = new Date(dueDate).getTime();
    return ((now - created) / (due - created)) * 100;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const progress = todo.createdAt ? calculateProgress(todo.createdAt, todo.dueDate) : 0;

  return (
    <animated.div style={deleteSpring}>
      <li className={`todo-item ${isEditing ? 'editing' : ''}`} onClick={!isEditing ? () => toggleTodo(todo.id) : undefined}>
        <div className="todo-header">
          {isEditing ? (
            <>
              <animated.select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className={`priority-icon select-edit ${isEditing ? 'editing' : ''}`}
                style={boxShadowSpring}
              >
                <option value="Low">{getPriorityIcon('Low', false)}</option>
                <option value="Medium">{getPriorityIcon('Medium', false)}</option>
                <option value="High">{getPriorityIcon('High', false)}</option>
              </animated.select>
              <animated.input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className={`input-edit todo-text-edit ${isEditing ? 'editing' : ''}`}
                style={boxShadowSpring}
              />
            </>
          ) : (
            <>
              <span className={`priority-icon ${todo.completed ? 'completed' : ''}`}>
                {getPriorityIcon(todo.priority, todo.completed)}
              </span>
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
            </>
          )}
          <div className="todo-list-actions">
            <div className="icon-container">
              <FaEdit className={`${isEditing ? 'hidden' : 'visible'}`} onClick={() => editTodo(todo.id)} />
              <FaCheck className={`${isEditing ? 'visible' : 'hidden'}`} onClick={handleUpdate} />
            </div>
            <div
              onClick={() => handleDelete(todo.id)}
              className="icon-container"
              data-testid={`delete-button-${todo.id}`}
            >
              <FaTrashAlt />
            </div>

          </div>
        </div>
        {todo.createdAt && todo.dueDate && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        <div className={`date-info ${isEditing ? 'editing' : ''}`}>
          {todo.createdAt && <span className="created-date">{formatDate(todo.createdAt)}</span>}
          {isEditing ? (
            <DatePicker
              selected={newDueDate}
              onChange={(date: Date | null) => setNewDueDate(date)}
              dateFormat="dd. MM. yyyy"
              className="input-edit"
              wrapperClassName="date-picker-wrapper"
            />
          ) : (
            todo.dueDate && <span className="due-date">{todo.createdAt ? formatDate(todo.dueDate) : ''}</span>
          )}
        </div>
        {isEditing ? (
          <div className="edit-tags">
            <animated.div style={boxShadowSpring}>
              <CreatableSelect
                isMulti
                value={newTags}
                onChange={(selectedOptions) => setNewTags([...selectedOptions] || [])}
                options={newTags}
                className="react-select-container"
                styles={customStyles}
              />
            </animated.div>
          </div>
        ) : (
          <div className="tags">
            {todo.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </li>
    </animated.div>
  );
};

export default React.memo(TodoItem);