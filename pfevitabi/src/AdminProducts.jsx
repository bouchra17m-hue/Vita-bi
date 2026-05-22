import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminProducts.css';

const API_URL = 'http://127.0.0.1:8000/api/products';

const emptyForm = {
  name: '',
  category: 'vêtements femme',
  price: '',
  label: 'Apparel',
  badge: '',
  img: '',
  stock: '',
};

const notifyProductsUpdated = () => {
  localStorage.setItem('vitabi-products-updated', String(Date.now()));
  window.dispatchEvent(new Event('vitabi-products-updated'));
};

const AdminProducts = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const totalStock = useMemo(
    () => products.reduce((total, product) => total + (Number(product.stock) || 0), 0),
    [products],
  );

  const lowStockCount = useMemo(
    () => products.filter((product) => (Number(product.stock) || 0) <= 5).length,
    [products],
  );

  const fetchProducts = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger les produits. Vérifiez le backend Laravel.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setMessage('');
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      category: product.category || 'vêtements femme',
      price: product.price || '',
      label: product.label || '',
      badge: product.badge || '',
      img: product.img || '',
      stock: product.stock ?? '',
    });
    setMessage('');
    setError('');
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    if (!token) {
      setError('Connectez-vous avant de gérer les produits.');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      badge: form.badge.trim() || null,
    };

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('La sauvegarde a échoué.');
      }

      setMessage(editingId ? 'Produit modifié avec succès.' : 'Produit ajouté avec succès. Il est maintenant visible dans la boutique.');
      resetForm();
      notifyProductsUpdated();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!token) {
      setError('Connectez-vous avant de supprimer un produit.');
      return;
    }

    const confirmed = window.confirm(`Supprimer "${product.name}" ?`);
    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/${product.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('La suppression a échoué.');
      }

      setMessage('Produit supprimé avec succès.');
      notifyProductsUpdated();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <main className="admin-page container">
        <section className="admin-locked">
          <span className="material-symbols-outlined">lock</span>
          <h1>Admin produits</h1>
          <p>Connectez-vous pour ajouter, modifier, supprimer et gérer le stock des produits.</p>
          <Link className="btn btn-primary" to="/login">Se connecter</Link>
        </section>
      </main>
    );
  }

  if (!user?.is_admin) {
    return (
      <main className="admin-page container">
        <section className="admin-locked">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <h1>Accès admin requis</h1>
          <p>Votre compte est connecté, mais il n'a pas encore les droits administrateur.</p>
          <Link className="btn btn-primary" to="/shop">Retour boutique</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page container">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">Back office</span>
          <h1>Gestion des produits</h1>
          <p>Ajoutez, modifiez, supprimez et suivez le stock de la boutique VitaBi.</p>
        </div>
        <div className="admin-user">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <strong>{user?.name || 'Admin'}</strong>
        </div>
      </header>

      <section className="admin-stats">
        <div>
          <span>Produits</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Stock total</span>
          <strong>{totalStock}</strong>
        </div>
        <div>
          <span>Stock faible</span>
          <strong>{lowStockCount}</strong>
        </div>
      </section>

      {(message || error) && (
        <div className={`admin-alert ${error ? 'error' : 'success'}`}>
          <span>{error || message}</span>
          {!error && <Link to="/shop">Voir la boutique</Link>}
        </div>
      )}

      <section className="admin-layout">
        <form className="admin-form" onSubmit={submitProduct}>
          <div className="admin-form-head">
            <h2>{editingId ? 'Modifier produit' : 'Ajouter produit'}</h2>
            {editingId && (
              <button className="btn admin-clear" type="button" onClick={resetForm}>
                <span className="material-symbols-outlined">close</span>
                Annuler
              </button>
            )}
          </div>

          <label>
            Nom
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </label>

          <div className="admin-form-grid">
            <label>
              Catégorie
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)} required>
                <option value="vêtements femme">Vêtements femme</option>
                <option value="protéines">Protéines</option>
                <option value="matériels">Matériels</option>
              </select>
            </label>
            <label>
              Label
              <input value={form.label} onChange={(e) => updateField('label', e.target.value)} required />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Prix (€)
              <input min="0" step="0.01" type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
            </label>
            <label>
              Stock
              <input min="0" type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} required />
            </label>
          </div>

          <label>
            Badge
            <input value={form.badge} onChange={(e) => updateField('badge', e.target.value)} placeholder="Nouveau, Best Seller..." />
          </label>

          <label>
            Image URL
            <textarea value={form.img} onChange={(e) => updateField('img', e.target.value)} rows="3" required />
          </label>

          <button className="btn btn-primary admin-save" disabled={saving} type="submit">
            <span className="material-symbols-outlined">{editingId ? 'save' : 'add_box'}</span>
            {saving ? 'Sauvegarde...' : editingId ? 'Modifier le produit' : 'Ajouter le produit'}
          </button>
        </form>

        <section className="admin-table-wrap">
          <div className="admin-table-head">
            <h2>Catalogue</h2>
            <button className="btn admin-refresh" type="button" onClick={fetchProducts}>
              <span className="material-symbols-outlined">refresh</span>
              Actualiser
            </button>
          </div>

          {loading ? (
            <p className="admin-loading">Chargement des produits...</p>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <img src={product.img} alt={product.name} />
                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.badge || product.label}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{Number(product.price).toFixed(2)}€</td>
                      <td>
                        <span className={`stock-pill ${(Number(product.stock) || 0) <= 5 ? 'low' : ''}`}>
                          {product.stock ?? 0}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="btn" type="button" onClick={() => editProduct(product)} aria-label={`Modifier ${product.name}`}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="btn danger" type="button" onClick={() => deleteProduct(product)} aria-label={`Supprimer ${product.name}`}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default AdminProducts;
