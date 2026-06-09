let API_URL = '';
let FALLBACK_API_URLS = [];

const initializeApiUrl = () => {
  // Priority 1: Explicit environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    API_URL = envUrl.replace(/\/$/, '');
    return;
  }

  // Priority 2: Detect from current hostname
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    API_URL = 'http://127.0.0.1:8000';
    return;
  }
  
  // Production on Vercel - try multiple backends
  if (hostname.includes('vercel.app')) {
    API_URL = 'https://boushera-bai.alwaysdata.net';
    FALLBACK_API_URLS = [
      'https://vitabi-backend-xxxx.onrender.com', // Render fallback (user needs to set their actual URL)
    ];
    return;
  }
  
  // Default fallback
  API_URL = import.meta.env.PROD ? '' : 'http://127.0.0.1:8000';
};

initializeApiUrl();

const IS_PRODUCTION = import.meta.env.PROD;

export const getApiUrl = () => API_URL;

export const apiCall = async (endpoint, options = {}) => {
  const urls = [API_URL, ...FALLBACK_API_URLS].filter(Boolean);
  let lastError = null;
  let lastResponse = null;

  for (const baseUrl of urls) {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    let response;
    try {
      response = await fetch(url, { ...options, headers });
      lastResponse = response;
      
      // Si la réponse est OK, l'utiliser
      if (response.ok) {
        return response.json();
      }
      
      // Sinon, essayer le fallback
      lastError = {
        status: response.status,
        statusText: response.statusText,
        url: baseUrl,
      };
      continue;
    } catch (error) {
      // Erreur de connexion, essayer le fallback
      lastError = error;
      continue;
    }
  }

  // Si aucune URL n'a fonctionné, afficher l'erreur
  if (lastError instanceof Error) {
    const displayUrl = API_URL || 'API serveur';
    throw new Error(
      `Impossible de joindre le serveur (${displayUrl}). ` +
      `Vérifiez votre connexion. ` +
      `Détail: ${lastError.message}`
    );
  } else if (lastError && lastError.status) {
    let message = `Erreur API: ${lastError.status} ${lastError.statusText}`;
    
    // Essayer d'extraire le message d'erreur de la réponse
    if (lastResponse) {
      try {
        const data = await lastResponse.json();
        if (typeof data === 'object' && data !== null) {
          if (data.message && typeof data.message === 'string') {
            message = data.message;
          } else if (data.errors) {
            const parts = [];
            for (const key of Object.keys(data.errors)) {
              const val = data.errors[key];
              parts.push(`${key}: ${Array.isArray(val) ? val.join(' ') : val}`);
            }
            message = parts.join(' | ');
          }
        }
      } catch {
        // response is not JSON, keep status message
      }
    }
    
    throw new Error(message);
  }

  throw new Error('Impossible de joindre le serveur API');
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/test`);
    return response.ok;
  } catch {
    return false;
  }
};

export const getUser = (token) => {
  return apiCall('/api/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const login = (email, password) => {
  return apiCall('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const register = (name, email, password, passwordConfirmation) => {
  return apiCall('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
};

export const getRecipes = () => apiCall('/api/recipes');

export const getNutritionLogs = (token) => {
  return apiCall('/api/nutrition-logs', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const createNutritionLog = (token, logData) => {
  return apiCall('/api/nutrition-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(logData),
  });
};

export const getProducts = () => apiCall('/api/products');

export const createProduct = (token, productData) => {
  return apiCall('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
};

export const updateProduct = (token, productId, productData) => {
  return apiCall(`/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = (token, productId) => {
  return apiCall(`/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrders = (token) => {
  return apiCall('/api/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const createOrder = (token, orderData) => {
  return apiCall('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
};
