'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Neplatný e-mail nebo heslo.');
        return;
      }

      const data = await res.json();
      login(data);
      router.push('/profile');
    } catch {
      setError('Nepodařilo se připojit k serveru. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="card">
        <h1 className="page-title">Přihlášení</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mailová adresa</label>
            <input
              id="email"
              type="email"
              placeholder="Zadejte váš e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Heslo</label>
            <input
              id="password"
              type="password"
              placeholder="Zadejte vaše heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          Nemáte účet? <Link href="/register" className="link">Zaregistrujte se</Link>
        </p>
      </div>
    </div>
  );
}
