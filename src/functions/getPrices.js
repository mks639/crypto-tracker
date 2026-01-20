import axios from "axios";
import { validateCoinId, secureLog, apiRateLimiter } from '../utils/security';

export const getPrices = async (id, days, priceType, setError) => {
  // Validate inputs
  const validId = validateCoinId(id);
  if (!validId) {
    secureLog('error', 'Invalid coin ID provided', { id });
    if (setError) setError(true);
    return null;
  }

  // Rate limiting
  if (!apiRateLimiter.isAllowed(`getPrices_${validId}`)) {
    secureLog('warn', 'Rate limit exceeded for getPrices', { id: validId });
    if (setError) setError(true);
    return null;
  }

  const validDays = Math.min(Math.max(parseInt(days) || 7, 1), 365);
  const validPriceTypes = ['market_caps', 'total_volumes', 'prices'];
  const validPriceType = validPriceTypes.includes(priceType) ? priceType : 'prices';

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${validId}/market_chart?vs_currency=usd&days=${validDays}&interval=daily`,
      {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CryptoDashboard/1.0'
        }
      }
    );

    if (response.data) {
      secureLog('info', 'Successfully fetched price data', { id: validId, days: validDays });
      return response.data[validPriceType] || response.data.prices;
    }
  } catch (error) {
    secureLog('error', 'Failed to fetch price data', { 
      id: validId, 
      error: error.message,
      status: error.response?.status 
    });
    if (setError) {
      setError(true);
    }
  }

  return null;
};
