import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

interface OptionType {
  value: string;
  label: string;
}

const useTodos = (listId: number) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [tagOptions, setTagOptions] = useState<OptionType[]>([]);

  const apiUrl = useMemo(() => `https://66a89223e40d3aa6ff588463.mockapi.io/api/v1/todos`, []);

  const fetchTodos = useCallback(async () => {
    try {
      const { data } = await axios.get(apiUrl, { params: { todoListsId: listId } });
      setTodos(data);
      checkDueDates(data);
      
      const uniqueTags = Array.from(new Set<string>(data.flatMap((todo: Todo) => todo.tags)))
        .map(tag => ({ value: tag, label: tag }));
      setTagOptions(uniqueTags);

      const { data: listData } = await axios.get(`https://66a89223e40d3aa6ff588463.mockapi.io/api/v1/todoLists/${listId}`);
      const listName = listData.name;
      setTitle(listName);
      document.title = `${listName} - Todo List`;
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }, [apiUrl, listId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const checkDueDates = (todos: Todo[]) => {
    const today = new Date();
    todos.forEach(todo => {
      if (todo.dueDate && !todo.completed) {
        const dueDate = new Date(todo.dueDate);
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          toast.warn(`Úkol "${todo.text}" má termín splatnosti ${dueDate.toLocaleDateString()}`);
        }
      }
    });
  };

  const addTodo = async (text: string, priority: Priority, dueDate: string, tags: string[]) => {
    const newTodo: Omit<Todo, 'id'> = {
      text,
      completed: false,
      todoListsId: listId,
      priority,
      dueDate,
      tags,
      createdAt: new Date().toISOString()
    };
    try {
      const { data } = await axios.post(apiUrl, newTodo);
      setTodos(prevTodos => [...prevTodos, data]);
      checkDueDates([data]);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      try {
        const { data } = await axios.put(`${apiUrl}/${id}`, updatedTodo);
        setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? data : todo)));
      } catch (error) {
        console.error("Failed to toggle todo:", error);
      }
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Failed to remove todo:", error);
    }
  };

  const updateTodo = async (id: number, newText: string, newPriority: Priority, newDueDate: string, newTags: string[]) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    if (updatedTodo) {
      const newTodo = { ...updatedTodo, text: newText, priority: newPriority, dueDate: newDueDate, tags: newTags };
      try {
        const { data } = await axios.put(`${apiUrl}/${id}`, newTodo);
        setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? data : todo)));
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    }
  };

  return {
    todos,
    title,
    tagOptions,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo
  };
};

export default useTodos;