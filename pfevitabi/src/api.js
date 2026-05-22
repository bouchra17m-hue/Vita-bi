// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
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

