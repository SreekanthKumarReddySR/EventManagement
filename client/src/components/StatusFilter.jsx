const filterOptions = [
  { value: 'all', label: 'All tasks' },
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' }
];

export default function StatusFilter({ value, onChange, taskCount, pageMeta }) {
  return (
    <section className="panel panel-compact">
      <div>
        <p className="eyebrow">Tasks</p>
        <h2>Overview</h2>
        <p className="section-copy">
          {pageMeta.totalItems} total tasks, page {pageMeta.page} of {pageMeta.totalPages}.
        </p>
      </div>

      <div className="filter-row">
        <label>
          <span>Status</span>
          <select value={value} onChange={(event) => onChange(event.target.value)}>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="task-count-card">
          <span>{taskCount}</span>
          <small>on this page</small>
        </div>
      </div>
    </section>
  );
}
