import axios from "axios";
import { secureLog, apiRateLimiter } from '../utils/security';

export const get100Coins = async () => {
  if (!apiRateLimiter.isAllowed('get100Coins')) {
    secureLog('warn', 'Rate limit exceeded for get100Coins');
    return null;
  }

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CryptoDashboard/1.0'
        }
      }
    );
    
    if (response.data && Array.isArray(response.data)) {
      secureLog('info', 'Successfully fetched 100 coins data');
      return response.data;
    }
    return [];
  } catch (error) {
    secureLog('error', 'Failed to fetch 100 coins', { 
      error: error.message,
      status: error.response?.status 
    });
    return null;
  }
};
