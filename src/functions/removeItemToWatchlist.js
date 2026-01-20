import { toast } from "react-toastify";
import { saveWatchlistToFirebase } from '../services/firebaseService';

export const removeItemToWatchlist = async (e, id, setIsCoinAdded, userId = 'guest') => {
  e.preventDefault();
  if (typeof window !== 'undefined' && window.confirm("Are you sure you want to remove this coin?")) {
    let watchlist = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    }
    const newList = watchlist.filter((coin) => coin !== id);
    setIsCoinAdded(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem("watchlist", JSON.stringify(newList));
    }
    await saveWatchlistToFirebase(userId, newList);
    toast.success(
      `${
        id.substring(0, 1).toUpperCase() + id.substring(1)
      } - has been removed!`
    );
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } else {
    toast.error(
      `${
        id.substring(0, 1).toUpperCase() + id.substring(1)
      } - could not be removed!`
    );
    setIsCoinAdded(true);
  }
};
