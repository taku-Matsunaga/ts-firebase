import { AddToPhotos, ExitToApp } from "@mui/icons-material";
import { FormControl, List, TextField } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import { auth, db } from "./firebase";
import TaskItem from "./TaskItem";

const App: React.FC = (props: any) => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      !user && navigate("login");
    });
    return () => unSub();
  });

  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      );
    });
    return () => unsub();
  }, []);

  const newTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addDoc(collection(db, "tasks"), { title: input });
    setInput("");
  };

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>

      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await signOut(auth);
            navigate("login");
          } catch (error: any) {
            alert(error.message);
          }
        }}
      >
        <ExitToApp />
      </button>

      <br />
      <FormControl>
        <TextField
          sx={{ marginTop: "30px", marginBottom: "20px" }}
          InputLabelProps={{
            shrink: true,
          }}
          label="New Task?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotos />
      </button>

      <List sx={{ margin: "auto", width: "40%" }}>
        {tasks.map((task) => (
          <TaskItem id={task.id} title={task.title} key={task.id} />
        ))}
      </List>
    </div>
  );
};

export default App;
