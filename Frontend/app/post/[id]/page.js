'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useAuth } from '../../AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function contentToHtml(jsonString) {
  if (!jsonString) return '';
  try {
    return generateHTML(JSON.parse(jsonString), [StarterKit, Image]);
  } catch {
    return '';
  }
}

export default function PostDetail({ params }) {
  const { user } = useAuth();
  const postId = params.id;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

    Promise.all([
      fetch(`${API_URL}/api/posts/${postId}`, { headers }).then((r) => r.ok ? r.json() : Promise.reject()),
      fetch(`${API_URL}/api/posts/${postId}/comments`).then((r) => r.ok ? r.json() : []),
    ])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setLikeCount(postData.likeCount);
        setHasLiked(postData.isLikedByCurrentUser);
        setComments(commentsData);
      })
      .catch(() => setError('Příspěvek se nepodařilo načíst.'))
      .finally(() => setLoading(false));
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.ok) {
      const { liked } = await res.json();
      setHasLiked(liked);
      setLikeCount((c) => liked ? c + 1 : c - 1);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setCommentLoading(true);

    const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    }
    setCommentLoading(false);
  };

  if (loading) return <p style={{ color: '#999' }}>Načítání...</p>;
  if (error || !post) {
    return (
      <div className="form-wrapper">
        <div className="card">
          <h1>Příspěvek nebyl nalezen</h1>
          <Link href="/">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#3498db', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Zpět na příspěvky
      </Link>

      <article className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '1rem', lineHeight: '1.4' }}>{post.title}</h1>

        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', marginBottom: '0.25rem' }}>Autor: <strong>{post.authorDisplayName}</strong></p>
          <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: post.categories?.length > 0 ? '0.75rem' : 0 }}>
            Publikováno {new Date(post.createdAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {post.categories?.length > 0 && (
            <div className="category-tags">
              {post.categories.map((name) => (
                <span key={name} className="category-tag">{name}</span>
              ))}
            </div>
          )}
        </div>

        <div
          style={{ color: '#333', lineHeight: '1.8', marginBottom: '2rem' }}
          dangerouslySetInnerHTML={{ __html: contentToHtml(post.content) }}
        />

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button
            onClick={handleLike}
            className={`btn ${hasLiked ? '' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            disabled={!user}
          >
            {hasLiked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'To se mi líbí' : 'Líbí se mi to'}
          </button>
          <span style={{ color: '#666' }}>💬 {comments.length} {comments.length === 1 ? 'komentář' : comments.length >= 2 && comments.length <= 4 ? 'komentáře' : 'komentářů'}</span>
        </div>
      </article>

      <section className="card">
        <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Komentáře ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #ddd' }}>
            <div className="form-group">
              <label htmlFor="comment">Přidat komentář</label>
              <textarea
                id="comment"
                placeholder="Napište svůj komentář..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ minHeight: '100px' }}
              />
            </div>
            <button type="submit" className="btn" disabled={!newComment.trim() || commentLoading}>
              {commentLoading ? 'Odesílání...' : 'Odeslat komentář'}
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
            <p><Link href="/login" className="link">Přihlaste se</Link> pro přidání komentáře</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>Zatím žádné komentáře. Buďte první!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#2c3e50' }}>{comment.authorDisplayName}</strong>
                  <span style={{ color: '#999', fontSize: '0.875rem' }}>
                    {new Date(comment.createdAt).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
