import { realtimeDb } from '../config/firebase';
import { ref, set, get, remove, push } from 'firebase/database';

// Save watchlist to Firebase
export const saveWatchlistToFirebase = async (userId, watchlist) => {
  if (!realtimeDb) return false;
  try {
    await set(ref(realtimeDb, `watchlists/${userId}`), watchlist);
    return true;
  } catch (error) {
    console.error('Error saving watchlist:', error);
    return false;
  }
};

// Get watchlist from Firebase
export const getWatchlistFromFirebase = async (userId) => {
  if (!realtimeDb) return [];
  try {
    const snapshot = await get(ref(realtimeDb, `watchlists/${userId}`));
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

// Add coin to watchlist
export const addCoinToWatchlist = async (userId, coin) => {
  if (!realtimeDb) return false;
  try {
    await push(ref(realtimeDb, `watchlists/${userId}`), coin);
    return true;
  } catch (error) {
    console.error('Error adding coin:', error);
    return false;
  }
};

// Remove coin from watchlist
export const removeCoinFromWatchlist = async (userId, coinId) => {
  if (!realtimeDb) return false;
  try {
    await remove(ref(realtimeDb, `watchlists/${userId}/${coinId}`));
    return true;
  } catch (error) {
    console.error('Error removing coin:', error);
    return false;
  }
};