import { useState } from "react";

export default function AddTask({ addTask }) {
  const [text, setText] = useState("");

  return (
    <div>
      <h2>Add New Task</h2>
      <input
        value={text}
        placeholder="Enter task"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => { addTask(text); setText(""); }}>
        Add
      </button>
    </div>
  );
}
