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

/**
 * Fetches user profile, problems solved, streak, and contest ranking details from LeetCode GraphQL.
 * @param {string} username - LeetCode username
 * @returns {Promise<Object>} User details
 */
export const fetchLeetCodeProfile = async (username) => {
  if (!username || !username.trim()) {
    throw new Error('Username is required');
  }

  const query = `
    query userDetails($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          userAvatar
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
          totalActiveDays
        }
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;

  const url = '/leetcode-graphql';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username: username.trim() }
    })
  });

  if (!response.ok) {
    throw new Error(`LeetCode server returned HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL Error from LeetCode');
  }

  if (!json.data || !json.data.matchedUser) {
    throw new Error('LeetCode username not found.');
  }

  const matchedUser = json.data.matchedUser;
  const contestRanking = json.data.userContestRanking;

  // Calculate top weakness dynamically
  const tagCounts = matchedUser.tagProblemCounts;
  let topWeakness = '—';
  if (tagCounts) {
    const allTags = [
      ...(tagCounts.advanced || []),
      ...(tagCounts.intermediate || [])
    ];
    const activeTags = allTags.filter(t => t.problemsSolved > 0);
    if (activeTags.length > 0) {
      activeTags.sort((a, b) => a.problemsSolved - b.problemsSolved);
      topWeakness = activeTags[0].tagName;
    }
  }

  const solvedNum = matchedUser.submitStatsGlobal?.acSubmissionNum?.find(
    (x) => x.difficulty === 'All'
  )?.count || 0;

  return {
    username: matchedUser.username,
    avatar: matchedUser.profile?.userAvatar || null,
    ranking: matchedUser.profile?.ranking || null,
    solved: solvedNum,
    streak: matchedUser.userCalendar?.streak || 0,
    globalRanking: contestRanking?.globalRanking || matchedUser.profile?.ranking || null,
    rating: contestRanking?.rating || null,
    topWeakness
  };
};

