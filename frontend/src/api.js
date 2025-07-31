const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Helper function to make authenticated requests
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Authentication APIs
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};

// Trek APIs
export const trekAPI = {
  getAllTreks: async () => {
    const response = await fetch(`${API_BASE_URL}/treks`);
    return response.json();
  },

  addTrek: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/treks`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      body: formData
    });
    return response.json();
  },

  getTrekById: async (trekId) => {
    const response = await fetch(`${API_BASE_URL}/treks/${trekId}`);
    return response.json();
  },

  addReview: async (trekId, formData) => {
    const response = await fetch(`${API_BASE_URL}/treks/${trekId}/reviews`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      body: formData
    });
    return response.json();
  },

  likeReview: async (trekId, reviewId) => {
    const response = await fetch(`${API_BASE_URL}/treks/${trekId}/reviews/${reviewId}/like`, {
      method: 'POST',
      headers: authHeaders()
    });
    return response.json();
  },

  addComment: async (trekId, reviewId, commentText) => {
    const response = await fetch(`${API_BASE_URL}/treks/${trekId}/reviews/${reviewId}/comments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ text: commentText })
    });
    return response.json();
  }
}; 