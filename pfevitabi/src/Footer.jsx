import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ style }) => {
  return (
    <footer className="footer-premium" style={style}>
      <div className="container footer-premium-container">
        <div className="footer-premium-brand">
          <span className="footer-brand-logo">VITABI</span>
          <p className="footer-brand-tagline">
            L'alliance parfaite entre science nutritionnelle, équipement de pointe et technologie intelligente pour dépasser vos limites.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a href="#" className="social-icon">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a href="#" className="social-icon">
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>

        <div className="footer-premium-links">
          <div className="footer-links-group">
            <h4>Écosystème</h4>
            <Link to="/about" className="footer-link">À propos</Link>
            <Link to="/shop" className="footer-link">Shop Équipement</Link>
            <Link to="/nutrition" className="footer-link">Nutrition & Plans</Link>
            <Link to="/calculator" className="footer-link">Calculateur Macros</Link>
          </div>

          <div className="footer-links-group">
            <h4>Ressources</h4>
            <Link to="/blog" className="footer-link">Blog</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/faq" className="footer-link">Centre d'aide</Link>
          </div>

          <div className="footer-links-group">
            <h4>Légal</h4>
            <Link to="/confidentialite" className="footer-link">Confidentialité</Link>
            <Link to="/cgu" className="footer-link">CGU</Link>
            <Link to="/mentions-legales" className="footer-link">Mentions Légales</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-premium-bottom">
        <div className="container bottom-container flex justify-between items-center">
          <p>© {new Date().getFullYear()} VitaBi. Fuel your vibrancy.</p>
          <p>
            Designed for performance <span className="material-symbols-outlined" style={{fontSize:'1rem', verticalAlign:'middle', color:'var(--primary)'}}>bolt</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
