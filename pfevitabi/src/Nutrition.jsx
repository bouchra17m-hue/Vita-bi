import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useToast } from './useToast';
import { getRecipes, getNutritionLogs, createNutritionLog } from './api';
import './Nutrition.css';
import Footer from './Footer';

const buildRecipeFallbackImage = (recipe) => {
  const title = String(recipe?.name || 'Recette').replace(/[<>&]/g, '');
  const category = String(recipe?.category || 'Nutrition').replace(/[<>&]/g, '');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#ffe9f6"/>
          <stop offset="0.55" stop-color="#f7fff2"/>
          <stop offset="1" stop-color="#fff4d6"/>
        </linearGradient>
      </defs>
      <rect width="900" height="600" fill="url(#bg)"/>
      <circle cx="740" cy="120" r="120" fill="#ec3c9c" opacity="0.14"/>
      <circle cx="160" cy="500" r="150" fill="#7bbf57" opacity="0.14"/>
      <rect x="115" y="140" width="670" height="320" rx="42" fill="#ffffff" opacity="0.82"/>
      <text x="450" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#24122f">${title}</text>
      <text x="450" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ec3c9c">${category}</text>
      <text x="450" y="375" text-anchor="middle" font-family="Arial, sans-serif" font-size="76" fill="#7bbf57">VitaBi</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Mock recipes - fallback data
const mockRecipes = [
  {
    id: 1,
    name: 'Berry Vitality Bowl',
    category: 'Petit-déjeuner',
    kcal: 340,
    protein: 12,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJe5nqMFHc9Y1pk1THZZ-wzxDN3QEyp7fIRB9d0jwkqS0s1EYXh5Zbj7pSmLLvkwrLjXXkMDxs_EH5Hiprhjz_a39RX6oR8SpRhCkt1FuWi6HvO_YMgXmVg_AUNlNJQHlC8_osSOlwO5XspvesTS3IblcnDwPsWN7kX82NAPWcYwasYR6ttSgPMZZ118oiDQB439ouu5XL2RWFhNJqWbl82d4S5k3C74qDSFLDY7xeKzmq4-EeCehkYZQP5aaB85ntVGUX-J0DOv4',
    ingredients: ['Baies sauvages', 'Yogourt grec 0%', 'Graines de chia', 'Miel d\'acacia'],
    steps: ['Mélanger le yogourt et les graines.', 'Ajouter les baies fraîches.', 'Napper de miel.']
  },
  {
    id: 2,
    name: 'Omelette Avocat & Épinards',
    category: 'Petit-déjeuner',
    kcal: 280,
    protein: 18,
    img: 'https://static.jow.fr/550x550/patterns/yolk-03-202309.png_merge_recipes/75RKiy61gQ0dYA.png.jpg',
    ingredients: ['3 Oeufs bio', 'Épinards frais', '1/2 Avocat', 'Feta légère'],
    steps: ['Faire sauter les épinards.', 'Battre les oeufs et verser dans la poêle.', 'Ajouter l\'avocat et la feta à la fin.']
  },
  {
    id: 3,
    name: 'Pancakes Protéinés',
    category: 'Petit-déjeuner',
    kcal: 320,
    protein: 20,
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 Œufs', 'Banane écrasée', 'Poudre de protéine', 'Miel', 'Baies fraîches'],
    steps: ['Mélanger œufs, banane et protéine.', 'Verser sur plaque chauffante.', 'Cuire 2-3 min de chaque côté.', 'Servir avec baies et miel.']
  },
  {
    id: 4,
    name: 'Smoothie Mangue Coco',
    category: 'Petit-déjeuner',
    kcal: 280,
    protein: 15,
    img: 'https://images.unsplash.com/photo-1590080876614-d1c55b6c4a00?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Mangue fraîche', 'Yaourt grec', 'Lait de coco', 'Miel', 'Glaçons'],
    steps: ['Couper la mangue en morceaux.', 'Mixer avec yaourt et lait.', 'Ajouter miel et glaçons.', 'Servir immédiatement.']
  },
  {
    id: 5,
    name: 'Toast Complet Œuf Poché',
    category: 'Petit-déjeuner',
    kcal: 290,
    img: 'https://images.unsplash.com/photo-1528735471110-1f6e75c8f8b8?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pain complet', 'Œuf bio', 'Tomate', 'Avocat', 'Herbes fraîches'],
    steps: ['Griller le pain.', 'Pocher l\'œuf dans l\'eau.', 'Tartiner avocat sur le pain.', 'Ajouter tomate et œuf.', 'Assaisonner.']
  },
  {
    id: 6,
    name: 'Salade Grecque Complète',
    category: 'Déjeuner',
    kcal: 350,
    protein: 14,
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=300&fit=crop',
    ingredients: ['Tomate', 'Concombre', 'Oignon', 'Fromage feta', 'Olives', 'Huile d\'olive'],
    steps: ['Couper les légumes.', 'Mélanger dans un saladier.', 'Ajouter feta et olives.', 'Verser huile d\'olive.', 'Bien mélanger et servir frais.']
  },
  {
    id: 7,
    name: 'Bowl Quinoa & Légumes',
    category: 'Déjeuner',
    kcal: 380,
    protein: 16,
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Quinoa cuit', 'Brocoli', 'Carotte', 'Pois chiches rôtis', 'Tahini'],
    steps: ['Cuire le quinoa.', 'Rôtir les légumes.', 'Assembler dans un bol.', 'Verser sauce tahini.', 'Décorer de graines.']
  },
  {
    id: 8,
    name: 'Pudding de Chia',
    category: 'Snacks',
    kcal: 240,
    protein: 8,
    img: 'https://www.delscookingtwist.com/wp-content/uploads/2019/05/Rhubarb-Strawberry-Chia-Pudding_1.jpg',
    ingredients: ['Graines de chia', 'Lait d\'amande', 'Vanille', 'Fraises'],
    steps: ['Mélanger le chia et le lait.', 'Laisser reposer une nuit.', 'Ajouter les fraises avant de servir.']
  },
  {
    id: 9,
    name: 'Barres Énergétiques Maison',
    category: 'Snacks',
    kcal: 200,
    protein: 12,
    img: 'https://images.unsplash.com/photo-1638199706092-0e797eae1ce7?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Flocons d\'avoine', 'Poudre protéine', 'Beurre d\'arachide', 'Miel', 'Chocolat noir'],
    steps: ['Mélanger avoine, protéine et beurre.', 'Ajouter miel.', 'Former des barres.', 'Enrober de chocolat.', 'Réfrigérer 2h.']
  },
  {
    id: 10,
    name: 'Yaourt Grec Muesli',
    category: 'Snacks',
    kcal: 220,
    protein: 18,
    img: 'https://images.unsplash.com/photo-1585511925443-9fc26dd3a3a5?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Yaourt grec', 'Muesli', 'Miel', 'Noix', 'Baies séchées'],
    steps: ['Remplir verre de yaourt.', 'Ajouter muesli.', 'Verser miel.', 'Décorer noix et baies.', 'Déguster frais.']
  },
  {
    id: 11,
    name: 'Mix Noix Énergétique',
    category: 'Snacks',
    kcal: 180,
    protein: 8,
    img: 'https://images.unsplash.com/photo-1585707034007-9a4ff45b3281?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Amandes', 'Noisettes', 'Raisins secs', 'Cranberries', 'Sel'],
    steps: ['Mélanger les fruits secs.', 'Ajouter noix.', 'Assaisonner légèrement.', 'Mettre en portion.', 'À consommer modérément.']
  },
  {
    id: 12,
    name: 'Saumon Grillé & Asperges',
    category: 'Dîner',
    kcal: 420,
    protein: 35,
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pavé de saumon', 'Asperges vertes', 'Huile d\'olive', 'Citron bio'],
    steps: ['Assaisonner le saumon.', 'Griller 4-5 min de chaque côté.', 'Saisir les asperges à la poêle.']
  },
  {
    id: 13,
    name: 'Curry de Pois Chiches',
    category: 'Dîner',
    kcal: 380,
    protein: 14,
    img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pois chiches', 'Lait de coco', 'Curry en poudre', 'Epinards'],
    steps: ['Faire revenir les épices.', 'Ajouter les pois chiches et le lait de coco.', 'Laisser mijoter 15 min.']
  },
  {
    id: 14,
    name: 'Poulet Rôti Légumes',
    category: 'Dîner',
    kcal: 450,
    protein: 42,
    img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Poulet fermier', 'Patate douce', 'Brocoli', 'Ail', 'Herbes de Provence'],
    steps: ['Préparer poulet et légumes.', 'Assaisonner généreusement.', 'Rôtir à 200°C 45 min.', 'Vérifier cuisson.', 'Servir chaud.']
  },
  {
    id: 15,
    name: 'Pâtes à la Carbonara',
    category: 'Dîner',
    kcal: 520,
    protein: 28,
    img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pâtes complètes', 'Œufs', 'Bacon', 'Fromage Parmesan', 'Poivre noir'],
    steps: ['Cuire les pâtes.', 'Faire dorer bacon.', 'Fouetter œufs avec fromage.', 'Mélanger pâtes chaudes.', 'Ajouter bacon et sauce.', 'Assaisonner.']
  },
  {
    id: 16,
    name: 'Steak Frites Complètes',
    category: 'Dîner',
    kcal: 580,
    protein: 45,
    img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Steak bœuf', 'Pommes de terre', 'Beurre', 'Ail', 'Thym'],
    steps: ['Cuire frites au four.', 'Poêler steak 3-4 min côté.', 'Ajouter beurre et ail.', 'Laisser reposer 5 min.', 'Servir avec frites.']
  },
];

const Nutrition = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filter, setFilter] = useState('Tous');
  const [recipes, setRecipes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // Récupérer les recettes depuis le backend
    getRecipes()
      .then(data => {
        // Normalize recipes to ensure ingredients and steps are arrays
        const normalizedRecipes = (data && Array.isArray(data) ? data : []).map(recipe => ({
          ...recipe,
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          steps: Array.isArray(recipe.steps) ? recipe.steps : []
        }));
        
        setRecipes(normalizedRecipes.length > 0 ? normalizedRecipes : mockRecipes);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des recettes:", err);
        setRecipes(mockRecipes); // Use mock data on error
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Récupérer le journal nutritionnel d'aujourd'hui
    if (token) {
      getNutritionLogs(token)
        .then(data => {
          setLogs(data);
        })
        .catch(err => console.error("Erreur lors de la récupération des logs:", err));
    }
  }, [token]);

  const handleLogMeal = async (recipe) => {
    if (!token) {
      toast.warning("Veuillez vous connecter pour enregistrer vos repas !");
      return;
    }

    try {
      const data = await createNutritionLog(token, {
        recipe_id: recipe.id,
        name: recipe.name,
        kcal: recipe.kcal,
        protein: recipe.protein
      });

      toast.success(`${recipe.name} ajouté à votre journée !`);
      setLogs(prev => [data.log, ...prev]);
      setSelectedRecipe(null);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      toast.error("Erreur lors de l'enregistrement");
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
                  <img
                    src={recipe.img}
                    alt={recipe.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = buildRecipeFallbackImage(recipe);
                    }}
                  />
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
                      {Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 4).map((ing, i) => (
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
                {Array.isArray(selectedRecipe.ingredients) && selectedRecipe.ingredients.map((ing, i) => (
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
                {Array.isArray(selectedRecipe.steps) && selectedRecipe.steps.map((step, i) => (
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


