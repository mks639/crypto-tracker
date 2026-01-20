import { useEffect } from 'react';
import { getWatchlistFromFirebase, saveWatchlistToFirebase } from '../services/firebaseService';

export const useFirebaseSync = (userId = 'guest') => {
  useEffect(() => {
    const syncWatchlist = async () => {
      try {
        const firebaseWatchlist = await getWatchlistFromFirebase(userId);
        let localWatchlist = [];
        if (typeof window !== 'undefined' && window.localStorage) {
          localWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        }
        
        if (firebaseWatchlist.length > 0 && localWatchlist.length === 0) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('watchlist', JSON.stringify(firebaseWatchlist));
          }
        } else if (localWatchlist.length > 0) {
          await saveWatchlistToFirebase(userId, localWatchlist);
        }
      } catch (error) {
        console.error('Firebase sync error:', error);
      }
    };

    syncWatchlist();
  }, [userId]);
};