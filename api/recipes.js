import https from 'https';
import http from 'http';

const mockRecipes = [
  {
    id: 1,
    name: 'Berry Vitality Bowl',
    category: 'Petit-déjeuner',
    kcal: 340,
    protein: '12g',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJe5nqMFHc9Y1pk1THZZ-wzxDN3QEyp7fIRB9d0jwkqS0s1EYXh5Zbj7pSmLLvkwrLjXXkMDxs_EH5Hiprhjz_a39RX6oR8SpRhCkt1FuWi6HvO_YMgXmVg_AUNlNJQHlC8_osSOlwO5XspvesTS3IblcnDwPsWN7kX82NAPWcYwasYR6ttSgPMZZ118oiDQB439ouu5XL2RWFhNJqWbl82d4S5k3C74qDSFLDY7xeKzmq4-EeCehkYZQP5aaB85ntVGUX-J0DOv4',
    ingredients: ['Baies sauvages', 'Yogourt grec 0%', 'Graines de chia', 'Miel d\'acacia'],
    steps: ['Mélanger le yogourt et les graines.', 'Ajouter les baies fraîches.', 'Napper de miel.']
  },
  {
    id: 2,
    name: 'Omelette Avocat & Épinards',
    category: 'Petit-déjeuner',
    kcal: 280,
    protein: '18g',
    img: 'https://static.jow.fr/550x550/patterns/yolk-03-202309.png_merge_recipes/75RKiy61gQ0dYA.png.jpg',
    ingredients: ['3 Oeufs bio', 'Épinards frais', '1/2 Avocat', 'Feta légère'],
    steps: ['Faire sauter les épinards.', 'Battre les oeufs et verser dans la poêle.', 'Ajouter l\'avocat et la feta à la fin.']
  },
  {
    id: 3,
    name: 'Pancakes Protéinés',
    category: 'Petit-déjeuner',
    kcal: 320,
    protein: '20g',
    img: 'https://images.unsplash.com/photo-1587190036519-fd6c6d6bfed5?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 Œufs', 'Banane écrasée', 'Poudre de protéine', 'Miel', 'Baies fraîches'],
    steps: ['Mélanger œufs, banane et protéine.', 'Verser sur plaque chauffante.', 'Cuire 2-3 min de chaque côté.', 'Servir avec baies et miel.']
  },
  {
    id: 4,
    name: 'Smoothie Mangue Coco',
    category: 'Petit-déjeuner',
    kcal: 280,
    protein: '15g',
    img: 'https://images.unsplash.com/photo-1590080876614-d1c55b6c4a00?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Mangue fraîche', 'Yaourt grec', 'Lait de coco', 'Miel', 'Glaçons'],
    steps: ['Couper la mangue en morceaux.', 'Mixer avec yaourt et lait.', 'Ajouter miel et glaçons.', 'Servir immédiatement.']
  },
  {
    id: 5,
    name: 'Toast Complet Œuf Poché',
    category: 'Petit-déjeuner',
    kcal: 290,
    protein: '16g',
    img: 'https://images.unsplash.com/photo-1528735471110-1f6e75c8f8b8?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pain complet', 'Œuf bio', 'Tomate', 'Avocat', 'Herbes fraîches'],
    steps: ['Griller le pain.', 'Pocher l\'œuf dans l\'eau.', 'Tartiner avocat sur le pain.', 'Ajouter tomate et œuf.', 'Assaisonner.']
  },
  {
    id: 6,
    name: 'Salade Grecque Complète',
    category: 'Déjeuner',
    kcal: 350,
    protein: '14g',
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=300&fit=crop',
    ingredients: ['Tomate', 'Concombre', 'Oignon', 'Fromage feta', 'Olives', 'Huile d\'olive'],
    steps: ['Couper les légumes.', 'Mélanger dans un saladier.', 'Ajouter feta et olives.', 'Verser huile d\'olive.', 'Bien mélanger et servir frais.']
  },
  {
    id: 7,
    name: 'Bowl Quinoa & Légumes',
    category: 'Déjeuner',
    kcal: 380,
    protein: '16g',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Quinoa cuit', 'Brocoli', 'Carotte', 'Pois chiches rôtis', 'Tahini'],
    steps: ['Cuire le quinoa.', 'Rôtir les légumes.', 'Assembler dans un bol.', 'Verser sauce tahini.', 'Décorer de graines.']
  },
  {
    id: 8,
    name: 'Pudding de Chia',
    category: 'Snacks',
    kcal: 240,
    protein: '8g',
    img: 'https://www.delscookingtwist.com/wp-content/uploads/2019/05/Rhubarb-Strawberry-Chia-Pudding_1.jpg',
    ingredients: ['Graines de chia', 'Lait d\'amande', 'Vanille', 'Fraises'],
    steps: ['Mélanger le chia et le lait.', 'Laisser reposer une nuit.', 'Ajouter les fraises avant de servir.']
  },
  {
    id: 9,
    name: 'Barres Énergétiques Maison',
    category: 'Snacks',
    kcal: 200,
    protein: '12g',
    img: 'https://images.unsplash.com/photo-1638199706092-0e797eae1ce7?w=500&h=300&fit=crop',
    ingredients: ['Flocons d\'avoine', 'Poudre protéine', 'Beurre d\'arachide', 'Miel', 'Chocolat noir'],
    steps: ['Mélanger avoine, protéine et beurre.', 'Ajouter miel.', 'Former des barres.', 'Enrober de chocolat.', 'Réfrigérer 2h.']
  },
  {
    id: 10,
    name: 'Yaourt Grec Muesli',
    category: 'Snacks',
    kcal: 220,
    protein: '18g',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291840?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Yaourt grec', 'Muesli', 'Miel', 'Noix', 'Baies séchées'],
    steps: ['Remplir verre de yaourt.', 'Ajouter muesli.', 'Verser miel.', 'Décorer noix et baies.', 'Déguster frais.']
  },
  {
    id: 11,
    name: 'Mix Noix Énergétique',
    category: 'Snacks',
    kcal: 180,
    protein: '8g',
    img: 'https://images.unsplash.com/photo-1585518419759-86d3b7daf397?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Amandes', 'Noisettes', 'Raisins secs', 'Cranberries', 'Sel'],
    steps: ['Mélanger les fruits secs.', 'Ajouter noix.', 'Assaisonner légèrement.', 'Mettre en portion.', 'À consommer modérément.']
  },
  {
    id: 12,
    name: 'Saumon Grillé & Asperges',
    category: 'Dîner',
    kcal: 420,
    protein: '35g',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pavé de saumon', 'Asperges vertes', 'Huile d\'olive', 'Citron bio'],
    steps: ['Assaisonner le saumon.', 'Griller 4-5 min de chaque côté.', 'Saisir les asperges à la poêle.']
  },
  {
    id: 13,
    name: 'Curry de Pois Chiches',
    category: 'Dîner',
    kcal: 380,
    protein: '14g',
    img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pois chiches', 'Lait de coco', 'Curry en poudre', 'Epinards'],
    steps: ['Faire revenir les épices.', 'Ajouter les pois chiches et le lait de coco.', 'Laisser mijoter 15 min.']
  },
  {
    id: 14,
    name: 'Poulet Rôti Légumes',
    category: 'Dîner',
    kcal: 450,
    protein: '42g',
    img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Poulet fermier', 'Patate douce', 'Brocoli', 'Ail', 'Herbes de Provence'],
    steps: ['Préparer poulet et légumes.', 'Assaisonner généreusement.', 'Rôtir à 200°C 45 min.', 'Vérifier cuisson.', 'Servir chaud.']
  },
  {
    id: 15,
    name: 'Pâtes à la Carbonara',
    category: 'Dîner',
    kcal: 520,
    protein: '28g',
    img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pâtes complètes', 'Œufs', 'Bacon', 'Fromage Parmesan', 'Poivre noir'],
    steps: ['Cuire les pâtes.', 'Faire dorer bacon.', 'Fouetter œufs avec fromage.', 'Mélanger pâtes chaudes.', 'Ajouter bacon et sauce.', 'Assaisonner.']
  },
  {
    id: 16,
    name: 'Steak Frites Complètes',
    category: 'Dîner',
    kcal: 580,
    protein: '45g',
    img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Steak bœuf', 'Pommes de terre', 'Beurre', 'Ail', 'Thym'],
    steps: ['Cuire frites au four.', 'Poêler steak 3-4 min côté.', 'Ajouter beurre et ail.', 'Laisser reposer 5 min.', 'Servir avec frites.']
  }
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          data: data,
          headers: response.headers
        });
      });
    }).on('error', reject);
  });
}

export default async function handler(req, res) {
  const BACKEND_URL = 'https://vitabi-backend.boushera-bai.alwaysdata.net';
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to proxy to the backend API
    const response = await makeRequest(`${BACKEND_URL}/api/recipes`);

    if (response.status === 200) {
      try {
        const data = JSON.parse(response.data);
        return res.status(200).json(data);
      } catch (e) {
        console.error('JSON parse error:', e);
        return res.status(200).json(mockRecipes);
      }
    }
  } catch (error) {
    console.error('Backend request failed:', error.message);
    // Backend is unreachable, use mock data
  }

  // Fallback to mock data
  return res.status(200).json(mockRecipes);
}
