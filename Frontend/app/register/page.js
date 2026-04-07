'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Hesla se neshodují.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.[0]?.description ?? 'Registrace se nezdařila. Zkuste to znovu.';
        setError(message);
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
        <h1 className="page-title">Vytvořit účet</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Celé jméno</label>
            <input
              id="fullname"
              type="text"
              placeholder="Zadejte vaše celé jméno"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirm-password">Potvrdit heslo</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Potvrďte vaše heslo"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Vytváření účtu...' : 'Vytvořit účet'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          Již máte účet? <Link href="/login" className="link">Přihlaste se</Link>
        </p>
      </div>
    </div>
  );
}
