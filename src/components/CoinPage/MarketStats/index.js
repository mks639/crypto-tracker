import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, ShowChart, AccountBalance } from '@mui/icons-material';

const MarketStats = ({ coin }) => {
  const formatNumber = (num) => {
    if (!num || num === 0) return '$0.00';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num?.toLocaleString() || '0.00'}`;
  };

  if (!coin) {
    return null;
  }

  const marketData = coin.market_data || {};
  
  const stats = [
    {
      label: 'Market Rank',
      value: `#${marketData.market_cap_rank || coin.market_cap_rank || 'N/A'}`,
      icon: <ShowChart />,
      color: 'primary'
    },
    {
      label: '24h High',
      value: formatNumber(marketData.high_24h?.usd || coin.high_24h || coin.current_price),
      icon: <TrendingUp />,
      color: 'success'
    },
    {
      label: '24h Low',
      value: formatNumber(marketData.low_24h?.usd || coin.low_24h || coin.current_price),
      icon: <TrendingDown />,
      color: 'error'
    },
    {
      label: 'All Time High',
      value: formatNumber(marketData.ath?.usd || coin.ath || coin.current_price),
      icon: <AccountBalance />,
      color: 'warning'
    }
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, backgroundColor: 'background.paper', height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
        Market Statistics
      </Typography>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(58, 128, 233, 0.05)',
                border: '1px solid rgba(58, 128, 233, 0.1)'
              }}
            >
              <Box sx={{ color: `${stat.color}.main`, mr: 2 }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default MarketStats;