import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
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
    img: 'https://tse3.mm.bing.net/th/id/OIP.LxE6D1xBpPzlzBDKyJJMRAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
    ingredients: ['2 Œufs', 'Banane écrasée', 'Poudre de protéine', 'Miel', 'Baies fraîches'],
    steps: ['Mélanger œufs, banane et protéine.', 'Verser sur plaque chauffante.', 'Cuire 2-3 min de chaque côté.', 'Servir avec baies et miel.']
  },
  {
    id: 4,
    name: 'Smoothie Mangue Coco',
    category: 'Petit-déjeuner',
    kcal: 280,
    protein: 15,
    img: 'https://th.bing.com/th/id/OIP.xNhxCzPvwfl1-p30zF1x8QHaFj?w=261&h=196&c=7&r=0&o=7&pid=1.7&rm=3',
    ingredients: ['Mangue fraîche', 'Yaourt grec', 'Lait de coco', 'Miel', 'Glaçons'],
    steps: ['Couper la mangue en morceaux.', 'Mixer avec yaourt et lait.', 'Ajouter miel et glaçons.', 'Servir immédiatement.']
  },
  {
    id: 5,
    name: 'Toast Complet Œuf Poché',
    category: 'Petit-déjeuner',
    kcal: 290,
    protein: 16,
    img: 'data:image/webp;base64,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',
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
    img: 'data:image/webp;base64,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',
    ingredients: ['Flocons d\'avoine', 'Poudre protéine', 'Beurre d\'arachide', 'Miel', 'Chocolat noir'],
    steps: ['Mélanger avoine, protéine et beurre.', 'Ajouter miel.', 'Former des barres.', 'Enrober de chocolat.', 'Réfrigérer 2h.']
  },
  {
    id: 10,
    name: 'Yaourt Grec Muesli',
    category: 'Snacks',
    kcal: 220,
    protein: 18,
    img: 'https://tse4.mm.bing.net/th/id/OIP.8BzdTAtOdPBY4Jkhj1fPkwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    ingredients: ['Yaourt grec', 'Muesli', 'Miel', 'Noix', 'Baies séchées'],
    steps: ['Remplir verre de yaourt.', 'Ajouter muesli.', 'Verser miel.', 'Décorer noix et baies.', 'Déguster frais.']
  },
  {
    id: 11,
    name: 'Mix Noix Énergétique',
    category: 'Snacks',
    kcal: 180,
    protein: 8,
    img: 'https://tse3.mm.bing.net/th/id/OIP.ml5D1M4HKbnqHwG0rWRcoQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
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
      alert("Veuillez vous connecter pour enregistrer vos repas !");
      return;
    }

    try {
      const data = await createNutritionLog(token, {
        recipe_id: recipe.id,
        name: recipe.name,
        kcal: recipe.kcal,
        protein: recipe.protein
      });

      alert(`${recipe.name} ajouté à votre journée !`);
      setLogs(prev => [data.log, ...prev]);
      setSelectedRecipe(null);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert("Erreur lors de l'enregistrement");
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
