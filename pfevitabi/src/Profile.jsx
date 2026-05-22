import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders } from './api';

const Profile = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    getOrders(token)
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des commandes:", err);
        setLoading(false);
      });
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-on-surface flex items-center justify-center">
        <p className="text-xl">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <main className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '1rem' }}>Mon Profil</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem' }}>Gérez vos informations et consultez votre historique d'achats.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* User Details */}
          <div className="white-card" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-container-low)' }}>
            <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--primary)' }}>Mes Informations</h2>
            <div className="flex flex-col gap-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nom complet</span>
                <span className="text-lg font-bold">{user?.name}</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Adresse email</span>
                <span className="text-lg font-bold">{user?.email}</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Membre depuis le</span>
                <span className="text-lg font-bold">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div className="white-card" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-container-low)', gridColumn: 'span 2' }}>
            <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--primary)' }}>Historique des Commandes</h2>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.2 }}>shopping_bag</span>
                <p className="mt-2">Vous n'avez pas encore passé de commande.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map(order => (
                  <div key={order.id} style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1.5rem' }}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-bold text-lg">Commande #{order.id}</span>
                        <span className="block text-xs text-on-surface-variant">{new Date(order.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-xl text-primary">{order.total_amount}€</span>
                        <span className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--secondary)' }}>{order.status}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                      {order.items?.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm" style={{ padding: '0.5rem 1rem', backgroundColor: 'white', borderRadius: '8px' }}>
                          <span>{item.product?.name} <span className="text-on-surface-variant font-bold">x{item.quantity}</span></span>
                          <span className="font-bold">{item.price}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
