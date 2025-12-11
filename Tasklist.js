import TaskItem from "./TaskItem";

export default function TaskList({ tasks }) {
  return (
    <div>
      <h2>Your Tasks</h2>
      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} />
      ))}
    </div>
  );
}
