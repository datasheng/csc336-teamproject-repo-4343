export default function TaskItem({ task }) {
  return (
    <div className="task">
      <span>{task.text}</span>
      <small>ID: {task.id}</small>
    </div>
  );
}
