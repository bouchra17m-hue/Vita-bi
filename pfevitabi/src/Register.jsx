import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from './api';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiRegister(name, email, password, password);
      login(data.access_token, data.user);
      navigate('/shop');
    } catch (err) {
      setError(err.message || 'Erreur lors de l’inscription. Veuillez réessayer.');
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

        <div className="auth-card-wrapper" style={{ maxWidth: '500px', display: 'block' }}>
          <section className="login-section">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="auth-badge">New Here?</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.025em', margin: 0 }}>Créer un compte</h1>
              <p style={{ color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>Rejoignez VitaBi et commencez votre programme.</p>
            </div>

            {error && (
              <div style={{ 
                backgroundColor: 'rgba(219, 68, 85, 0.1)', 
                color: 'var(--error)', 
                padding: '1rem', 
                borderRadius: '1rem', 
                marginBottom: '1.5rem', 
                textAlign: 'center', 
                fontWeight: 'bold',
                border: '1px solid var(--error)'
              }}>
                {error}
              </div>
            )}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Nom complet</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">person</span>
                  <input 
                    className="auth-input" 
                    placeholder="Jean Dupont" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">mail</span>
                  <input 
                    className="auth-input" 
                    placeholder="hello@vitabi.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined">lock</span>
                  <input 
                    className="auth-input" 
                    placeholder="••••••••" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength="8"
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>8 caractères minimum</span>
              </div>

              <button className="btn-auth-submit" type="submit">
                <span>S'inscrire</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
              Déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Connectez-vous</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Register;
