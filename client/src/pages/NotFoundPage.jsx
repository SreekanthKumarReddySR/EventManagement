import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel panel">
        <p className="eyebrow">404</p>
        <h1>That route does not exist.</h1>
        <p className="section-copy">The page you asked for is outside the configured route map.</p>
        <Link className="primary-button inline-button" to="/app/tasks">
          Back to tasks
        </Link>
      </section>
    </main>
  );
}
