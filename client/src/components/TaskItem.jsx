function parseDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateValue);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return 'No due date';
  }

  const parsedDate = parseDate(dateValue);

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(parsedDate);
}

export default function TaskItem({
  task,
  isUpdating,
  isDeleting,
  onStatusChange,
  onDelete
}) {
  return (
    <article className={`task-card status-${task.status}`}>
      <div className="task-card-top">
        <div>
          <p className="task-status-pill">{task.status.replace('-', ' ')}</p>
          <h3>{task.title}</h3>
        </div>

        <button
          className="ghost-button compact-button"
          type="button"
          onClick={() => onDelete(task)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <p className="task-description">
        {task.description || 'No description added.'}
      </p>

      <div className="task-card-footer">
        <div className="task-meta">
          <span>Due {formatDate(task.dueDate)}</span>
          <span>Created {formatDate(task.createdAt)}</span>
        </div>

        <label className="status-select compact-select">
          <span>Status</span>
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task, event.target.value)}
            disabled={isUpdating}
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
    </article>
  );
}
