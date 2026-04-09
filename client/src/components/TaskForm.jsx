import { useState } from 'react';

const initialFormState = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: ''
};

export default function TaskForm({ onSubmit, isSubmitting }) {
  const [formValues, setFormValues] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formValues.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    setFormError('');

    try {
      await onSubmit({
        ...formValues,
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        dueDate: formValues.dueDate || null
      });

      setFormValues(initialFormState);
    } catch (error) {
      setFormError(error.message || 'Unable to create the task.');
    }
  }

  return (
    <section className="panel panel-highlight">
      <div className="panel-copy">
        <p className="eyebrow">New task</p>
        <h2>Create task</h2>
        <p>Add a title, optional notes, and a due date.</p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input
            name="title"
            placeholder="Prepare product demo"
            value={formValues.title}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            name="description"
            placeholder="Share the updated deck before the meeting."
            rows="3"
            value={formValues.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </label>

        <div className="form-row">
          <label>
            <span>Status</span>
            <select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label>
            <span>Due date</span>
            <input
              type="date"
              name="dueDate"
              value={formValues.dueDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </label>
        </div>

        {formError ? <p className="form-message error-text">{formError}</p> : null}

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add task'}
        </button>
      </form>
    </section>
  );
}
