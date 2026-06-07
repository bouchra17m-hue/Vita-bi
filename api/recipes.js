import https from 'https';
import http from 'http';

// Mock recipes data (same as in Nutrition.jsx)
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
    name: 'Pudding de Chia',
    category: 'Snacks',
    kcal: 240,
    protein: '8g',
    img: 'https://www.delscookingtwist.com/wp-content/uploads/2019/05/Rhubarb-Strawberry-Chia-Pudding_1.jpg',
    ingredients: ['Graines de chia', 'Lait d\'amande', 'Vanille', 'Fraises'],
    steps: ['Mélanger le chia et le lait.', 'Laisser reposer une nuit.', 'Ajouter les fraises avant de servir.']
  },
  {
    id: 4,
    name: 'Saumon Grillé & Asperges',
    category: 'Dîner',
    kcal: 420,
    protein: '35g',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pavé de saumon', 'Asperges vertes', 'Huile d\'olive', 'Citron bio'],
    steps: ['Assaisonner le saumon.', 'Griller 4-5 min de chaque côté.', 'Saisir les asperges à la poêle.']
  },
  {
    id: 5,
    name: 'Curry de Pois Chiches',
    category: 'Dîner',
    kcal: 380,
    protein: '14g',
    img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Pois chiches', 'Lait de coco', 'Curry en poudre', 'Epinards'],
    steps: ['Faire revenir les épices.', 'Ajouter les pois chiches et le lait de coco.', 'Laisser mijoter 15 min.']
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
