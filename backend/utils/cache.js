const NodeCache = require('node-cache');

// Standard TTL of 5 minutes for cached API responses.
// We also use `deleteOnExpire: true`.
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const getCacheKey = (req) => {
  return `${req.originalUrl || req.url}`;
};

const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  const key = getCacheKey(req);
  const cachedResponse = apiCache.get(key);
  
  if (cachedResponse) {
    return res.json(cachedResponse);
  }
  
  // Override res.json to cache the response before sending it
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    // We only cache successful responses (e.g. not errors, assuming standard status codes if handled)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      apiCache.set(key, body);
    }
    return originalJson(body);
  };
  
  next();
};

const clearCache = (pattern) => {
  // node-cache doesn't have native wildcard deletion, so we iterate
  const keys = apiCache.keys();
  if (!pattern) {
    apiCache.flushAll();
    return;
  }
  
  const keysToDelete = keys.filter(key => key.includes(pattern));
  apiCache.del(keysToDelete);
};

module.exports = {
  apiCache,
  cacheMiddleware,
  clearCache
};
