/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This utility helps reduce the number of requests made to the API by caching frequently accessed data.
 */

const cache = {};

/**
 * Set a value in the cache with a TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const currentTime = Date.now();
  cache[key] = { value, expiresAt: currentTime + ttl };
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {any} The cached value or null if not found or expired.
 */
function getCache(key) {
  const cachedValue = cache[key];
  if (!cachedValue) return null;
  const currentTime = Date.now();
  if (currentTime > cachedValue.expiresAt) {
    delete cache[key];
    return null;
  }
  return cachedValue.value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache = {};
}

/**
 * Check if a key exists in the cache.
 * @param {string} key - The cache key.
 * @returns {boolean} True if the key exists, false otherwise.
 */
function hasCache(key) {
  return Object.prototype.hasOwnProperty.call(cache, key);
}

/**
 * Get all cache keys.
 * @returns {string[]} An array of cache keys.
 */
function getCacheKeys() {
  return Object.keys(cache);
}

/**
 * Remove a key from the cache.
 * @param {string} key - The cache key.
 */
function removeCache(key) {
  delete cache[key];
}

// Example usage:
// Set a value in the cache with a TTL of 1 minute
setCache('api/posts', [{ id: 1, title: 'Post 1' }], 60000);

// Get a value from the cache
const cachedPosts = getCache('api/posts');
if (cachedPosts) {
  console.log(cachedPosts); // Output: [{ id: 1, title: 'Post 1' }]
} else {
  console.log('Cache not found or expired');
}

// Clear the cache
clearCache();

// Check if a key exists in the cache
if (hasCache('api/posts')) {
  console.log('Key exists in cache');
} else {
  console.log('Key does not exist in cache');
}

// Get all cache keys
const cacheKeys = getCacheKeys();
console.log(cacheKeys); // Output: []

// Remove a key from the cache
removeCache('api/posts');

// Export the cache utility functions
export { setCache, getCache, clearCache, hasCache, getCacheKeys, removeCache };