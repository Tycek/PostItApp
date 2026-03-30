'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    // mock list of latest posts
    const posts = [
      { id: 1, title: 'A Walk Through Autumn Memories', date: 'February 24, 2026' },
      { id: 2, title: 'Why I Chose to Learn Coding Later in Life', date: 'February 20, 2026' },
      { id: 3, title: 'Reflections on My First Book', date: 'February 15, 2026' },
    ];

    return (
      <div>
        <h1 className="page-title">Latest Stories</h1>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', hover: { transform: 'translateY(-2px)' } }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{post.title}</h3>
                <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>Posted on {post.date}</p>
                <p style={{ color: '#666', lineHeight: '1.6' }}>Click to read the full story...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // not logged in version
  return (
    <div>
      <h1 className="page-title">Welcome to TextApp</h1>
      
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          Share Your Text Content
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#555', lineHeight: '1.6' }}>
          TextApp allows you to post text content with images and text formatting. 
          Connect with others and share your thoughts easily.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className="btn">
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <h3 style={{ color: '#3498db' }}>📝 Post Content</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Create posts with text formatting, add images, and express yourself.
          </p>
        </div>
        
        <div className="card">
          <h3 style={{ color: '#3498db' }}>👤 Your Profile</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Manage your account and view all your posts in one place.
          </p>
        </div>
        
        <div className="card">
          <h3 style={{ color: '#3498db' }}>🎨 Rich Formatting</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Format your text with bold, italic, and other styling options.
          </p>
        </div>
      </div>
    </div>
  );
}
