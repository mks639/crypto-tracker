// Security utilities for sanitization and validation

/**
 * Sanitizes user input to prevent log injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[\r\n\t]/g, '') // Remove line breaks and tabs
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Validates and sanitizes coin ID
 * @param {string} coinId - Coin ID to validate
 * @returns {string|null} - Valid coin ID or null
 */
export const validateCoinId = (coinId) => {
  if (!coinId || typeof coinId !== 'string') return null;
  
  // Only allow alphanumeric characters, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(coinId) || coinId.length > 50) {
    return null;
  }
  
  return coinId.toLowerCase();
};

/**
 * Rate limiting utility
 */
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key);
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
}

export const apiRateLimiter = new RateLimiter(30, 60000); // 30 requests per minute

/**
 * Content Security Policy headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.coingecko.com; " +
    "frame-ancestors 'none';"
};

/**
 * Secure logging function
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
export const secureLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const sanitizedMessage = sanitizeInput(message);
  
  const logEntry = {
    timestamp,
    level,
    message: sanitizedMessage,
    ...(data && { data: typeof data === 'string' ? sanitizeInput(data) : data })
  };
  
  console[level](JSON.stringify(logEntry));
};