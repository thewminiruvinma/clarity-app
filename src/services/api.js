const API_BASE_URL = 'http://localhost:5000/api';

export const fetchJournalEntries = async (token) => {
  const response = await fetch(`${API_BASE_URL}/journal/entries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch entries');
  return response.json();
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
  if (!response.ok) throw new Error('Failed to save entry');
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
  if (!response.ok) throw new Error('Failed to submit reflection');
  return response.json();
};