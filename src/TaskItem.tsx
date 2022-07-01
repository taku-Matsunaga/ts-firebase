import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { Grid, ListItem, TextField } from "@mui/material";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "./firebase";
import styles from "./TaskItem.module.css";

interface PROPS {
  id: string;
  title: string;
}

const TaskItem: React.FC<PROPS> = (props) => {
  const [title, setTitle] = useState(props.title);
  const tasksRef = collection(db, "tasks");

  const editTask = async () => {
    await setDoc(
      doc(tasksRef, props.id),
      {
        title: title,
      },
      { merge: true }
    );
  };

  const deleteTask = async () => {
    await deleteDoc(doc(tasksRef, props.id));
  };

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justifyContent={"flex-end"}>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Edit task"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
      </Grid>
      <button className={styles.taskitem__icon} onClick={editTask}>
        <EditOutlined />
      </button>
      <button className={styles.taskitem__icon} onClick={deleteTask}>
        <DeleteOutlineOutlined />
      </button>
    </ListItem>
  );
};

export default TaskItem;
