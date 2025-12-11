import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // Example: fetch tasks from Python backend
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(() => console.log("Backend not running"));
  }, []);

  const addTask = (text) => {
    const newTask = { id: Date.now(), text };
    setTasks([...tasks, newTask]);
  };

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<TaskList tasks={tasks} />}
          />
          <Route
            path="/add"
            element={<AddTask addTask={addTask} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
