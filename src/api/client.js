const API_URL = import.meta.env.VITE_API_URL || 'https://ml-backend-leetcodehelper.onrender.com/recommend';

/**
 * Fetches recommendations from the backend for the given username.
 * @param {'similar' | 'different'} type - Recommendation type
 * @param {string} username - LeetCode username
 * @returns {Promise<Array>} Recommended problems
 */
export const fetchRecommendations = async (type, username) => {
  if (!username || !username.trim()) {
    throw new Error('Username is required');
  }

  const endpoint = type === 'similar' ? 'similar' : 'diff';
  const url = `${API_URL.replace(/\/$/, '')}/${endpoint}?username=${encodeURIComponent(username.trim())}`;

  console.log(`[Upsolve API] Fetching: ${url}`);

  let data;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }
    data = await response.json();
  } catch (error) {
    console.error('[Upsolve API] Request failed:', error);
    throw new Error(
      `API Connection Failed: ${error.message}. Make sure the backend server at ${API_URL} is online and CORS is enabled.`
    );
  }

  // Handle application-level errors returned by the backend
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.error) {
      throw new Error(data.error);
    }
    throw new Error('Unexpected response format from the server.');
  }

  return data;
};
