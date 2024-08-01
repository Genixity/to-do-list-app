import React, { memo } from 'react';
import TodoItem from './TodoItem';
import '../styles/TodoListPage.css';

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

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  editTodo: (id: number | null) => void;
  updateTodo: (id: number, newText: string, newPriority: Priority, newDueDate: string, newTags: string[]) => void;
  editingId: number | null;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, removeTodo, editTodo, updateTodo, editingId }) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          toggleTodo={toggleTodo} 
          removeTodo={removeTodo} 
          editTodo={editTodo}
          updateTodo={updateTodo}
          isEditing={editingId === todo.id}
        />
      ))}
    </ul>
  );
};

export default memo(TodoList);