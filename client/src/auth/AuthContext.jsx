import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser, loginUser, signupUser, uploadProfilePhoto } from '../api/auth.js';

const AUTH_STORAGE_KEY = 'task-manager-auth';
const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch (error) {
    return null;
  }
}

function saveSession(token, user) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
}

export function AuthProvider({ children }) {
  const initialSession = readStoredSession();
  const [token, setToken] = useState(initialSession?.token || '');
  const [user, setUser] = useState(initialSession?.user || null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(initialSession?.token));

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    let isCancelled = false;

    async function hydrateUser() {
      try {
        const currentUser = await fetchCurrentUser(token);

        if (!isCancelled) {
          setUser(currentUser);
          saveSession(token, currentUser);
        }
      } catch (error) {
        if (!isCancelled) {
          setToken('');
          setUser(null);
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } finally {
        if (!isCancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    hydrateUser();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  async function login(credentials) {
    const session = await loginUser(credentials);
    setToken(session.token);
    setUser(session.user);
    saveSession(session.token, session.user);
    return session.user;
  }

  async function signup(userDetails) {
    const session = await signupUser(userDetails);
    setToken(session.token);
    setUser(session.user);
    saveSession(session.token, session.user);
    return session.user;
  }

  async function updateAvatar(file) {
    const updatedUser = await uploadProfilePhoto(token, file);
    setUser(updatedUser);
    saveSession(token, updatedUser);
    return updatedUser;
  }

  function logout() {
    setToken('');
    setUser(null);
    setIsBootstrapping(false);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  const value = {
    token,
    user,
    isBootstrapping,
    isAuthenticated: Boolean(token && user),
    login,
    signup,
    updateAvatar,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
