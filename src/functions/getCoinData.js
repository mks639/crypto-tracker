import axios from "axios";
import { validateCoinId, secureLog, apiRateLimiter } from '../utils/security';

export const getCoinData = async (id, setError) => {
  const validId = validateCoinId(id);
  if (!validId) {
    secureLog('error', 'Invalid coin ID provided', { id });
    if (setError) setError(true);
    return null;
  }

  if (!apiRateLimiter.isAllowed(`getCoinData_${validId}`)) {
    secureLog('warn', 'Rate limit exceeded for getCoinData', { id: validId });
    if (setError) setError(true);
    return null;
  }

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${validId}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoDashboard/1.0'
      }
    });
    
    if (response.data) {
      secureLog('info', 'Successfully fetched coin data', { id: validId });
      return response.data;
    }
    return null;
  } catch (error) {
    secureLog('error', 'Failed to fetch coin data', { 
      id: validId, 
      error: error.message,
      status: error.response?.status 
    });
    if (setError) {
      setError(true);
    }
    return null;
  }
};
