import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Nutrition.css';
import Footer from './Footer';

const Nutrition = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filter, setFilter] = useState('Tous');
  const [recipes, setRecipes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    // Récupérer les recettes depuis le backend
    fetch('http://127.0.0.1:8000/api/recipes')
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des recettes:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Récupérer le journal nutritionnel d'aujourd'hui
    if (token) {
      fetch('http://127.0.0.1:8000/api/nutrition-logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setLogs(data);
        })
        .catch(err => console.error("Erreur lors de la récupération des logs:", err));
    }
  }, [token]);

  const handleLogMeal = async (recipe) => {
    if (!token) {
      alert("Veuillez vous connecter pour enregistrer vos repas !");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/nutrition-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipe_id: recipe.id,
          name: recipe.name,
          kcal: recipe.kcal,
          protein: recipe.protein
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${recipe.name} ajouté à votre journée !`);
        setLogs(prev => [data.log, ...prev]);
        setSelectedRecipe(null);
      } else {
        alert(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const totalTodayKcal = logs.reduce((sum, log) => sum + log.kcal, 0);

  const filteredRecipes = filter === 'Tous' 
    ? recipes 
    : recipes.filter(r => r.category === filter);

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-on-surface flex items-center justify-center">
        <p className="text-xl">Chargement des recettes...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-background">
      <main className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.05em' }}>Nutrition & Recettes</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto', fontWeight: 500 }}>
            Alimentez votre corps avec vitalité. Découvrez notre sélection de repas sains, gourmands et équilibrés.
          </p>
        </header>

        {/* Daily Tracker Section (Dynamic Premium UI) */}
        {user && (
          <section className="white-card bouncy-spring" style={{ padding: '2.5rem', borderRadius: '32px', backgroundColor: 'var(--surface-container-low)', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <h2 className="text-2xl font-black" style={{ color: 'var(--primary)' }}>Votre Journal d'Aujourd'hui</h2>
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ padding: '1.5rem 3rem', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <span className="block text-xs uppercase font-bold tracking-wider text-on-surface-variant">Calories Consommées</span>
                <span style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--primary)' }}>{totalTodayKcal} <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>kcal</span></span>
              </div>
            </div>

            {/* List of today's eaten meals */}
            {logs.length > 0 && (
              <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--secondary)', textTransform: 'uppercase', textAlign: 'left' }}>Repas de la journée</p>
                {logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ textAlign: 'left', flexGrow: 1 }}>
                      <span className="font-bold">{log.name}</span>
                      {log.protein && <span className="block text-xs text-on-surface-variant font-bold">Protéines: {log.protein}</span>}
                    </div>
                    <span className="font-black text-primary">{log.kcal} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Category Filters */}
        <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
          {['Tous', 'Petit-déjeuner', 'Déjeuner', 'Snacks', 'Dîner'].map(cat => (
            <button 
              key={cat} 
              className={`btn ${filter === cat ? 'btn-primary' : ''}`}
              style={{ padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700, backgroundColor: filter === cat ? '' : 'white', border: filter === cat ? '' : '1px solid var(--outline-variant)', color: filter === cat ? '' : 'var(--secondary)', boxShadow: filter === cat ? '' : '0 4px 16px rgba(124,82,170,0.1)' }}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Recipe Grid */}
        <div className="recipe-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredRecipes.map((recipe) => {
            const isDinnerFull = recipe.isFullWidth && filter === 'Tous';
            
            return (
              <article 
                key={recipe.id} 
                className="white-card bouncy-spring" 
                style={{ 
                  display: 'flex', 
                  flexDirection: isDinnerFull ? 'row' : 'column', 
                  gridColumn: isDinnerFull ? 'span 2' : 'auto',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
              >
                <div style={{ width: isDinnerFull ? '50%' : '100%', height: isDinnerFull ? 'auto' : '240px', overflow: 'hidden', position: 'relative' }}>
                  <img src={recipe.img} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--primary-fixed)', color: 'var(--on-primary-fixed-variant)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {recipe.category}
                  </div>
                </div>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, width: isDinnerFull ? '50%' : '100%' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{recipe.name}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>local_fire_department</span>
                      {recipe.kcal} kcal
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '1.25rem' }}>fitness_center</span>
                      {recipe.protein} Protéines
                    </div>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Ingrédients</p>
                    <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
                      {recipe.ingredients.slice(0, 4).map((ing, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                          <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--tertiary)', borderRadius: '50%' }}></span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '1rem', borderRadius: '9999px' }} onClick={() => setSelectedRecipe(recipe)}>
                    Voir la recette
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="white-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '2.5rem' }}>
            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedRecipe(null)}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>close</span>
            </button>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', letterSpacing: '-0.025em' }}>{selectedRecipe.name}</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.875rem', color: 'var(--secondary)' }}>Ingrédients</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.875rem', color: 'var(--secondary)' }}>Préparation</h4>
              <ol style={{ paddingLeft: '1.5rem', color: 'var(--on-surface-variant)' }}>
                {selectedRecipe.steps.map((step, i) => (
                  <li key={i} style={{ marginBottom: '1rem', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Log Button */}
            {user && (
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800 }}
                onClick={() => handleLogMeal(selectedRecipe)}
              >
                <span className="material-symbols-outlined">add_circle</span>
                Ajouter à ma journée (+{selectedRecipe.kcal} kcal)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Nutrition;
