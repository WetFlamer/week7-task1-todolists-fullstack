import React from "react";
import { useDispatch } from "react-redux";
import { completeTodo, deleteTodo } from "../../features/todoSlice";
import styles from "./styles/Todo.module.css";
const Todo = ({ id, title, completed, loading, deleted}) => {
const dispatch = useDispatch()

const handleChecked = () => {
  dispatch(completeTodo({id, completed}))
}

const handleDelete = () => {
  dispatch(deleteTodo({id, deleted}))
}

if(loading) {
  return '-_-'
}
if(deleted) {
  return ':('
} 
  return (
    
      <div className={styles.todoBlock}>
        <input className={styles.checkBox} onChange={handleChecked} checked={completed} type="checkBox" />
        <div>
          <li className={styles.todoText}>{title}</li>
        </div>
        <button onClick={handleDelete} className={styles.deleteButton}>X</button>
      </div>
  );
};

export default Todo;
