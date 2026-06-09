/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This utility helps reduce the number of requests to the API by caching frequently accessed data.
 */

const cache = {};

/**
 * Set a value in the cache with a TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const currentTime = new Date().getTime();
  cache[key] = { value, expiresAt: currentTime + ttl };
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  if (!cache[key]) return null;
  const currentTime = new Date().getTime();
  if (cache[key].expiresAt < currentTime) {
    delete cache[key];
    return null;
  }
  return cache[key].value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache = {};
}

/**
 * Invalidate a cache entry by key.
 * @param {string} key - The cache key to invalidate.
 */
function invalidateCache(key) {
  delete cache[key];
}

// Example usage:
// Set a cache entry with a TTL of 1 minute
// setCache('api/posts', [{ id: 1, title: 'Post 1' }], 60000);

// Get a cache entry
// const cachedPosts = getCache('api/posts');

// Clear the entire cache
// clearCache();

// Invalidate a specific cache entry
// invalidateCache('api/posts');

// Export the cache utility functions
export { setCache, getCache, clearCache, invalidateCache };

// Integrate with existing files
// In src/pages/api/auth.js, use the cache utility to cache API responses
// import { setCache, getCache } from '../utils/cache';
// ...
// const cachedResponse = getCache('api/auth');
// if (cachedResponse) return cachedResponse;
// const response = await fetch('https://example.com/api/auth');
// setCache('api/auth', response, 30000);
// return response;

// In src/features/Post.js, use the cache utility to cache post data
// import { getCache, setCache } from '../utils/cache';
// ...
// const cachedPosts = getCache('api/posts');
// if (cachedPosts) return cachedPosts;
// const response = await fetch('https://example.com/api/posts');
// setCache('api/posts', response, 60000);
// return response;

// In src/models/User.js, use the cache utility to cache user data
// import { getCache, setCache } from '../utils/cache';
// ...
// const cachedUser = getCache(`api/users/${userId}`);
// if (cachedUser) return cachedUser;
// const response = await fetch(`https://example.com/api/users/${userId}`);
// setCache(`api/users/${userId}`, response, 30000);
// return response;