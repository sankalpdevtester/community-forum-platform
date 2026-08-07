/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This module provides a simple caching mechanism to reduce the number of requests to the API.
 */

const cache = new Map();

/**
 * Set a value in the cache with a TTL (time to live) in milliseconds.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const expiration = Date.now() + ttl;
  cache.set(key, { value, expiration });
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or undefined if not found or expired.
 */
function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return undefined;
  if (cached.expiration < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return cached.value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache.clear();
}

/**
 * Check if a key is cached.
 * @param {string} key - The cache key.
 * @returns {boolean} True if the key is cached, false otherwise.
 */
function isCached(key) {
  return cache.has(key);
}

// Example usage:
// Set a value in the cache with a TTL of 1 minute (60000 ms)
// setCache('api/posts', [{ id: 1, title: 'Post 1' }], 60000);

// Get a value from the cache
// const cachedPosts = getCache('api/posts');

// Clear the cache
// clearCache();

// Check if a key is cached
// const isPostsCached = isCached('api/posts');

// Export the cache utility functions
export { setCache, getCache, clearCache, isCached };

// Integrate with existing API endpoint files
// For example, in src/pages/api/posts/[id]/votes.js:
// import { getCache, setCache } from '../../utils/cache';

// const cachedVotes = getCache(`votes/${id}`);
// if (cachedVotes) {
//   return cachedVotes;
// }

// const votes = await getVotesFromDatabase(id);
// setCache(`votes/${id}`, votes, 30000); // Cache for 30 seconds
// return votes;