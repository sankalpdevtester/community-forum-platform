/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This module provides a simple caching mechanism to reduce the number of API requests.
 */

const cache = new Map();

/**
 * Set a value in the cache with a TTL.
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
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (cached.expiration < Date.now()) {
    cache.delete(key);
    return null;
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
// Set a cache value with a 1-minute TTL
// setCache('api/posts', [{ id: 1, title: 'Post 1' }], 60000);

// Get a cache value
// const cachedPosts = getCache('api/posts');

// Clear the cache
// clearCache();

// Check if a key is cached
// const isPostsCached = isCached('api/posts');

// Export the cache utility functions
export { setCache, getCache, clearCache, isCached };

// Integrate with existing files
// In src/pages/api/auth.js, use the cache utility to cache API responses
// import { setCache, getCache } from '../utils/cache';
// ...
// const cachedResponse = getCache('api/auth');
// if (cachedResponse) {
//   return cachedResponse;
// }
// const response = await fetch('https://api.example.com/auth');
// setCache('api/auth', response, 30000);
// return response;

// In src/features/Post.js, use the cache utility to cache post data
// import { setCache, getCache } from '../utils/cache';
// ...
// const cachedPosts = getCache('api/posts');
// if (cachedPosts) {
//   return cachedPosts;
// }
// const posts = await fetch('https://api.example.com/posts');
// setCache('api/posts', posts, 60000);
// return posts;