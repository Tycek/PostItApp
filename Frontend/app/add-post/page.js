'use client';

import { useState } from 'react';
import Link from 'next/link';
import RichTextEditor from './editor';
import './add-post.css';

export default function AddPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Post submitted:\nTitle: ${title}\nContent length: ${content.length} chars\n\nImages are embedded in the content.`);
  };

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
              <h3>Preview</h3>
              <div className="preview-content">
                {title && <h2 className="preview-title">{title}</h2>}
                {content ? (
                  <div 
                    className="preview-text"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p className="preview-placeholder">Your post preview will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Publish Post
          </button>
          <Link href="/profile" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
