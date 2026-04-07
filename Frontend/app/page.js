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
      .catch(() => setError('Příspěvky se nepodařilo načíst.'))
      .finally(() => setLoading(false));
  }, [ready, user]);

  if (!ready || !user) return null;
  if (loading) return <p style={{ color: '#999' }}>Načítání příspěvků...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="page-title">Nejnovější příspěvky</h1>
        <p style={{ color: '#999' }}>Zatím žádné příspěvky. Buďte první!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Nejnovější příspěvky</h1>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.25rem' }}>{post.title}</h3>
              <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                {post.authorDisplayName} &middot; {new Date(post.createdAt).toLocaleDateString('cs-CZ')}
              </p>
              {post.categories?.length > 0 && (
                <div className="category-tags">
                  {post.categories.map((name) => (
                    <span key={name} className="category-tag">{name}</span>
                  ))}
                </div>
              )}
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
