import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
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
      await login(formValues);
      navigate(location.state?.from?.pathname || '/app/tasks', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel panel panel-highlight">
        <div className="panel-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in to your task workspace.</h1>
          <p>Use your account to access protected tasks and role-based routes.</p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
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

          {errorMessage ? <p className="form-message error-text">{errorMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footnote">
          Need an account? <Link to="/signup">Create one here</Link>.
        </p>
      </section>
    </main>
  );
}
