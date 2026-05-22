import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../useCart';
import { useAuth } from '../AuthContext';
import PaymentModal from './PaymentModal';

const Navbar = () => {
  const { cartItems, setIsCartOpen, removeFromCart, updateQuantity, clearCart, isCartOpen, cartCount } = useCart();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const totalCart = cartItems.reduce((acc, item) => acc + ((parseFloat(item.price) || 0) * (item.quantity || 1)), 0).toFixed(2);

  const handleCheckout = () => {
    if (!user) {
      alert('Veuillez vous connecter pour commander !');
      setIsCartOpen(false);
      navigate('/login');
      return;
    }

    // Fermer le tiroir du panier et ouvrir la modale de paiement sécurisé
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  return (
    <>
      <nav className="navbar navbar--premium">
        <div className="navbar-inner container">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <img 
              alt="VitaBi Logo" 
              style={{ height: '2.75rem', width: '2.75rem', objectFit: 'contain' }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrs28-_176LELqX5sbVB1eZ6e3sJWrJjEg4KnbN6eetvTbl9kQxdPxcG4JcqGGeajC_wOmKQaf4migOIWpy4wecQSj5kSDyTgQ5iDLKrVyNvAZ8oRULW6j1D4qzc1xi6_KwnazCwqVdDPZSfbZ5d2wnQSx2kW5YJZMZ9uc2p_Ucgzh_I-cJ-OIOonBK34y4CFw3TTaibZN7mJRJRcV-XMSPsNGJjT-45J55TO8L9PLq1pZE8xWwhiFq3LB7xe7xr4xqrQQFqRB7aM"
            />
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', fontStyle: 'italic' }}>VitaBi</span>
          </Link>

          <div className="nav-links">
            <NavLink className="nav-link" to="/shop" end>
            Boutique

            </NavLink>
            <NavLink className="nav-link" to="/nutrition" end>
            Nutrition

            </NavLink>
            <NavLink className="nav-link" to="/calculator" end>
            Calculateur

            </NavLink>
            <NavLink className="nav-link" to="/about" end>
            À propos

            </NavLink>
            {user?.is_admin && (
              <NavLink className="nav-link" to="/admin" end>
              Admin

              </NavLink>
            )}
          </div>

          <div className="navbar-actions">
            <button className="navbar-cart" type="button" onClick={() => setIsCartOpen(true)} aria-label="Ouvrir le panier">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }} className="font-bold text-sm hidden md:inline-block hover:underline">Salut, {user.name}</Link>
                <button onClick={logout} className="btn" style={{ border: '1px solid var(--outline)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '14px' }}>Déconnexion</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary navbar-signup">Sign Up</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setIsCartOpen(false)}></div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px', backgroundColor: 'white', height: '100%', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div className="flex justify-between items-center mb-8">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Mon Panier ({cartCount})</h2>
              <button className="btn" onClick={() => setIsCartOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '2rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginTop: '4rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.2 }}>shopping_basket</span>
                  <p>Votre panier est vide.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cartItems.map((item) => (
                    <div key={item.cartId} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--surface-container-low)', borderRadius: '16px' }}>
                      <img src={item.img} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '8px' }} />
                      <div style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '0.2rem' }}>{item.label || item.category}</span>
                        <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '0.25rem' }}>{item.name}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>{item.price}€ x {item.quantity || 1}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button className="btn" style={{ width: '2rem', height: '2rem', padding: 0, borderRadius: '50%', backgroundColor: 'white', border: '1px solid var(--outline-variant)' }} onClick={() => updateQuantity(item.cartId, -1)} aria-label={`Retirer un ${item.name}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>remove</span>
                          </button>
                          <strong style={{ minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity || 1}</strong>
                          <button className="btn" style={{ width: '2rem', height: '2rem', padding: 0, borderRadius: '50%', backgroundColor: 'white', border: '1px solid var(--outline-variant)' }} onClick={() => updateQuantity(item.cartId, 1)} aria-label={`Ajouter un ${item.name}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
                          </button>
                        </div>
                        <p style={{ fontWeight: 900, color: 'var(--primary)', marginTop: '0.5rem' }}>Sous-total: {((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}€</p>
                      </div>
                      <button className="btn" style={{ color: 'var(--error)', padding: '0.5rem' }} onClick={() => removeFromCart(item.cartId)} aria-label={`Supprimer ${item.name}`}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '2rem' }}>
                <div className="flex justify-between items-center mb-4">
                  <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--on-surface)' }}>{totalCart}€</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '9999px', fontWeight: 700 }} onClick={handleCheckout}>Commander</button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {isPaymentOpen && (
        <PaymentModal 
          isOpen={isPaymentOpen} 
          onClose={() => setIsPaymentOpen(false)} 
          totalAmount={totalCart} 
        />
      )}
    </>
  );
};

export default Navbar;
