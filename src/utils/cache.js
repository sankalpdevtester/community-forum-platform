/**
 * In-memory cache utility with TTL (time to live) for API responses.
 * This cache is used to store frequently accessed data to reduce the number of requests to the database.
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
  cache[key] = { value, expiresAt: currentTime + ttl };
}

/**
 * Get a value from the cache.
 * @param {string} key - The key to retrieve the value for.
 * @returns {any} The cached value, or undefined if it does not exist or has expired.
 */
function getCache(key) {
  if (!cache[key]) return undefined;
  const { value, expiresAt } = cache[key];
  const currentTime = new Date().getTime();
  if (currentTime > expiresAt) {
    delete cache[key];
    return undefined;
  }
  return value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache = {};
}

/**
 * Check if a key exists in the cache.
 * @param {string} key - The key to check.
 * @returns {boolean} True if the key exists, false otherwise.
 */
function hasCache(key) {
  return !!cache[key];
}

/**
 * Get all keys in the cache.
 * @returns {string[]} An array of keys in the cache.
 */
function getCacheKeys() {
  return Object.keys(cache);
}

// Example usage:
// Set a value in the cache with a TTL of 1 minute
setCache('apiResponse', { data: 'example data' }, 60000);

// Get the value from the cache
const cachedValue = getCache('apiResponse');
console.log(cachedValue); // { data: 'example data' }

// Clear the cache
clearCache();

// Check if a key exists in the cache
const hasKey = hasCache('apiResponse');
console.log(hasKey); // false

// Get all keys in the cache
const keys = getCacheKeys();
console.log(keys); // []

// Integrate with existing files
// In src/pages/api/auth.js
import { getCache } from '../utils/cache';
import { NextApiRequest, NextApiResponse } from 'next';

const authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  const cachedResponse = getCache('authResponse');
  if (cachedResponse) {
    return res.json(cachedResponse);
  }
  // If not cached, authenticate and cache the response
  const response = await authenticateUser(req);
  setCache('authResponse', response, 30000); // Cache for 30 seconds
  return res.json(response);
};

// In src/features/Post.js
import { getCache } from '../utils/cache';

const getPost = async (postId) => {
  const cachedPost = getCache(`post_${postId}`);
  if (cachedPost) {
    return cachedPost;
  }
  // If not cached, fetch the post and cache it
  const post = await fetchPostFromDatabase(postId);
  setCache(`post_${postId}`, post, 60000); // Cache for 1 minute
  return post;
};