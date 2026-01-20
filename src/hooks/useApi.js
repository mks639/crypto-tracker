import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Custom hook for API calls with caching, retry logic, and error handling
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    cache = true, 
    retries = 3, 
    retryDelay = 1000,
    // dependencies = [] 
  } = options;

  // Cache implementation
  const cacheKey = `api_${url}`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cache && typeof window !== 'undefined' && window.localStorage) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setData(cachedData);
          return;
        }
      }
    }

    setLoading(true);
    setError(null);

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const responseData = response.data;
        setData(responseData);
        // Cache the response
        if (cache && typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: responseData,
            timestamp: Date.now()
          }));
        }
        setLoading(false);
        return;
      } catch (err) {
        if (attempt >= retries - 1) {
          setError(err.message || 'API request failed');
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
  }, [url, cache, retries, retryDelay, cacheKey, CACHE_DURATION]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, fetchData, CACHE_DURATION]);

  const refetch = useCallback(() => {
    if (cache && typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(cacheKey);
    }
    fetchData();
  }, [fetchData, cache, cacheKey]);

  return { data, loading, error, refetch };
};