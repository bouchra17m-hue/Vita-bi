import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminDashboard } from './api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    getAdminDashboard(token)
      .then((data) => setDashboard(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (!token) return null;

  if (loading) {
    return (
      <main className="admin-dashboard container">
        <section className="admin-locked">
          <span className="material-symbols-outlined">hourglass_top</span>
          <h1>Chargement du tableau de bord</h1>
        </section>
      </main>
    );
  }

  if (!user?.is_admin) {
    return (
      <main className="admin-dashboard container">
        <section className="admin-locked">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <h1>Accès admin requis</h1>
          <p>Votre compte est connecté mais il n a pas les droits administrateur.</p>
          <Link className="btn btn-primary" to="/shop">Retour boutique</Link>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard container">
        <section className="admin-locked">
          <span className="material-symbols-outlined">error</span>
          <h1>Erreur</h1>
          <p>{error}</p>
          <Link className="btn btn-primary" to="/admin">Recharger</Link>
        </section>
      </main>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <main className="admin-dashboard container">
      <section className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <div>
            <span className="admin-eyebrow">Back office</span>
            <h1>Tableau de bord</h1>
            <p>Vue d ensemble de votre boutique</p>
          </div>
          <div className="admin-user">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <strong>{user?.name || 'Admin'}</strong>
          </div>
        </div>

        <section className="admin-dashboard-links">
          <Link to="/admin" className="admin-dash-link">
            <span className="material-symbols-outlined">inventory_2</span>
            Produits
          </Link>
          <Link to="/admin/orders" className="admin-dash-link secondary">
            <span className="material-symbols-outlined">receipt_long</span>
            Commandes
          </Link>
        </section>

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="material-symbols-outlined">shopping_bag</span>
            <div>
              <span>Produits</span>
              <strong>{stats.product_count ?? '-'}</strong>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="material-symbols-outlined">receipt_long</span>
            <div>
              <span>Commandes</span>
              <strong>{stats.order_count ?? '-'}</strong>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="material-symbols-outlined">payments</span>
            <div>
              <span>Revenu total</span>
              <strong>{Number(stats.total_revenue ?? 0).toFixed(2)} €</strong>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="material-symbols-outlined">person</span>
            <div>
              <span>Utilisateurs</span>
              <strong>{stats.user_count ?? '-'}</strong>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="material-symbols-outlined">warning</span>
            <div>
              <span>Stock faible</span>
              <strong>{stats.Low_stock ?? '-'}</strong>
            </div>
          </div>
        </section>

        <section className="admin-dashboard-tables">
          <section className="admin-table-wrap">
            <div className="admin-table-head">
              <h2>Dernières commandes</h2>
              <Link to="/admin/orders" className="btn admin-refresh">
                Voir tout
              </Link>
            </div>
            {Array.isArray(dashboard?.recent_orders) && dashboard.recent_orders.length > 0 ? (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Étiquette</th>
                      <th>Total</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recent_orders.map((order) => (
                      <tr key={order.id}>
                        <td>Commande #{order.id}</td>
                        <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{Number(order.total).toFixed(2)} €</td>
                        <td>
                          <span className={`stock-pill ${order.status === 'completed' ? '' : 'low'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="admin-loading">Aucune commande récente</p>
            )}
          </section>
        </section>
      </section>
    </main>
  );
};

export default AdminDashboard;
