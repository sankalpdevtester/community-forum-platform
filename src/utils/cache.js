/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This utility helps reduce the number of requests made to the API by caching frequently accessed data.
 */

const cache = {};

/**
 * Set a value in the cache with a TTL (time to live) in milliseconds.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const now = Date.now();
  cache[key] = { value, expires: now + ttl };
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  const now = Date.now();
  if (cache[key] && cache[key].expires > now) {
    return cache[key].value;
  }
  delete cache[key];
  return null;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache = {};
}

/**
 * Check if a value is cached.
 * @param {string} key - The cache key.
 * @returns {boolean} True if the value is cached, false otherwise.
 */
function isCached(key) {
  const now = Date.now();
  return cache[key] && cache[key].expires > now;
}

// Example usage:
// Cache a post for 1 hour (3600000 ms)
// setCache('post:123', { id: 123, title: 'Example Post' }, 3600000);

// Get a cached post
// const cachedPost = getCache('post:123');

// Clear the cache
// clearCache();

// Check if a post is cached
// const isPostCached = isCached('post:123');

// Export the cache utility functions
export { setCache, getCache, clearCache, isCached };

// Integrate with existing files
// In src/pages/api/posts/[id]/votes.js
import { setCache, getCache } from '../../utils/cache';

// Cache the votes for a post
const cacheKey = `post:${id}:votes`;
const cachedVotes = getCache(cacheKey);
if (!cachedVotes) {
  const votes = await getVotesFromDatabase(id);
  setCache(cacheKey, votes, 3600000); // Cache for 1 hour
  return votes;
}
return cachedVotes;

// In src/pages/PostPage.js
import { isCached } from '../../utils/cache';

// Check if the post is cached before making a request
const cacheKey = `post:${id}`;
if (isCached(cacheKey)) {
  // Use the cached post
} else {
  // Make a request to the API to fetch the post
}