import { toast } from "react-toastify";
import { saveWatchlistToFirebase } from '../services/firebaseService';

export const saveItemToWatchlist = async (e, id, userId = 'guest') => {
  e.preventDefault();
  let watchlist = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  }

  if (watchlist) {
    if (!watchlist.includes(id)) {
      watchlist.push(id);
      toast.success(
        `${
          id.substring(0, 1).toUpperCase() + id.substring(1)
        } - added to the watchlist`
      );
    } else {
      toast.error(
        `${
          id.substring(0, 1).toUpperCase() + id.substring(1)
        } - is already added to the watchlist!`
      );
      return;
    }
  } else {
    watchlist = [id];
    toast.success(
      `${
        id.substring(0, 1).toUpperCase() + id.substring(1)
      } - added to the watchlist`
    );
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
  await saveWatchlistToFirebase(userId, watchlist);
};
