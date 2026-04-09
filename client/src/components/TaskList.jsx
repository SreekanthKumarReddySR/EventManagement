import TaskItem from './TaskItem.jsx';

export default function TaskList({
  tasks,
  updatingTaskId,
  deletingTaskId,
  onStatusChange,
  onDelete
}) {
  if (tasks.length === 0) {
    return (
      <section className="panel empty-state compact-empty-state">
        <p className="eyebrow">No tasks</p>
        <h2>Nothing to show</h2>
        <p>Create a task or adjust the filters.</p>
      </section>
    );
  }

  return (
    <section className="task-grid compact-task-grid">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isUpdating={updatingTaskId === task.id}
          isDeleting={deletingTaskId === task.id}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
