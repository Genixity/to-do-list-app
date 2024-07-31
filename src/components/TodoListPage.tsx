import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

type Priority = 'Low' | 'Medium' | 'High';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  todoListsId: number;
  priority: Priority;
  dueDate: string;
  tags: string[];
  createdAt: string;
}

interface TodoListPageProps {
  listId: number;
  goBack: () => void;
}

const TodoListPage: React.FC<TodoListPageProps> = ({ listId, goBack }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const { t } = useTranslation();

  const apiUrl = `https://66a89223e40d3aa6ff588463.mockapi.io/api/v1/todos`;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(apiUrl, { params: { todoListsId: listId } });
        console.log("Fetched todos:", response.data);
        setTodos(response.data);
        checkDueDates(response.data); // Check due dates on initial fetch
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    fetchTodos();
  }, [listId]);

  const checkDueDates = (todos: Todo[]) => {
    const today = new Date();
    todos.forEach(todo => {
      if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1 && !todo.completed) {
          toast.warn(`Úkol "${todo.text}" má termín splatnosti ${dueDate.toLocaleDateString()}`);
        }
      }
    });
  };

  const addTodo = async (text: string, priority: Priority, dueDate: string, tags: string[]) => {
    const newTodo = {
      text,
      completed: false,
      todoListsId: listId,
      priority,
      dueDate,
      tags,
      createdAt: new Date().toISOString()
    };
    try {
      const response = await axios.post(apiUrl, newTodo);
      console.log("Added todo:", response.data);
      setTodos([...todos, response.data]);
      checkDueDates([response.data]); // Check due date for new todo
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      try {
        const response = await axios.put(`${apiUrl}/${id}`, updatedTodo);
        console.log("Toggled todo:", response.data);
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
      } catch (error) {
        console.error("Failed to toggle todo:", error);
      }
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      console.log("Removed todo:", id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Failed to remove todo:", error);
    }
  };

  const editTodo = (id: number) => {
    setEditingId(id);
  };

  const updateTodo = async (id: number, newText: string, newPriority: Priority, newDueDate: string, newTags: string[]) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    if (updatedTodo) {
      updatedTodo.text = newText;
      updatedTodo.priority = newPriority;
      updatedTodo.dueDate = newDueDate;
      updatedTodo.tags = newTags;
      try {
        const response = await axios.put(`${apiUrl}/${id}`, updatedTodo);
        console.log("Updated todo:", response.data);
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
        setEditingId(null);
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    }
  };

  const priorityOrder: { [key in Priority]: number } = { Low: 1, Medium: 2, High: 3 };

  const filteredTodos = todos
    .filter(todo => 
      todo.text.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterTags.length === 0 || filterTags.every(tag => todo.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())))
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'text') {
        comparison = a.text.localeCompare(b.text);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFilterTags(tags);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <button onClick={goBack}>{t('Back')}</button>
      <h2>{t('Todo Lists')}</h2>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={t('Search Todos')}
      />
      <input
        type="text"
        value={filterTags.join(', ')}
        onChange={handleTagsChange}
        placeholder={t('Filter Tags')}
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt">{t('Created At')}</option>
        <option value="priority">{t('Priority')}</option>
        <option value="dueDate">{t('Due Date')}</option>
        <option value="text">{t('Alphabetically')}</option>
      </select>
      <button onClick={toggleSortOrder}>
        {t('Sort by')} {sortOrder === 'asc' ? t('Ascending') : t('Descending')}
      </button>
      <TodoForm addTodo={addTodo} />
      <TodoList 
        todos={filteredTodos} 
        toggleTodo={toggleTodo} 
        removeTodo={removeTodo} 
        editTodo={editTodo}
        updateTodo={updateTodo}
        editingId={editingId}
      />
    </div>
  );
};

export default TodoListPage;