'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import RichTextEditor from './editor';
import { useAuth } from '../AuthContext';
import './add-post.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function contentToHtml(jsonString) {
  if (!jsonString) return '';
  try {
    return generateHTML(JSON.parse(jsonString), [StarterKit, Image]);
  } catch {
    return '';
  }
}

export default function AddPost() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, content, imageUrl: null, categoryIds: [] }),
      });

      if (!res.ok) {
        setError('Failed to publish post. Please try again.');
        return;
      }

      router.push('/');
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewHtml = contentToHtml(content);

  return (
    <div className="add-post-container">
      <h1 className="page-title">Create New Post</h1>

      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-header">
          <div className="form-group title-group">
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter an engaging title for your post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="title-input"
            />
          </div>
        </div>

        <div className="editor-preview-wrapper">
          <div className="editor-section">
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '0.5rem' }}>
                Use the 🖼️ button in the toolbar to insert images directly into your text
              </p>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-panel">
              <h3 className="preview-panel-title">Preview</h3>
              <div className="preview-content">
                {title && <h2 className="preview-title">{title}</h2>}
                {previewHtml ? (
                  <div
                    className="preview-text"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p className="preview-placeholder">Your post preview will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
          <Link href="/profile" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
