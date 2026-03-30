'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../AuthContext';

// Mock post data
const mockPosts = {
  1: {
    id: 1,
    title: 'A Walk Through Autumn Memories',
    author: 'Sarah Mitchell',
    date: 'February 24, 2026',
    content: `The golden leaves crunched beneath my feet as I walked through the park near my childhood home. It had been five years since I last visited this place, and I was surprised at how little had changed, yet everything felt different to me now.

I remembered running through these very paths as a kid, carefree and lost in imagination. Today, I found myself reflecting on all the changes that had happened in those five years. A new job, a move across the country, failed relationships, and ultimately, a journey back to myself.

The autumn air carried familiar scents—earth, rain, and the sweetness of fallen apples. I sat on the old wooden bench by the creek and just... existed. No phone, no worries, just me and the quiet beauty of nature reminding me that some things, like these trees and this park, remain constant even as we change.

Sometimes we need to return to our roots to remember who we are.`,
    image: '[Image would display here]',
    likes: 234,
    comments: [
      { id: 1, author: 'John Doe', date: 'February 24, 2026', text: 'Beautiful reflection. This resonates deeply with me.' },
      { id: 2, author: 'Emily Chen', date: 'February 25, 2026', text: 'The part about returning to our roots really hit home. Thank you for sharing.' },
    ]
  },
  2: {
    id: 2,
    title: 'Why I Chose to Learn Coding Later in Life',
    author: 'Michael Torres',
    date: 'February 20, 2026',
    content: `At 42, I decided to learn how to code. My friends thought I was crazy. My family was skeptical. But I was determined.

For years, I'd been stuck in a job that didn't fulfill me. I'd always been curious about technology, but I believed the myth that programming was only for young people who'd been coding since childhood. That belief held me back for far too long.

Then one day, I just started. I found an online course, bought a cheap laptop, and began learning JavaScript. The first month was frustrating. The second month was still tough. But by the third month, something clicked. I understood the logic. I could see how code solves real problems.

Today, six months later, I'm finishing my bootcamp and already fielding job offers. But more importantly, I've learned that it's never too late to change direction, to learn something new, to become whoever you want to be.

If you're thinking about making a change but scared because of your age, your background, or your circumstances—don't let fear decide your future. Start today.`,
    image: '[Image would display here]',
    likes: 456,
    comments: [
      { id: 1, author: 'Lisa Wong', date: 'February 21, 2026', text: 'This is so inspiring! I\'m 39 and was worried it was too late. Thank you!' },
    ]
  },
  3: {
    id: 3,
    title: 'Reflections on My First Book',
    author: 'Amanda Price',
    date: 'February 15, 2026',
    content: `I'm holding my first published book in my hands, and I still can't believe it's real.

It took me three years to write it. Three years of early mornings before work, late nights after the kids went to bed, weekends spent at coffee shops with my laptop. There were countless moments when I wanted to give up—when I thought nobody would want to read what I had to say, when the rejections from publishers piled up, when self-doubt whispered that I wasn't a "real" writer.

But I kept going. I revised chapter after chapter. I joined a writing group where other aspiring authors encouraged me. I went to writing conferences. I submitted to publishers again and again until one finally said yes.

Holding this physical proof of my work feels surreal. The cover is beautiful. The pages smell like possibility. Inside are my words, my stories, my heart.

To anyone working on a creative project right now: keep going. Your voice matters. Your stories matter. The world needs what only you can create.`,
    image: '[Image would display here]',
    likes: 189,
    comments: [
      { id: 1, author: 'Robert Kim', date: 'February 16, 2026', text: 'Congratulations on the book! This is huge!' },
      { id: 2, author: 'Maya Patel', date: 'February 16, 2026', text: 'Your persistence is inspiring. I can\'t wait to read it!' },
      { id: 3, author: 'David Brown', date: 'February 17, 2026', text: 'Where can I buy your book? I want to support you!' },
    ]
  }
};

export default function PostDetail({ params }) {
  const postId = parseInt(params.id, 10);
  const post = mockPosts[postId];
  const { user } = useAuth();
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);

  if (!post) {
    return (
      <div className="form-wrapper">
        <div className="card">
          <h1>Post not found</h1>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    );
  }

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment = {
      id: comments.length + 1,
      author: user.email,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      text: newComment,
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setHasLiked(!hasLiked);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#3498db', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to stories
      </Link>

      <article className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '1rem', lineHeight: '1.4' }}>{post.title}</h1>
        
        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', marginBottom: '0.25rem' }}>By <strong>{post.author}</strong></p>
          <p style={{ color: '#999', fontSize: '0.875rem' }}>Posted on {post.date}</p>
        </div>

        {post.image && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '2rem', marginBottom: '1.5rem', borderRadius: '6px', textAlign: 'center', color: '#999' }}>
            {post.image}
          </div>
        )}

        <div style={{ color: '#333', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button
            onClick={handleLike}
            className={`btn ${hasLiked ? '' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {hasLiked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
          <span style={{ color: '#666' }}>💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
        </div>
      </article>

      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #ddd' }}>
            <div className="form-group">
              <label htmlFor="comment">Add a comment</label>
              <textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ minHeight: '100px' }}
              />
            </div>
            <button type="submit" className="btn" disabled={!newComment.trim()}>
              Post Comment
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
            <p><Link href="/login" className="link">Log in</Link> to comment</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#2c3e50' }}>{comment.author}</strong>
                  <span style={{ color: '#999', fontSize: '0.875rem' }}>{comment.date}</span>
                </div>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
