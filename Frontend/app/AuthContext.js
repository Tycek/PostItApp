'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('textapp-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setReady(true);
  }, []);

  const login = (authResponse) => {
    setUser(authResponse);
    localStorage.setItem('textapp-user', JSON.stringify(authResponse));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('textapp-user');
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
