'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">My Profile</h1>
        <Link href="/add-post" className="btn">
          + New Post
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
            <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>John Doe</h2>
            <p style={{ color: '#666', marginBottom: '0.25rem' }}>john@example.com</p>
            <p style={{ color: '#999', fontSize: '0.875rem' }}>Member since January 2026</p>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
          Edit Profile
        </button>
        <button className="btn btn-secondary">
          Logout
        </button>
      </div>

      <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>My Posts</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>My Summer in Paris</h3>
          <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>Posted on January 15, 2026</p>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
            The most unforgettable summer of my life. From walking along the Seine at sunset to discovering hidden cafés in the Marais district, Paris captured my heart in ways I never expected. Every corner tells a story, and I'm still living in those memories...
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Edit
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Delete
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>The Day I Made a Life-Changing Decision</h3>
          <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>Posted on January 10, 2026</p>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
            Leaving my job to follow my passion was terrifying. But looking back now, it's the best decision I've ever made. This is my story of courage, doubt, and ultimately finding my true path. Life is too short not to chase what makes your heart sing.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Edit
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Delete
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Lessons from My Grandmother</h3>
          <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>Posted on January 5, 2026</p>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
            She taught me that the simplest moments often hold the deepest meaning. Whether it was baking together in her kitchen or listening to her stories on the porch, those quiet times shaped who I am today. A beautiful reminder that life is measured in connections, not achievements.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Edit
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
