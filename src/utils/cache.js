/**
 * In-memory cache utility with TTL for API responses.
 * 
 * This utility helps reduce the number of requests made to the API by caching responses
 * for a specified amount of time.
 */

const cache = {};

/**
 * Set a value in the cache with a TTL.
 * 
 * @param {string} key - The key to set in the cache.
 * @param {any} value - The value to set in the cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const currentTime = new Date().getTime();
  cache[key] = { value, expires: currentTime + ttl };
}

/**
 * Get a value from the cache.
 * 
 * @param {string} key - The key to get from the cache.
 * @returns {any} The cached value or null if it doesn't exist or has expired.
 */
function getCache(key) {
  if (!cache[key]) return null;
  const currentTime = new Date().getTime();
  if (cache[key].expires < currentTime) {
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
 * Check if a key exists in the cache.
 * 
 * @param {string} key - The key to check.
 * @returns {boolean} True if the key exists in the cache, false otherwise.
 */
function hasCache(key) {
  return cache[key] !== undefined;
}

/**
 * Get the expiration time of a cached value.
 * 
 * @param {string} key - The key to get the expiration time for.
 * @returns {number} The expiration time in milliseconds or null if it doesn't exist.
 */
function getCacheExpiration(key) {
  if (!cache[key]) return null;
  return cache[key].expires;
}

// Example usage:
// Set a value in the cache with a TTL of 1 minute
// setCache('apiResponse', { data: 'example data' }, 60000);

// Get a value from the cache
// const cachedValue = getCache('apiResponse');

// Clear the cache
// clearCache();

// Check if a key exists in the cache
// const hasKey = hasCache('apiResponse');

// Get the expiration time of a cached value
// const expirationTime = getCacheExpiration('apiResponse');

// Export the cache utility functions
export { setCache, getCache, clearCache, hasCache, getCacheExpiration };

// Integrate with existing files
// In src/pages/api/auth.js, use the cache utility to cache API responses
// import { setCache, getCache } from '../utils/cache';
// ...
// const cachedResponse = getCache('apiResponse');
// if (cachedResponse) {
//   return cachedResponse;
// } else {
//   const response = await fetch('https://example.com/api/data');
//   const data = await response.json();
//   setCache('apiResponse', data, 60000);
//   return data;
// }