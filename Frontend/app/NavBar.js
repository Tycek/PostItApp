'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';

import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogoClick = (e) => {
    e.preventDefault();
    router.push('/'); // home always, page will render based on auth
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" onClick={handleLogoClick} className="nav-brand">
          <img src="/logo.svg" alt="TextApp logo" className="nav-logo" />
        </a>
        <ul className="nav-links">
          {!user && (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
            </>
          )}
          {user && (
            <>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/add-post">Add Post</Link></li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}