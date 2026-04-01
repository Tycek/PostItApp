'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useAuth } from './AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function contentToHtml(jsonString) {
  if (!jsonString) return '';
  try {
    return generateHTML(JSON.parse(jsonString), [StarterKit, Image]);
  } catch {
    return '';
  }
}

export default function Home() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!ready || !user) return;
    fetch(`${API_URL}/api/posts`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setPosts)
      .catch(() => setError('Could not load posts.'))
      .finally(() => setLoading(false));
  }, [ready, user]);

  if (!ready || !user) return null;
  if (loading) return <p style={{ color: '#999' }}>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="page-title">Latest Stories</h1>
        <p style={{ color: '#999' }}>No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Latest Stories</h1>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.25rem' }}>{post.title}</h3>
              <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {post.authorDisplayName} &middot; {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div
                className="post-content-preview"
                dangerouslySetInnerHTML={{ __html: contentToHtml(post.content) }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
