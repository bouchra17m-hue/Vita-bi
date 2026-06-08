import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TickerBar from './TickerBar';
import Footer from './Footer';
import './Home.css';
import { useToast } from './components/Toast';

const Home = () => {
  const toast = useToast();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal-on-scroll'));
    if (elements.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container" style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface)' }}>
      <TickerBar />
      
      <main>
        {/* SECTION 1: REFINED HERO (Minimized & On-Palette) */}
        <section className="hero-premium">
          {/* Background Video (place your file in /public/fitness-hero.mp4) */}
          <video
            className="hero-premium-video hero-premium-video--blur"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/fitness-hero.mp4" type="video/mp4" />
          </video>

          <video
            className="hero-premium-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/fitness-hero.mp4" type="video/mp4" />
          </video>

          <div className="container hero-premium-container">
            <div className="hero-premium-copy" style={{ maxWidth: '45rem' }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '0.4rem 1.2rem', 
                backgroundColor: 'var(--primary-fixed)', 
                borderRadius: '99px', 
                color: 'var(--on-primary-fixed-variant)', 
                fontWeight: 800, 
                fontSize: '0.75rem',
                letterSpacing: '1px',
                marginBottom: '1.5rem',
                textTransform: 'uppercase'
              }}>
                Performance Élite
              </div>
              <h1 style={{ 
                fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
                lineHeight: 1, 
                fontWeight: 950, 
                letterSpacing: '-0.04em', 
                marginBottom: '1.5rem',
                color: 'var(--surface)'
              }}>
                Dépassez <br/>
                <span style={{ 
                  color: 'var(--primary)', 
                  fontStyle: 'italic'
                }}>Vos Limites.</span>
              </h1>
              <p style={{ 
                fontSize: '1.125rem', 
                color: 'var(--surface)', 
                maxWidth: '30rem', 
                marginBottom: '2.5rem', 
                lineHeight: 1.5,
                fontWeight: 500,
                opacity: 0.9
              }}>
                L'alliance parfaite entre science nutritionnelle, équipement de pointe et technologie intelligente.
              </p>
              <div className="flex gap-4">
                <Link to="/shop" className="btn btn-primary" style={{ padding: '1.125rem 3rem', fontSize: '1rem' }}>DECOUVRIR LE SHOP</Link>
                <Link to="/calculator" className="btn" style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid var(--outline-variant)', 
                  color: 'var(--secondary)', 
                  padding: '1.125rem 3rem', 
                  fontSize: '1rem'
                }}>
                  CALCULATEUR
                </Link>
              </div>
            </div>
          </div>

          {/* Side Stats - Compact & Theme Matching */}
          <div className="hero-premium-stats">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6 }}>MEMBRES</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>12.4k</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--outline-variant)' }}></div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6 }}>SATISFACTION</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--secondary)' }}>98%</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE ECOSYSTEM (Premium Cards) */}
        <section className="ecosystem-premium">
          <div className="container">
            <div className="ecosystem-header reveal-on-scroll">
              <h2 className="ecosystem-title">
                L'ÉCOSYSTÈME <span>VITABI</span>
              </h2>
              <p className="ecosystem-subtitle">
                Un écosystème complet pour performer: équipement, nutrition, analyse et coaching.
              </p>
            </div>

            <div className="ecosystem-grid">
              <Link
                to="/shop"
                className="premium-card reveal-on-scroll"
                style={{
                  '--accent': 'var(--primary)',
                  '--bg':
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_MBoDSs5ICKeSho3zWAxEb0cVFGPGdMN1XlVP28aVkbKxFJNca1zGGpjQRZ-HwW3CLEfmHIrEyOK7qllnO7g86XqxTLWJ1i3EKJaCze4PRzEecrShSgUBl0Uy6UxHpjRtehbk0ORQFGbK8AhF4H2i3sjuWhfkFMMi17d3ftqPiJpCXQpHEF6mQxeGd_XBT_nmmzpdiq0oPMQY27j0HJUmmApkFPshvCFqXEC6iZpDqv-9QuRak3FbTzSjZlpj4snmTs-xNQCSpok')",
                }}
              >
                <div className="premium-card__media" />
                <div className="premium-card__overlay" />
                <div className="premium-card__content">
                  <div className="premium-card__icon">
                    <span className="material-symbols-outlined">shopping_bag</span>
                  </div>
                  <h3>Shop</h3>
                  <p>Équipement premium et accessoires de performance.</p>
                  <div className="premium-card__cta">Découvrir ?</div>
                </div>
              </Link>

              <Link
                to="/nutrition"
                className="premium-card reveal-on-scroll"
                style={{
                  '--accent': 'var(--secondary)',
                  '--bg':
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4pxqcx8eWi3lf0MDo8wRYyjzbW6PzcPpup9-FlTDkJCu1E-2cRGh4L_Ypc_8tC4ooN3y1cVqXLTg9P0K_7usIhn8FZYuGitHi-mo_lZ7GOiviBVLGSQIARQB36sjR5SS2H_j6d0uhz225d28uJzjt4wofPrfsrf8GEUoscvw752Sayz4MAn5p9wRNPz6nsKxCXe02UCKb7XEvs26nlBdJaNg_Y-GFpDTY3Gk07yhnhQQUuCTekIKbf_EipcJ10CDAYMYRqGDCAzY')",
                }}
              >
                <div className="premium-card__media" />
                <div className="premium-card__overlay" />
                <div className="premium-card__content">
                  <div className="premium-card__icon">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <h3>Nutrition</h3>
                  <p>Plans, recettes et guidance pour atteindre vos objectifs.</p>
                  <div className="premium-card__cta">Explorer ?</div>
                </div>
              </Link>

              <Link
                to="/calculator"
                className="premium-card reveal-on-scroll"
                style={{
                  '--accent': 'var(--tertiary)',
                  '--bg': url(),
                }}
              >
                <div className="premium-card__media" />
                <div className="premium-card__overlay" />
                <div className="premium-card__content">
                  <div className="premium-card__icon">
                    <span className="material-symbols-outlined">calculate</span>
                  </div>
                  <h3>Calculateur</h3>
                  <p>Macros, calories et suivi: précis, simple, efficace.</p>
                  <div className="premium-card__cta">Lancer ?</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: CTA (Glassmorphism) */}
        <section className="cta-premium">
          <div className="container">
            <div className="cta-glass reveal-on-scroll">
              <div className="cta-copy">
                <h3>Rejoignez la révolution fitness.</h3>
                <p>Débloquez une expérience premium: routines, nutrition et coaching.</p>
              </div>
              <div className="cta-metrics">
                <div className="cta-metric">
                  <div className="cta-metric__value">50k+</div>
                  <div className="cta-metric__label">Produits vendus</div>
                </div>
                <div className="cta-metric">
                  <div className="cta-metric__value">1M+</div>
                  <div className="cta-metric__label">Calories brûlées</div>
                </div>
              </div>
              <Link to="/login" className="btn btn-primary cta-btn">
                Rejoindre
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter newsletter-premium">
          <div className="newsletter-box newsletter-box--center reveal-on-scroll" style={{ background: 'var(--on-surface)' }}>
            <div className="newsletter-copy">
              <h2>Prêt à briller ?</h2>
              <p>Inscrivez-vous pour nos offres flash.</p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                toast.showSuccess("Merci de votre inscription !");
              }}
            >
              <input className="newsletter-input" placeholder="votre@email.com" type="email" required />
              <button className="btn btn-primary newsletter-glow" type="submit">
                S'abonner
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

