import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

const initialValues = {
  name: '',
  email: '',
  password: '',
  role: 'member'
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formValues, setFormValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const user = await signup(formValues);
      navigate(user.role === 'admin' ? '/app/admin' : '/app/tasks', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create the account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel panel panel-highlight">
        <div className="panel-copy">
          <p className="eyebrow">Create account</p>
          <h1>Sign up and choose a role for this demo.</h1>
          <p>Members get personal task access. Admins also get the team overview route.</p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input name="name" value={formValues.name} onChange={handleChange} />
          </label>

          <label>
            <span>Email</span>
            <input name="email" type="email" value={formValues.email} onChange={handleChange} />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Role</span>
            <select name="role" value={formValues.role} onChange={handleChange}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {errorMessage ? <p className="form-message error-text">{errorMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Log in instead</Link>.
        </p>
      </section>
    </main>
  );
}
