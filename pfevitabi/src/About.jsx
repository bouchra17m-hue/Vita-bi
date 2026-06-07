import { Link } from 'react-router-dom';
import './About.css';
import Footer from './Footer';

const founderImageFallbacks = {
  ihsan:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvTQszKznsi-lWZqhIX5uJg5NJvgolXg5TBIg3t1SeABWuMRYK5CMa34MLsLD_rX6ybuU98WxEXfqpMonIz1bYGX1z2Z__z44FxpxVgrdrwVeoeUHnobAzl2cOzWatYUcRqfZmf6eL2FkPoWscsuUh8RIZktN6SMC6Rhe4ouenqxiZ5L1-uGWejxZzg3YwYO_1YtsnNaO0CuR3IfxZax6DMdOJAsEEAxnIlBkzGHscOa03NYt_uXvYXHqsNfd_ZbFDxxIOrJYuJ9A',
  bouchra:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzJr2OFQ9zPnsIumwpCJtJlN6lm4ue_0s-OfzuQ1Sx7vpgx0EvnIqKaQbY42C9ZDa5poSKR5JuD7DRd80IAF2PRyfhm_SPrz2icoCCnhImr3sNflSu5I75QbxQEZs3JHcluV50BVAcblITtpCTmni7krLaW-XrDOKeinxsy_MG_BjT4Mh-XbjcqdujYvYfKcB60gQBvgI6CRYQuFgDajObhiBQoNMbVLhh1VHVOdbuzFzufRtQhyBO-HWZNiucsBKr6HPGmx56abs',
};

const About = () => {
  return (
    <div className="home-container about-page" style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface)' }}>
      <main>
        <section className="about-hero">
          <div className="about-hero-glow about-hero-glow--one"></div>
          <div className="about-hero-glow about-hero-glow--two"></div>
          <div className="container about-hero-content">
            <div>
              <span className="about-badge">A propos de VitaBi</span>
              <h1 className="about-title">
                Transformez vos
                <span> donnees en resultats.</span>
              </h1>
              <p className="about-lead">
                Nous aidons chaque utilisateur a atteindre un objectif clair: perte de poids,
                prise de masse ou remise en forme, grace a des programmes personnalises.
              </p>
              <p className="about-sublead">
                Chaque plan s'appuie sur vos donnees reelles: age, poids, taille et objectif.
              </p>
              <div className="about-hero-actions">
                <Link to="/calculator" className="btn btn-primary">Commencer mon programme</Link>
                <Link to="/shop" className="btn about-btn-secondary">Voir le shop</Link>
              </div>
            </div>

            <div className="about-hero-visual">
              <div className="about-hero-image-wrap">
                <img
                  className="about-hero-image"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbkUF9IE0TMhsbnonMJcrgc-AeKfuFpNG68i4906qLZRPd-CPV4sb2yQI_r8kMkZKmooQPrmDVWYCxihenseOUrJ66YrV8h5LA2NxmhXhCQFna7oLSUVuUnY7zUV0ZmP9xhMUDMyuDPudvCi3gOuW9UbbF10bvp3AvujU2zzKAltGcHM4xdAzCXJDaXVJe3o4JMRE_6skZfLvCqDk6FFmrrPTzgBpbq73N1NfQWiOmmOTn-njJbh4SCLQsnSLjL4kjjLr7HM7B6qw"
                  alt="Communaute VitaBi"
                />
              </div>
              <div className="about-floating-card">
                <span className="material-symbols-outlined">insights</span>
                <div>
                  <div>Plans personnalises</div>
                  <small>Base sur votre profil</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-section-head">
              <h2>Notre mission et notre vision</h2>
              <p>Un fitness plus intelligent, plus simple et plus motivant.</p>
            </div>
            <div className="about-two-col">
              <article className="about-card">
                <h3>Mission</h3>
                <p>
                  Rendre le fitness personnalise clair et accessible. Chaque utilisateur recoit un
                  plan adapte a son objectif et a son rythme.
                </p>
              </article>
              <article className="about-card">
                <h3>Vision</h3>
                <p>
                  Transformer le progres en routine quotidienne avec une methode structuree:
                  moins d'improvisation, plus de constance, plus de resultats.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-section about-section-alt">
          <div className="container">
            <div className="about-section-head">
              <h2>Pourquoi nous choisir</h2>
              <p>Un cadre premium, simple a suivre et centre sur vos objectifs.</p>
            </div>
            <div className="about-grid-3">
              {[
                {
                  icon: 'tune',
                  title: 'Personnalisation reelle',
                  text: "Vos donnees guident vos recommandations fitness et nutrition.",
                },
                {
                  icon: 'route',
                  title: 'Methode claire',
                  text: 'Un plan structure en etapes, facile a appliquer chaque semaine.',
                },
                {
                  icon: 'trending_up',
                  title: 'Progression durable',
                  text: 'Des objectifs concrets pour rester motive et regulier.',
                },
              ].map((item) => (
                <article key={item.title} className="about-card about-card-icon">
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-section-head">
              <h2>Notre methode</h2>
              <p>3 etapes pour transformer vos objectifs en actions.</p>
            </div>
            <div className="about-steps">
              {[
                {
                  step: '01',
                  title: 'Evaluer',
                  text: 'Age, poids, taille et objectif pour construire une base precise.',
                },
                {
                  step: '02',
                  title: 'Generer',
                  text: 'Un programme adapte pour perte de poids, prise de masse ou remise en forme.',
                },
                {
                  step: '03',
                  title: 'Progresser',
                  text: 'Vous suivez un cadre clair pour avancer avec regularite.',
                },
              ].map((item) => (
                <article key={item.step} className="about-step-card">
                  <span>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section about-section-alt">
          <div className="container">
            <div className="about-section-head">
              <h2>Resultats attendus</h2>
              <p>Des progres visibles, mesurables et durables.</p>
            </div>
            <div className="about-grid-3">
              {[
                {
                  title: 'Direction claire',
                  text: 'Un plan de training et nutrition aligne sur votre objectif.',
                },
                {
                  title: 'Plus d energie',
                  text: 'Une routine equilibree pour mieux performer au quotidien.',
                },
                {
                  title: 'Constance',
                  text: 'Moins d hesitations, plus d actions utiles chaque semaine.',
                },
              ].map((item) => (
                <article key={item.title} className="about-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-section-head">
              <h2>L equipe fondatrice</h2>
              <p>Construit par des femmes engagees dans votre progression.</p>
            </div>
            <div className="about-founders">
              <div className="about-founder-card">
                <div className="about-founder-image">
                  <img
                    src="/ihsane image.png"
                    alt="Ihsan Motich"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = founderImageFallbacks.ihsan;
                    }}
                  />
                </div>
                <div>
                  <h3>Ihsan Motich</h3>
                  <p className="about-founder-role">Co-fondatrice</p>
                  <p>"Ma mission est de rendre la nutrition scientifique accessible et efficace pour chaque femme."</p>
                </div>
              </div>

              <div className="about-founder-card">
                <div className="about-founder-image">
                  <img
                    src="/bouchra image.png"
                    alt="Bouchra Baidouch"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = founderImageFallbacks.bouchra;
                    }}
                  />
                </div>
                <div>
                  <h3>Bouchra Baidouch</h3>
                  <p className="about-founder-role">Co-fondatrice</p>
                  <p>"Le mouvement revele votre force. Notre role est de vous aider a la developper, un jour a la fois."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-final-cta">
          <div className="container">
            <div className="about-cta-box">
              <h2>Votre transformation commence maintenant.</h2>
              <p>Passez d'un objectif flou a un plan precis, motivant et personnalise.</p>
              <Link to="/calculator" className="btn btn-primary">Rejoindre maintenant</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
