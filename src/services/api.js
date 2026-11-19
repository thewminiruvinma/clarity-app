const API_BASE_URL = 'http://localhost:5000/api';

// --- Authentication APIs ---

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to login');
  }
  return response.json();
};

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to register');
  }
  return response.json();
};

// Update user profile API call
export async function updateUserProfile(profileData, token) {
  const response = await fetch('http://localhost:5000/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update profile');
  return data;
}

// --- Journal & Reflection APIs ---

export const fetchJournalEntries = async (token) => {
  const response = await fetch(`${API_BASE_URL}/journal/entries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch entries');
  }
  const data = await response.json();
  
  // Return entries array directly so AppContext gets the array instead of an object wrapper
  return data.entries || data;
};

export const createJournalEntry = async (rawText, token) => {
  const response = await fetch(`${API_BASE_URL}/journal/entries`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save entry');
  }
  return response.json();
};

export const submitReflectionResponse = async (reflectionId, userResponse, token) => {
  const response = await fetch(`${API_BASE_URL}/journal/reflections`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reflectionId, userResponse }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit reflection');
  }
  return response.json();
};