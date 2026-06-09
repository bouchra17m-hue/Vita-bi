import { useCallback, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './useCart';
import { getProducts } from './api';
import Footer from './Footer';
import './Shop.css';

const fallbackProducts = [
  {
    id: 'fallback-1',
    name: 'Chaussures Pulse-Vibe',
    category: 'vêtements femme',
    price: 129.99,
    label: 'Apparel',
    badge: 'Nouveau',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJvqMvy4SYrWIJ8qmToKlxcWuW3_QW5KQi4EKEq4Kh29aEvlhbn2RtlgYJQSbqvPcULpFWEZuwA4MmudK6KApEtoq94wjy1sMnMeJwTvDnCEl0vxx35sUUvRMeBrHDvE5yjfeLVGjX4szHHWGj7A9-wlMpRoiMtSoRCn6UELs0QREpp5HD0lKXgg7pFSsQpnmHyG50XS8Xor3tqZiUfNQDxiUKVb3H5fzhwz5iQvmawmvllGcgPgm5Igp3JkqGPF75cZpdJghP9pQ',
  },
  {
    id: 'fallback-2',
    name: 'Ensemble Performance Pro',
    category: 'vêtements femme',
    price: 85,
    label: 'Apparel',
    badge: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0SDZQKAUPz5EpJCnnRoWgixlv--uY7r3DoZrXubDwsg4kYXovfIsbpe62I4DFZIb3IBY4bvycBKAo0mDKf6YBodaBzmfQljTCcZnGdZpR4BJqZPak52x-k32M6_7JRcZMdGtpatnCwxJe6pas9noJKSYuKZlIij1U-6HZdqUqQ2k5w0dPQl8OW4HaPKfXnhGtEn4irFKwXMw-f2P_7xItLYW0F5dwvzFmej6fiKygS97RoN9rmEqYR9lvUFD_JKKv3APR44P42qo',
  },
  {
    id: 'fallback-3',
    name: 'Isolate Whey Vanille',
    category: 'protéines',
    price: 64.95,
    label: 'Nutrition',
    badge: 'Best Seller',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB9M-pCL41dMmY9aRNzlBGugpJ2gKtlBmPQP74aVlwN6ThcJIuLlb5vu4mJU0MEntEA3cT6Z7kVLSwPoEan8nm3XvBeMPR9tcKFxNKdh77ANkotVTh2b7iLa3LPwbQ9jZHbeAfj1Y8uXWjfiVpIhRslhNFz6yudZGkOEBGklJVilB3eUZV0js33dC2boBB_xFMtzEhMl9rI7JtvXH9ejFspja9HWTE5PJfpDegeb9FnCfbJClLEokgLWmHX5nVwBZ8sfeCdA4LGBg',
  },
  {
    id: 'fallback-4',
    name: 'Kit Training Maison',
    category: 'matériels',
    price: 49.9,
    label: 'Equipment',
    badge: 'Pack',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_bA3AN51XFXpdoY9UYtutmU8NUMCoLSwDu4JlsN3qHQXhdJ_aBbfcCsZY7LDjBKBmZ98U_joIe08bJdMHZf0g_Z1klOl5NTXmcg4HQ1yQaXhxtr3egssxTo_yS9wodHybJoq4PcDbQmgJ2n4bysKnTN7m_xJb9W-BYGl9JGysUIlNuO_0YAVRfvr-ru_4WbjhmL0SDFSO2QBaRT_NV7XCqwriwj6UycXXCPtYxVpkBpNUrRSvO0Z09gtXXcNqDd-tKSA335c8lrk',
  },
  {
    id: 'fallback-5',
    name: 'Legging Performance Flex',
    category: 'vêtements femme',
    price: 89.99,
    label: 'Apparel',
    badge: 'Tendance',
    img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-6',
    name: 'Top Entraînement Air',
    category: 'vêtements femme',
    price: 44.99,
    label: 'Apparel',
    badge: null,
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-7',
    name: 'Whey Isolate Chocolat',
    category: 'protéines',
    price: 69.99,
    label: 'Nutrition',
    badge: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-8',
    name: 'Créatine Monohydrate 300g',
    category: 'protéines',
    price: 39.99,
    label: 'Nutrition',
    badge: null,
    img: 'https://images.unsplash.com/photo-1579722821270-1f4205d291b7?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-9',
    name: 'Haltères Ajustables 2x10kg',
    category: 'matériels',
    price: 89.99,
    label: 'Equipment',
    badge: 'Pro',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300a3a48?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-10',
    name: 'Corde à Sauter Speed',
    category: 'matériels',
    price: 22.99,
    label: 'Equipment',
    badge: null,
    img: 'https://images.unsplash.com/photo-1601422466-94baf4757f2f?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-11',
    name: 'Sweat Hoodie Performance',
    category: 'vêtements femme',
    price: 74.99,
    label: 'Apparel',
    badge: 'Nouveau',
    img: 'https://images.unsplash.com/photo-1556821552-22121ce96a79?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-12',
    name: 'Shorts de Running Ultra-Léger',
    category: 'vêtements femme',
    price: 54.99,
    label: 'Apparel',
    badge: 'Tendance',
    img: 'https://images.unsplash.com/photo-1535043666747-b07c5a265a40?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-13',
    name: 'Soutien-Gorge Sportif Supreme',
    category: 'vêtements femme',
    price: 59.99,
    label: 'Apparel',
    badge: null,
    img: 'https://images.unsplash.com/photo-1613536051285-52e3143fbc8d?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-14',
    name: 'BCAA Energy Framboise',
    category: 'protéines',
    price: 44.99,
    label: 'Nutrition',
    badge: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1623166746601-7924e34eaaaa?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-15',
    name: 'Protéine Végétale 500g',
    category: 'protéines',
    price: 49.99,
    label: 'Nutrition',
    badge: 'Nouveau',
    img: 'https://images.unsplash.com/photo-1589985291923-42ac0d993388?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-16',
    name: 'Tapis de Yoga Premium 6mm',
    category: 'matériels',
    price: 64.99,
    label: 'Equipment',
    badge: 'Pro',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-17',
    name: 'Kettlebell Ajustable 10kg',
    category: 'matériels',
    price: 79.99,
    label: 'Equipment',
    badge: null,
    img: 'https://images.unsplash.com/photo-1605296867004-e5f2eef8c94f?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-18',
    name: 'Bande Élastique Résistance Set',
    category: 'matériels',
    price: 34.99,
    label: 'Equipment',
    badge: 'Pack',
    img: 'https://images.unsplash.com/photo-1602491599557-a872f838e4f2?w=800&auto=format&fit=crop',
  },
  {
    id: 'fallback-19',
    name: 'Boisson Énergétique Isopro',
    category: 'protéines',
    price: 29.99,
    label: 'Nutrition',
    badge: null,
    img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop',
  },
];

const Shop = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadProducts = useCallback(() => {
    setLoading(true);
    getProducts()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setUsingFallback(false);
        } else {
          setProducts(fallbackProducts);
          setUsingFallback(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des produits:", err);
        setProducts(fallbackProducts);
        setUsingFallback(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadProducts();

    const handleProductsUpdated = () => loadProducts();
    const handleStorage = (event) => {
      if (event.key === 'vitabi-products-updated') {
        loadProducts();
      }
    };

    window.addEventListener('vitabi-products-updated', handleProductsUpdated);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleProductsUpdated);

    return () => {
      window.removeEventListener('vitabi-products-updated', handleProductsUpdated);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleProductsUpdated);
    };
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const nextProducts = products
      .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
      .filter((product) => {
        if (!query) return true;
        return [product.name, product.category, product.label, product.badge]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      });

    return [...nextProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const resetShopFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('featured');
  };

  const getProductDetails = (product) => {
    const detailsByCategory = {
      'vêtements femme': {
        description: 'Conçu pour accompagner vos séances intenses avec une coupe confortable, respirante et facile à porter au quotidien.',
        highlights: ['Tissu respirant', 'Maintien confortable', 'Idéal fitness et running'],
      },
      'protéines': {
        description: 'Un complément pratique pour soutenir la récupération musculaire et compléter vos apports après l’entraînement.',
        highlights: ['Riche en protéines', 'Texture légère', 'Parfait après séance'],
      },
      'matériels': {
        description: 'Un équipement fiable pour structurer vos entraînements à la maison ou en salle avec plus de stabilité.',
        highlights: ['Prise en main facile', 'Format durable', 'Usage polyvalent'],
      },
    };

    return detailsByCategory[product.category] || {
      description: 'Un produit sélectionné par VitaBi pour améliorer votre routine sportive avec style et efficacité.',
      highlights: ['Sélection VitaBi', 'Qualité premium', 'Routine sportive'],
    };
  };

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <main className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '1rem' }}>Vibrez avec VitaBi.</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', maxWidth: '42rem' }}>Le meilleur du fitness et de la nutrition pour transformer votre routine en une expérience vibrante.</p>
        </header>

        {/* Hero Categories (Bento) */}
        <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="category-card" style={{ position: 'relative', height: '250px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedCategory('matériels')}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_bA3AN51XFXpdoY9UYtutmU8NUMCoLSwDu4JlsN3qHQXhdJ_aBbfcCsZY7LDjBKBmZ98U_joIe08bJdMHZf0g_Z1klOl5NTXmcg4HQ1yQaXhxtr3egssxTo_yS9wodHybJoq4PcDbQmgJ2n4bysKnTN7m_xJb9W-BYGl9JGysUIlNuO_0YAVRfvr-ru_4WbjhmL0SDFSO2QBaRT_NV7XCqwriwj6UycXXCPtYxVpkBpNUrRSvO0Z09gtXXcNqDd-tKSA335c8lrk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Matériel" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Matériel de Sport</h3>
              <span style={{ color: 'var(--primary-fixed-dim)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Découvrir <span className="material-symbols-outlined">arrow_forward</span></span>
            </div>
          </div>
          <div className="category-card" style={{ position: 'relative', height: '250px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedCategory('vêtements femme')}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0SDZQKAUPz5EpJCnnRoWgixlv--uY7r3DoZrXubDwsg4kYXovfIsbpe62I4DFZIb3IBY4bvycBKAo0mDKf6YBodaBzmfQljTCcZnGdZpR4BJqZPak52x-k32M6_7JRcZMdGtpatnCwxJe6pas9noJKSYuKZlIij1U-6HZdqUqQ2k5w0dPQl8OW4HaPKfXnhGtEn4irFKwXMw-f2P_7xItLYW0F5dwvzFmej6fiKygS97RoN9rmEqYR9lvUFD_JKKv3APR44P42qo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Vêtements" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Vêtements de Sport</h3>
              <span style={{ color: 'var(--secondary-fixed-dim)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Découvrir <span className="material-symbols-outlined">arrow_forward</span></span>
            </div>
          </div>
          <div className="category-card" style={{ position: 'relative', height: '250px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedCategory('protéines')}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4pxqcx8eWi3lf0MDo8wRYyjzbW6PzcPpup9-FlTDkJCu1E-2cRGh4L_Ypc_8tC4ooN3y1cVqXLTg9P0K_7usIhn8FZYuGitHi-mo_lZ7GOiviBVLGSQIARQB36sjR5SS2H_j6d0uhz225d28uJzjt4wofPrfsrf8GEUoscvw752Sayz4MAn5p9wRNPz6nsKxCXe02UCKb7XEvs26nlBdJaNg_Y-GFpDTY3Gk07yhnhQQUuCTekIKbf_EipcJ10CDAYMYRqGDCAzY" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Nutrition" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Compléments & Protéines</h3>
              <span style={{ color: 'var(--tertiary-fixed-dim)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Découvrir <span className="material-symbols-outlined">arrow_forward</span></span>
            </div>
          </div>
        </div>

        {/* Filter / Sort Row */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.025em' }}>Nouveautés</h2>
            <p style={{ color: 'var(--on-surface-variant)' }}>Nos équipements les plus demandés cette semaine.</p>
          </div>
          <div className="flex gap-4">
            {['all', 'vêtements femme', 'protéines', 'matériels'].map(cat => (
              <button 
                key={cat} 
                className={`btn ${selectedCategory === cat ? 'btn-primary' : ''}`}
                style={{ padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '14px', backgroundColor: selectedCategory === cat ? '' : 'white', border: '1px solid var(--outline-variant)' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Tout' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-toolbar">
          <label className="shop-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              placeholder="Rechercher un produit"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <label className="shop-sort">
            <span className="material-symbols-outlined">sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Mis en avant</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </label>
          <button className="btn shop-reset" type="button" onClick={resetShopFilters}>
            <span className="material-symbols-outlined">restart_alt</span>
            Réinitialiser
          </button>
        </div>

        <p className="shop-result-count">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </p>

        {loading && (
          <p className="shop-status">Chargement des produits...</p>
        )}

        {!loading && usingFallback && (
          <p className="shop-status">
            Le backend n'est pas disponible pour le moment. Des produits de démonstration sont affichés.
          </p>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 && !loading && (
          <div className="shop-empty">
            <span className="material-symbols-outlined">search_off</span>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez une autre recherche ou réinitialisez les filtres.</p>
            <button className="btn btn-primary" type="button" onClick={resetShopFilters}>Voir tous les produits</button>
          </div>
        )}

        <div className="product-grid-new" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <article key={product.id} className="white-card bouncy-spring" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}>
              <div style={{ width: '100%', height: '260px', backgroundColor: 'var(--surface-container-low)', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                {product.badge && (
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: product.badge === 'Best Seller' ? 'var(--tertiary)' : 'var(--secondary)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                    {product.badge}
                  </div>
                )}
                <button className="btn" style={{ position: 'absolute', top: '1rem', right: '1rem', width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }} onClick={(e) => { e.stopPropagation(); alert('Ajouté aux favoris !'); }}>
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{product.label}</span>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--on-surface)' }}>{product.name}</h3>
                <span className={`product-stock ${(Number(product.stock) || 0) <= 0 ? 'out' : ''}`}>
                  {(Number(product.stock) || 0) > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </span>
                <p className="product-card-detail">{getProductDetails(product).description}</p>
                <button className="btn product-detail-btn" type="button" onClick={() => setSelectedProduct(product)}>
                  <span className="material-symbols-outlined">visibility</span>
                  Détails
                </button>
                <div className="flex justify-between items-center mt-4">
                  <span style={{ fontWeight: 900, color: 'var(--on-surface)', fontSize: '1.5rem' }}>{product.price}€</span>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    disabled={(Number(product.stock) || 0) <= 0}
                    onClick={() => addToCart(product)}
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {selectedProduct && (
          <div className="product-detail-overlay" role="dialog" aria-modal="true" aria-labelledby="product-detail-title">
            <button className="product-detail-backdrop" type="button" aria-label="Fermer les détails" onClick={() => setSelectedProduct(null)} />
            <div className="product-detail-modal">
              <button className="btn product-detail-close" type="button" aria-label="Fermer" onClick={() => setSelectedProduct(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="product-detail-media">
                <img src={selectedProduct.img} alt={selectedProduct.name} />
                {selectedProduct.badge && <span className="product-detail-badge">{selectedProduct.badge}</span>}
              </div>
              <div className="product-detail-content">
                <span className="product-detail-label">{selectedProduct.label}</span>
                <h2 id="product-detail-title">{selectedProduct.name}</h2>
                <p>{getProductDetails(selectedProduct).description}</p>
                <span className={`product-stock ${(Number(selectedProduct.stock) || 0) <= 0 ? 'out' : ''}`}>
                  {(Number(selectedProduct.stock) || 0) > 0 ? `${selectedProduct.stock} en stock` : 'Rupture de stock'}
                </span>
                <div className="product-detail-list">
                  {getProductDetails(selectedProduct).highlights.map((highlight) => (
                    <span key={highlight}>
                      <span className="material-symbols-outlined">check_circle</span>
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="product-detail-footer">
                  <strong>{selectedProduct.price}€</strong>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={(Number(selectedProduct.stock) || 0) <= 0}
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Promotional Banner */}
        <section className="promo-banner-new" style={{ marginTop: '6rem', backgroundColor: 'var(--secondary)', borderRadius: '24px', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', gap: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>Préparez votre prochain défi.</h2>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2.5rem' }}>
                -20% sur votre première commande d'équipements avec le code <span style={{ backgroundColor: 'white', color: 'var(--secondary)', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '8px', marginLeft: '0.5rem' }}>VITA20</span>
              </p>
              <div className="flex gap-4">
                <button className="btn" style={{ backgroundColor: 'white', color: 'var(--secondary)', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 700 }} onClick={() => alert('Code VITA20 appliqué !')}>En profiter</button>
                <Link to="/about" className="btn" style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none' }}>En savoir plus</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img style={{ width: '100%', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', transform: 'rotate(3deg)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDCUBShDZHiXwr2O-NXCgaHawYLDmKjLpsYzzKtIWkGIDsbQ3Bjy7FSHv3pm8OdUUIhqNzLxwgZG5fd--YEDGVCPaVr4-OUC1j2bFCO4Zkvsy4ra6ERbWDaPr_uCqNp-k4AK2-6aaa2E0G3a4xMmR3uKO9kb6kg3oNK7PUnJWqHioikghwGv6hGrCObs1vBejGlL9EHeaTM-vlQOe-IScR1F14SU3RjYrIrSMeEe7VesKotdv1IWzZNaWjvvQFGIYmn6TnjgNHVdg" alt="Athlete" />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* FAB */}
      <button className="btn btn-primary" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '4rem', height: '4rem', borderRadius: '50%', boxShadow: '0 8px 32px rgba(224,64,160,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40 }} onClick={() => alert('Chat de support bientôt disponible !')}>
        <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>chat</span>
      </button>
    </div>
  );
};

export default Shop;
