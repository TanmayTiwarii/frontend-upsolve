export const PROBLEMS_POOL = [
  { id: 146, problem_name: 'LRU Cache', difficulty: 'Hard', topics: 'Hash Table, Linked List, Design' },
  { id: 1, problem_name: 'Two Sum', difficulty: 'Easy', topics: 'Array, Hash Table' },
  { id: 3, problem_name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topics: 'String, Sliding Window' },
  { id: 11, problem_name: 'Container With Most Water', difficulty: 'Medium', topics: 'Greedy, Two Pointers' },
  { id: 23, problem_name: 'Merge k Sorted Lists', difficulty: 'Hard', topics: 'Heap, Divide & Conquer' },
  { id: 15, problem_name: '3Sum', difficulty: 'Medium', topics: 'Array, Two Pointers' },
  { id: 20, problem_name: 'Valid Parentheses', difficulty: 'Easy', topics: 'String, Stack' },
  { id: 21, problem_name: 'Merge Two Sorted Lists', difficulty: 'Easy', topics: 'Linked List' },
  { id: 33, problem_name: 'Search in Rotated Sorted Array', difficulty: 'Medium', topics: 'Array, Binary Search' },
  { id: 42, problem_name: 'Trapping Rain Water', difficulty: 'Hard', topics: 'Array, Two Pointers, Stack' },
  { id: 46, problem_name: 'Permutations', difficulty: 'Medium', topics: 'Backtracking' },
  { id: 49, problem_name: 'Group Anagrams', difficulty: 'Medium', topics: 'Array, Hash Table, String' },
  { id: 53, problem_name: 'Maximum Subarray', difficulty: 'Medium', topics: 'Array, Divide and Conquer, DP' },
  { id: 56, problem_name: 'Merge Intervals', difficulty: 'Medium', topics: 'Array, Sorting' },
  { id: 76, problem_name: 'Minimum Window Substring', difficulty: 'Hard', topics: 'String, Sliding Window' },
  { id: 121, problem_name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topics: 'Array, DP' },
  { id: 141, problem_name: 'Linked List Cycle', difficulty: 'Easy', topics: 'Linked List, Two Pointers' },
  { id: 200, problem_name: 'Number of Islands', difficulty: 'Medium', topics: 'Array, DFS, BFS, Union Find' },
  { id: 206, problem_name: 'Reverse Linked List', difficulty: 'Easy', topics: 'Linked List' },
  { id: 238, problem_name: 'Product of Array Except Self', difficulty: 'Medium', topics: 'Array, Prefix Sum' },
  { id: 295, problem_name: 'Find Median from Data Stream', difficulty: 'Hard', topics: 'Heap, Design' },
  { id: 322, problem_name: 'Coin Change', difficulty: 'Medium', topics: 'DP, BFS' },
  { id: 416, problem_name: 'Partition Equal Subset Sum', difficulty: 'Medium', topics: 'DP' },
  { id: 560, problem_name: 'Subarray Sum Equals K', difficulty: 'Medium', topics: 'Array, Prefix Sum, Hash Table' },
  { id: 704, problem_name: 'Binary Search', difficulty: 'Easy', topics: 'Array, Binary Search' }
];

// Seeded random number generator
function xfc32(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function getSeedFromDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = Math.imul(31, hash) + dateStr.charCodeAt(i) | 0;
  }
  return hash;
}

export function getDailyProblems() {
  const dateStr = new Date().toISOString().split('T')[0];
  const seed = getSeedFromDate(dateStr);
  const rand = xfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);

  // Fisher-Yates shuffle with seeded random
  const pool = [...PROBLEMS_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  return pool.slice(0, 5).map(p => ({ ...p, similarity: null }));
}
