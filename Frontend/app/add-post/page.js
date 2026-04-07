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
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!ready || !user) return;
    fetch(`${API_URL}/api/categories`)
      .then((r) => r.ok ? r.json() : [])
      .then(setCategories)
      .catch(() => {});
  }, [ready, user]);

  if (!ready || !user) {
    return null;
  }

  const toggleCategory = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
        body: JSON.stringify({ title, content, imageUrl: null, categoryIds: selectedIds }),
      });

      if (!res.ok) {
        setError('Příspěvek se nepodařilo publikovat. Zkuste to znovu.');
        return;
      }

      router.push('/');
    } catch {
      setError('Nepodařilo se připojit k serveru. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  const previewHtml = contentToHtml(content);

  return (
    <div className="add-post-container">
      <h1 className="page-title">Vytvořit nový příspěvek</h1>

      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-header">
          <div className="form-group title-group">
            <label htmlFor="title">Nadpis příspěvku</label>
            <input
              id="title"
              type="text"
              placeholder="Zadejte poutavý nadpis pro váš příspěvek..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="title-input"
            />
          </div>

          {categories.length > 0 && (
            <div className="form-group" style={{ marginBottom: 0, marginTop: '1.5rem' }}>
              <label>Kategorie</label>
              <div className="category-picker">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`category-pick-btn${selectedIds.includes(cat.id) ? ' selected' : ''}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="editor-preview-wrapper">
          <div className="editor-section">
            <div className="form-group">
              <label htmlFor="content">Obsah</label>
              <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '0.5rem' }}>
                Použijte tlačítko 🖼️ v panelu nástrojů pro vložení obrázků přímo do textu
              </p>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-panel">
              <h3 className="preview-panel-title">Náhled</h3>
              <div className="preview-content">
                {title && <h2 className="preview-title">{title}</h2>}
                {selectedIds.length > 0 && (
                  <div className="category-tags" style={{ marginBottom: '1rem' }}>
                    {categories
                      .filter((c) => selectedIds.includes(c.id))
                      .map((c) => (
                        <span key={c.id} className="category-tag">{c.name}</span>
                      ))}
                  </div>
                )}
                {previewHtml ? (
                  <div
                    className="preview-text"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p className="preview-placeholder">Náhled vašeho příspěvku se zobrazí zde...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publikování...' : 'Publikovat příspěvek'}
          </button>
          <Link href="/" className="btn btn-secondary">
            Zrušit
          </Link>
        </div>
      </form>
    </div>
  );
}
