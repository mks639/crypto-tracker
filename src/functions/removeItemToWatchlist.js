import { toast } from "react-toastify";
import { saveWatchlistToFirebase } from '../services/firebaseService';

export const removeItemToWatchlist = async (e, id, setIsCoinAdded, userId = 'guest') => {
  e.preventDefault();
  if (window.confirm("Are you sure you want to remove this coin?")) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist"));
    const newList = watchlist.filter((coin) => coin !== id);
    setIsCoinAdded(false);
    localStorage.setItem("watchlist", JSON.stringify(newList));
    await saveWatchlistToFirebase(userId, newList);
    toast.success(
      `${
        id.substring(0, 1).toUpperCase() + id.substring(1)
      } - has been removed!`
    );
    window.location.reload();
  } else {
    toast.error(
      `${
        id.substring(0, 1).toUpperCase() + id.substring(1)
      } - could not be removed!`
    );
    setIsCoinAdded(true);
  }
};
