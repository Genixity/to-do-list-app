import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const apiUrl = 'https://66a89223e40d3aa6ff588463.mockapi.io/api/v1';

interface TodoList {
    id: number;
    name: string;
}

const useTodoLists = () => {
    const { t } = useTranslation();
    const [todoLists, setTodoLists] = useState<TodoList[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [newListName, setNewListName] = useState('');
    const [editingListId, setEditingListId] = useState<number | null>(null);
    const [editingListName, setEditingListName] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTodoLists = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/todoLists`);
            setTodoLists(response.data);
            setLoading(false);
            setError('');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            console.error("Failed to fetch todo lists:", errorMessage);
            setLoading(false);
            setError('Failed to fetch');
        }
    }, []);

    useEffect(() => {
        fetchTodoLists();
    }, [fetchTodoLists]);

    const addTodoList = useCallback(async (name: string) => {
        setIsModalOpen(false);
        const trimmedName = name.trim().toLowerCase();

        if (!trimmedName) {
            toast.error(t('List name cannot be empty'));
            return;
        }

        const listExists = todoLists.some(list => list.name.toLowerCase() === trimmedName);

        if (listExists) {
            toast.error(t('A list with the same name already exists'));
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/todoLists`, { name });
            setTodoLists([...todoLists, response.data]);
            setNewListName('');
        } catch (error) {
            console.error("Failed to add todo list:", error);
        }
    }, [todoLists, t]);

    const removeTodoList = useCallback(async (id: number) => {
        try {
            const response = await axios.get(`${apiUrl}/todos`, { params: { todoListsId: id } });
            const todos = response.data;

            if (todos.length > 0) {
                await Promise.all(todos.map((todo: any) => axios.delete(`${apiUrl}/todos/${todo.id}`)));
            }

            setTodoLists(todoLists.filter((list: TodoList) => list.id !== id));

            setTimeout(async () => {
                try {
                    await axios.delete(`${apiUrl}/todoLists/${id}`);
                    console.log(`Seznam ${id} a všechny jeho úkoly byly úspěšně odstraněny.`);
                } catch (error) {
                    console.error("Failed to remove todo list:", error);
                }
            }, 500);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                setTodoLists(todoLists.filter((list: TodoList) => list.id !== id));
            } else {
                console.error("Failed to remove todo list:", error);
            }
        }
    }, [todoLists]);

    const startEditing = useCallback((id: number, name: string) => {
        setEditingListId(id);
        setEditingListName(name);
    }, []);

    const saveEdit = useCallback(async () => {
        if (editingListId !== null) {
            const updatedList = todoLists.find(list => list.id === editingListId);
            if (updatedList) {
                updatedList.name = editingListName;
    
                setEditingListId(null);
                setEditingListName('');
    
                try {
                    const response = await axios.put(`${apiUrl}/todoLists/${editingListId}`, updatedList);
                    setTodoLists(todoLists.map(list => (list.id === editingListId ? response.data : list)));
                } catch (error) {
                    console.error("Failed to update todo list:", error);
                }
            }
        }
    }, [editingListId, editingListName, todoLists]);
    

    return {
        todoLists,
        loading,
        selectedListId,
        newListName,
        editingListId,
        editingListName,
        error,
        isModalOpen,
        setSelectedListId,
        setNewListName,
        addTodoList,
        removeTodoList,
        startEditing,
        saveEdit,
        setIsModalOpen
    };
};

export default useTodoLists;