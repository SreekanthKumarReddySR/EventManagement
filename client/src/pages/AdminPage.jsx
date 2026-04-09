import { useEffect, useState } from 'react';
import { fetchAdminOverview, fetchUsers } from '../api/admin.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function AdminPage() {
  const { token } = useAuth();
  const [overview, setOverview] = useState({ totalUsers: 0, totalTasks: 0 });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadAdminData() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const [overviewData, usersData] = await Promise.all([
          fetchAdminOverview(token),
          fetchUsers(token)
        ]);
        setOverview(overviewData);
        setUsers(usersData);
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load admin data.');
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminData();
  }, [token]);

  return (
    <section className="page-stack">
      <section className="admin-grid">
        <article className="panel metric-card">
          <p className="eyebrow">Admin overview</p>
          <h2>{overview.totalUsers}</h2>
          <p className="section-copy">Registered users across the workspace.</p>
        </article>

        <article className="panel metric-card">
          <p className="eyebrow">Task volume</p>
          <h2>{overview.totalTasks}</h2>
          <p className="section-copy">Total tasks visible to admins.</p>
        </article>
      </section>

      {errorMessage ? <p className="banner error-text">{errorMessage}</p> : null}
      {isLoading ? <p className="banner">Loading admin dashboard...</p> : null}

      {!isLoading ? (
        <section className="panel">
          <div className="panel-copy">
            <p className="eyebrow">User access</p>
            <h2>Role breakdown</h2>
            <p className="section-copy">This route is protected for admins only.</p>
          </div>

          <div className="user-list">
            {users.map((currentUser) => (
              <article className="user-card" key={currentUser.id}>
                <div>
                  <h3>{currentUser.name}</h3>
                  <p>{currentUser.email}</p>
                </div>
                <div className="user-meta">
                  <span className="task-status-pill">{currentUser.role}</span>
                  <span>{currentUser.taskCount} tasks</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
