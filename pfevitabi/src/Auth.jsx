import './Auth.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { login, register } from './api';

const Auth = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(loginData.email, loginData.password);
      authLogin(response.access_token, response.user);
      // Small delay to ensure localStorage is written
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await register(registerData.name, registerData.email, registerData.password, registerData.password_confirmation);
      authLogin(response.access_token, response.user);
      // Small delay to ensure localStorage is written
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleLogin}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">mail</span>
                  <input 
                    className="auth-input" 
                    placeholder="hello@vitabi.com" 
                    type="email" 
                    required 
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                  <label className="input-label">Password</label>
                </div>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">lock</span>
                  <input 
                    className="auth-input" 
                    placeholder="••••••••" 
                    type="password" 
                    required 
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              <button className="btn-auth-submit" type="submit" disabled={loading}>
                <span>{loading ? 'Connecting...' : 'Continue Training'}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </section>

          <section className="signup-section">
            <div className="signup-content">
              <span className="signup-badge">New Here?</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>Start Your Journey To Peak Vitality.</h2>
              <ul className="feature-list">
                <li className="feature-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  Personalized nutrition plans
                </li>
                <li className="feature-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  AI-powered coaching
                </li>
                <li className="feature-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  Progress tracking dashboard
                </li>
              </ul>
            </div>

            <form className="signup-quick-form" onSubmit={handleRegister}>
              <h3>Create Account</h3>
              <div className="quick-form-inputs">
                <input 
                  className="quick-input" 
                  placeholder="Full Name" 
                  type="text" 
                  required 
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  disabled={loading}
                />
                <input 
                  className="quick-input" 
                  placeholder="Email Address" 
                  type="email" 
                  required 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  disabled={loading}
                />
                <input 
                  className="quick-input" 
                  placeholder="Password" 
                  type="password" 
                  required 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  disabled={loading}
                />
                <input 
                  className="quick-input" 
                  placeholder="Confirm Password" 
                  type="password" 
                  required 
                  value={registerData.password_confirmation}
                  onChange={(e) => setRegisterData({...registerData, password_confirmation: e.target.value})}
                  disabled={loading}
                />
                <button className="btn-unlock" type="submit" disabled={loading}>Unlock My Program</button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Auth;