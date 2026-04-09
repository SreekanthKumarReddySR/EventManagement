import { useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { resolveAssetUrl } from '../../api/client.js';
import { useAuth } from '../../auth/AuthContext.jsx';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}

export default function AppLayout() {
  const { user, updateAvatar, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError('');
    setIsUploadingAvatar(true);

    try {
      await updateAvatar(file);
      setIsProfileOpen(true);
    } catch (error) {
      setUploadError(error.message || 'Unable to upload the profile photo.');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header panel">
        <div>
          <p className="eyebrow">Secure Workspace</p>
          <h1>Task manager with role-based access.</h1>
          <p className="hero-copy">
            Signed in as {user?.name} ({user?.role}). Members manage their own tasks, while admins also get team oversight.
          </p>
        </div>

        <div className="header-actions">
          <nav className="app-nav">
            <NavLink to="/app/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Tasks
            </NavLink>
            {user?.role === 'admin' ? (
              <NavLink to="/app/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="profile-stack">
            <button
              className="profile-trigger"
              type="button"
              onClick={() => setIsProfileOpen((currentValue) => !currentValue)}
            >
              {user?.avatarUrl ? (
                <img
                  className="profile-avatar"
                  src={resolveAssetUrl(user.avatarUrl)}
                  alt={`${user.name} profile`}
                />
              ) : (
                <span className="profile-avatar profile-avatar-fallback">{getInitials(user?.name)}</span>
              )}

              <span className="profile-copy">
                <strong>{user?.name}</strong>
                <small>Profile</small>
              </span>
            </button>

            {isProfileOpen ? (
              <section className="profile-card">
                <div className="profile-card-top">
                  {user?.avatarUrl ? (
                    <img
                      className="profile-avatar profile-avatar-large"
                      src={resolveAssetUrl(user.avatarUrl)}
                      alt={`${user.name} profile`}
                    />
                  ) : (
                    <span className="profile-avatar profile-avatar-large profile-avatar-fallback">
                      {getInitials(user?.name)}
                    </span>
                  )}

                  <div>
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                    <span className="task-status-pill">{user?.role}</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  className="hidden-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                />

                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? 'Uploading photo...' : 'Add a photo'}
                </button>

                {uploadError ? <p className="form-message error-text">{uploadError}</p> : null}

                <button className="ghost-button" type="button" onClick={logout}>
                  Logout
                </button>
              </section>
            ) : null}
          </div>
        </div>
      </header>

      <Outlet />
    </main>
  );
}
