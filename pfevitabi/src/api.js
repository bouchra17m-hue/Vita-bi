// API Configuration
// For production on Vercel: use relative paths (same origin)
// For development: use localhost:8000 or custom backend
const API_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is explicitly set, use it
  if (envUrl && envUrl.trim()) {
    return envUrl.replace(/\/$/, '');
  }
  
  // In production (Vercel), use relative paths
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, use localhost
  return 'http://127.0.0.1:8000';
})();

const IS_PRODUCTION = import.meta.env.PROD;

export const getApiUrl = () => API_URL;

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {})
  };
  let response;

  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    const isDev = !IS_PRODUCTION;
    const displayUrl = API_URL || 'Vercel API';
    const errorMsg = isDev 
      ? `Impossible de joindre le backend (${displayUrl}).\n\nDéveloppement: Vérifiez que "php artisan serve" est lancé sur port 8000.\n\nErreur: ${error.message}`
      : `Impossible de joindre le serveur API.\n\nVérifiez votre connexion internet.\n\nErreur: ${error.message}`;
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    let message = `API Error: ${response.status} ${response.statusText}`;

    try {
      const data = await response.json();
      if (data.errors) {
        message = Object.values(data.errors).flat().join(' ');
      } else {
        message = data.message || message;
      }
    } catch {
      // Keep the HTTP status message when the API does not return JSON.
    }

    throw new Error(message);
  }
  return response.json();
};

// Health check endpoint
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/test`);
    return response.ok;
  } catch {
    return false;
  }
};

// Auth endpoints
export const getUser = (token) => {
  return apiCall('/api/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
};

export const login = (email, password) => {
  return apiCall('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
};

export const register = (name, email, password, passwordConfirmation) => {
  return apiCall('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation })
  });
};

// Recipes endpoints
export const getRecipes = () => {
  return apiCall('/api/recipes');
};

export const getNutritionLogs = (token) => {
  return apiCall('/api/nutrition-logs', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
};

export const createNutritionLog = (token, logData) => {
  return apiCall('/api/nutrition-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(logData)
  });
};

// Products endpoints
export const getProducts = () => {
  return apiCall('/api/products');
};

export const createProduct = (token, productData) => {
  return apiCall('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
};

export const updateProduct = (token, productId, productData) => {
  return apiCall(`/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
};

export const deleteProduct = (token, productId) => {
  return apiCall(`/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Orders endpoints
export const getOrders = (token) => {
  return apiCall('/api/orders', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
};

export const createOrder = (token, orderData) => {
  return apiCall('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
};

