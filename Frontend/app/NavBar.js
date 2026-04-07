'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';

import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogoClick = (e) => {
    e.preventDefault();
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" onClick={handleLogoClick} className="nav-brand">
          <img src="/logo.svg" alt="PostIt logo" className="nav-logo" />
        </a>
        <ul className="nav-links">
          {!user && (
            <>
              <li><Link href="/login">Přihlásit se</Link></li>
              <li><Link href="/register">Registrovat se</Link></li>
            </>
          )}
          {user && (
            <>
              <li><Link href="/profile">Profil</Link></li>
              <li><Link href="/add-post">Přidat příspěvek</Link></li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                  Odhlásit se
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
