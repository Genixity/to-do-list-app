import React, { useCallback, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSpring, animated, useTransition, config } from '@react-spring/web';
import TodoListPage from './components/TodoListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';
import useTodoLists from './hooks/useTodoLists';
import useTheme from './hooks/useTheme';
import Header from './components/Header';
import AddListModal from './components/AddListModal';
import HoverableCard from './components/HoverableCard';

const App: React.FC = () => {
  const {
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
  } = useTodoLists();

  const { theme, toggleTheme } = useTheme();
  const [isClosing, setIsClosing] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
  const closeModal = useCallback(() => {
      setIsClosing(true);
      setTimeout(() => {
          setIsModalOpen(false);
          setIsClosing(false);
      }, 500);
  }, [setIsModalOpen]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          addTodoList(newListName);
      }
  }, [addTodoList, newListName]);

  const listAnimation = useSpring({
      opacity: todoLists.length ? 1 : 0,
      transform: todoLists.length ? 'translateY(0)' : 'translateY(20%)',
      config: { tension: 300, friction: 20 },
  });

  const transitions = useTransition(todoLists, {
      from: { opacity: 1, transform: 'scale(1)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
      enter: { opacity: 1, transform: 'scale(1)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
      leave: [
          { transform: 'scale(1.1)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', config: config.stiff },
          { transform: 'scale(0)', opacity: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)', config: { duration: 300, easing: t => t * t } },
      ],
      keys: todoLists.map(list => list.id),
  });

  if (selectedListId !== null) {
      return <TodoListPage listId={selectedListId} goBack={() => setSelectedListId(null)} />;
  }

  return (
      <div className="App">
          <ToastContainer />
          <Header theme={theme} toggleTheme={toggleTheme} openModal={openModal} />
          <main>
              <animated.div style={listAnimation} className="todo-lists">
                  {loading ? (
                      Array(4).fill(0).map((_, index) => (
                          <div key={index} className="todo-list-card">
                              <Skeleton />
                              <div className="todo-list-actions">
                                  <Skeleton height={24} width={24} />
                                  <Skeleton height={24} width={24} />
                              </div>
                          </div>
                      ))
                  ) : error ? (
                      <div>{error}</div>
                  ) : (
                      transitions((style, list) => (
                          <HoverableCard
                              key={list.id}
                              style={style}
                              list={list}
                              editingListId={editingListId}
                              editingListName={editingListName}
                              handleListSelect={setSelectedListId}
                              startEditing={startEditing}
                              saveEdit={saveEdit}
                              removeTodoList={removeTodoList}
                              setEditingListName={(name: string) => startEditing(editingListId!, name)}
                          />
                      ))
                  )}
              </animated.div>
          </main>
          <AddListModal
              isOpen={isModalOpen}
              isClosing={isClosing}
              newListName={newListName}
              onClose={closeModal}
              onAddList={addTodoList}
              onChange={setNewListName}
              onKeyPress={handleKeyPress}
          />
      </div>
  );
};

export default App;