'use client';

import Link from 'next/link';

export default function Register() {
  return (
    <div className="form-wrapper">
      <div className="card">
        <h1 className="page-title">Create Account</h1>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Registration submitted (placeholder)');
        }}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            Create Account
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          Already have an account? <Link href="/login" className="link">Login here</Link>
        </p>
      </div>
    </div>
  );
}
