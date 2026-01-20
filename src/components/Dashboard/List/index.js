import React, { useState } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { convertNumber } from "../../../functions/convertNumber";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import StarIcon from "@mui/icons-material/Star";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";
import { useAuth } from "../../../auth/AuthContext";

const formatMarketCap = (num) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num?.toFixed(0)}`;
};

function List({ coin, delay }) {
  const { user, addToFavorites, removeFromFavorites } = useAuth();
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const [isCoinAdded, setIsCoinAdded] = useState(watchlist?.includes(coin?.id));
  const [isFavorite, setIsFavorite] = useState(
    user?.profile?.favoriteCoins?.includes(coin?.id) || false
  );
  
  if (!coin || !coin.id) {
    return null;
  }

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Show login modal or redirect to login
      return;
    }
    
    if (isFavorite) {
      await removeFromFavorites(coin.id);
      setIsFavorite(false);
    } else {
      await addToFavorites(coin.id);
      setIsFavorite(true);
    }
  };
  return (
    <a href={`/coin/${coin.id}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <Tooltip title="Coin Image">
          <td className="td-img">
            <img src={coin.image || '/placeholder-coin.png'} className="coin-image coin-image-td" alt={coin.name || 'Coin'} />
          </td>
        </Tooltip>
        <Tooltip title="Coin Info" placement="bottom-start">
          <td className="td-info">
            <div className="info-flex">
              <p className="coin-symbol td-p">{coin.symbol?.toUpperCase() || 'N/A'}</p>
              <p className="coin-name td-p">{coin.name || 'Unknown'}</p>
            </div>
          </td>
        </Tooltip>
        <Tooltip
          title="Coin Price Percentage In 24hrs"
          placement="bottom-start"
        >
          {(coin.price_change_percentage_24h || 0) >= 0 ? (
            <td>
              <div className="chip-flex">
                <div className="price-chip">
                  {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                </div>
                <div className="chip-icon td-chip-icon">
                  <TrendingUpRoundedIcon />
                </div>
              </div>
            </td>
          ) : (
            <td>
              <div className="chip-flex">
                <div className="price-chip red">
                  {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                </div>
                <div className="chip-icon td-chip-icon red">
                  <TrendingDownRoundedIcon />
                </div>
              </div>
            </td>
          )}
        </Tooltip>
        <Tooltip title="Coin Price In USD" placement="bottom-end">
          {(coin.price_change_percentage_24h || 0) >= 0 ? (
            <td className="current-price  td-current-price">
              ${(coin.current_price || 0).toLocaleString()}
            </td>
          ) : (
            <td className="current-price-red td-current-price">
              ${(coin.current_price || 0).toLocaleString()}
            </td>
          )}
        </Tooltip>
        <Tooltip title="Coin Total Volume" placement="bottom-end">
          <td className="coin-name td-totalVolume">
            {formatMarketCap(coin.total_volume || 0)}
          </td>
        </Tooltip>
        <Tooltip title="Coin Market Capital" placement="bottom-end">
          <td className="coin-name td-marketCap">
            {formatMarketCap(coin.market_cap || 0)}
          </td>
        </Tooltip>
        <td className="coin-name mobile">{formatMarketCap(coin.market_cap || 0)}</td>
        <td
          className={`watchlist-icon ${
            coin.price_change_percentage_24h < 0 && "watchlist-icon-red"
          }`}
          onClick={handleFavoriteToggle}
          style={{ cursor: 'pointer' }}
        >
          {isFavorite ? <StarIcon /> : <StarOutlineIcon />}
        </td>
      </motion.tr>
    </a>
  );
}

export default List;
