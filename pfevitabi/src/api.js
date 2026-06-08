const API_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.replace(/\/$/, '');
  }
  if (import.meta.env.PROD) {
    return '';
  }
  return 'http://127.0.0.1:8000';
})();

const IS_PRODUCTION = import.meta.env.PROD;

export const getApiUrl = () => API_URL;

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    const displayUrl = API_URL || 'API serveur';
    throw new Error(
      `Impossible de joindre le serveur (${displayUrl}). ` +
      `Vérifiez votre connexion. ` +
      `Détail: ${error.message}`
    );
  }

  if (!response.ok) {
    let message = `Erreur API: ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
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
    throw new Error(message);
  }

  return response.json();
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
