import './Auth.css';
import { useEffect } from 'react';

const Auth = () => {
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  return (
    <div className="auth-container">
      <main className="auth-main">
        <div className="auth-bg-overlay">
          <div 
            className="auth-bg-img" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTnQNshG7opwvD1mZ_c7DxqOVF9xP889wsaDNpsxkskJ-c8x7SZNHiPmAJdUV4RAiBMsKhT6Ep0jUgsBLfCItpEdyGPjukBMY0swSVb9zO6Ew4A7XWDOHlSP21njtFG-cIDF9QgFq4KMhE6dhq3jDCsGaGneQ7xCF6pnpbo2E86r7N6j5Mj17l6pdtRMPmGapmXr1dr2pZ5ppRDYmDea4UQV8IL7w9Leu6RYTR0gpKxx0htnjN7Gvt5JZmQfieEeXbxp5AAlRg9Xc')" }}
          ></div>
          <div className="auth-gradient"></div>
        </div>

        <div className="auth-card-wrapper">
          <section className="login-section">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="auth-badge">Welcome Back</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.025em' }}>Login</h1>
              <p style={{ color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>Access your personalized dashboard.</p>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => { e.preventDefault(); alert('Connexion réussie !'); window.location.href = '/'; }}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">mail</span>
                  <input className="auth-input" placeholder="hello@vitabi.com" type="email" required />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <label className="input-label">Password</label>
                </div>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">lock</span>
                  <input className="auth-input" placeholder="••••••••" type="password" required />
                </div>
              </div>

              <button className="btn-auth-submit" type="submit">
                <span>Continue Training</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </section>

          <section className="signup-section">
            <div className="signup-content">
              <span className="signup-badge">New Here?</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>Start Your Journey To Peak Vitality.</h2>
            </div>

            <form className="signup-quick-form" onSubmit={(e) => { e.preventDefault(); alert('Inscription réussie !'); window.location.href = '/'; }}>
              <h3>Create Account</h3>
              <div className="quick-form-inputs">
                <input className="quick-input" placeholder="Full Name" type="text" required />
                <input className="quick-input" placeholder="Email Address" type="email" required />
                <button className="btn-unlock" type="submit">Unlock My Program</button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Auth;
