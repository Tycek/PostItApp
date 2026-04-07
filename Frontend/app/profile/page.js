'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Můj profil</h1>
        <Link href="/add-post" className="btn">
          + Nový příspěvek
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#3498db',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            👤
          </div>
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{user.displayName}</h2>
            <p style={{ color: '#666', marginBottom: '0.25rem' }}>{user.email}</p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleLogout}>
          Odhlásit se
        </button>
      </div>

      <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Moje příspěvky</h2>
      <p style={{ color: '#999' }}>Správa příspěvků bude brzy k dispozici.</p>
    </div>
  );
}
