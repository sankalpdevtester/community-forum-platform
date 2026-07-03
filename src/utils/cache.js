/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This cache will store API responses in memory for a specified amount of time,
 * reducing the number of requests made to the API and improving performance.
 */

const cache = {};

/**
 * Set a value in the cache with a TTL.
 * @param {string} key - The key to store the value under.
 * @param {any} value - The value to store.
 * @param {number} ttl - The time to live in milliseconds.
 */
function setCache(key, value, ttl) {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + ttl;
  cache[key] = { value, expirationTime };
}

/**
 * Get a value from the cache.
 * @param {string} key - The key to retrieve the value for.
 * @returns {any} The cached value, or null if it does not exist or has expired.
 */
function getCache(key) {
  if (!cache[key]) {
    return null;
  }
  const currentTime = new Date().getTime();
  if (cache[key].expirationTime < currentTime) {
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
 * Check if a value exists in the cache.
 * @param {string} key - The key to check for.
 * @returns {boolean} True if the key exists in the cache, false otherwise.
 */
function hasCache(key) {
  return cache[key] !== undefined;
}

/**
 * Get the expiration time for a cached value.
 * @param {string} key - The key to retrieve the expiration time for.
 * @returns {number} The expiration time in milliseconds, or null if the key does not exist.
 */
function getExpirationTime(key) {
  if (!cache[key]) {
    return null;
  }
  return cache[key].expirationTime;
}

// Example usage:
// Set a value in the cache with a TTL of 1 minute
// setCache('apiResponse', 'Hello World!', 60000);

// Get the value from the cache
// const cachedValue = getCache('apiResponse');
// console.log(cachedValue); // Output: Hello World!

// Clear the cache
// clearCache();

// Check if a value exists in the cache
// const hasValue = hasCache('apiResponse');
// console.log(hasValue); // Output: true

// Get the expiration time for a cached value
// const expirationTime = getExpirationTime('apiResponse');
// console.log(expirationTime); // Output: 1643723400000

// Export the cache utility functions
export { setCache, getCache, clearCache, hasCache, getExpirationTime };

// Integrate with existing API endpoint files
// For example, in src/pages/api/posts/[id]/votes.js:
// import { getCache, setCache } from '../utils/cache';
// const cachedVotes = getCache(`votes-${id}`);
// if (cachedVotes) {
//   return cachedVotes;
// }
// const votes = await getVotesFromDatabase(id);
// setCache(`votes-${id}`, votes, 30000); // Cache for 30 seconds
// return votes;