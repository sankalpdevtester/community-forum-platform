/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This module provides a simple caching mechanism to reduce the number of API requests.
 */

const cache = new Map();

/**
 * Set a value in the cache with a TTL (time to live) in milliseconds.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const currentTime = Date.now();
  const expirationTime = currentTime + ttl;
  cache.set(key, { value, expirationTime });
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  const cachedValue = cache.get(key);
  if (!cachedValue) return null;
  const currentTime = Date.now();
  if (currentTime > cachedValue.expirationTime) {
    cache.delete(key);
    return null;
  }
  return cachedValue.value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache.clear();
}

/**
 * Cache API responses for a specified amount of time.
 * @param {string} url - The API URL.
 * @param {object} options - The API request options.
 * @param {number} ttl - The time to live in milliseconds.
 * @returns {Promise<any>} The cached or fetched API response.
 */
async function cacheApiResponse(url, options, ttl) {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  const cachedResponse = getCache(cacheKey);
  if (cachedResponse) return cachedResponse;
  const response = await fetch(url, options);
  const data = await response.json();
  setCache(cacheKey, data, ttl);
  return data;
}

// Example usage:
// cacheApiResponse('/api/posts', { method: 'GET' }, 60000) // cache for 1 minute

// Export the cache utility functions
export { setCache, getCache, clearCache, cacheApiResponse };