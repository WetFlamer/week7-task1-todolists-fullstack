import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, fetchTodos } from "../../features/todoSlice";
import Todo from "./Todo";
import styles from "./styles/Todo.module.css";
import { useState } from "react";
const Todos = () => {
  const dispatch = useDispatch();
  const todos = useSelector((initialState) => initialState.todos);
  const error = useSelector((initialState) => initialState.error);
  const loading = useSelector((initialState) => initialState.loading);

  const [text, setText] = useState('')

  const handleTextEdit = (e) => {
    setText(e.target.value)
  }
  const handleAddTodo = () => {
    dispatch(addTodo({text}))
    setText('')
  }



  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  if (loading) {
    return <h1>...LOADING</h1>;
  }

  if (error) {
    return <h1>error: {error}</h1>;
  }

  return (
    <div>
      <div className={styles.mainBlock}>
        <div className={styles.addBlock}>
          <input onChange={handleTextEdit} value={text} type="text" />
          <button onClick={handleAddTodo} className={styles.addButton}>Добавить</button>
        </div>
        {todos.map((todo) => {
          return (
            <Todo
              key={todo._id}
              id={todo._id}
              title={todo.title}
              completed={todo.completed}
              loading={todo.loading}
              deleted={todo.deleted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Todos;
