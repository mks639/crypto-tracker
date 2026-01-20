import React from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { CompareArrows } from '@mui/icons-material';

const ComparisonStats = ({ coin1, coin2 }) => {
  const formatNumber = (num) => {
    if (!num || num === 0) return '$0.00';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num?.toLocaleString() || '0.00'}`;
  };

  const getWinner = (val1, val2, higherIsBetter = true) => {
    if (!val1 && !val2) return 'tie';
    if (!val1) return 'coin2';
    if (!val2) return 'coin1';
    return higherIsBetter ? (val1 > val2 ? 'coin1' : 'coin2') : (val1 < val2 ? 'coin1' : 'coin2');
  };

  if (!coin1 || !coin2) {
    return null;
  }

  const market1 = coin1.market_data || {};
  const market2 = coin2.market_data || {};
  
  const comparisons = [
    {
      label: 'Market Cap',
      coin1Value: formatNumber(market1.market_cap?.usd || coin1.market_cap || 0),
      coin2Value: formatNumber(market2.market_cap?.usd || coin2.market_cap || 0),
      winner: getWinner(market1.market_cap?.usd || coin1.market_cap, market2.market_cap?.usd || coin2.market_cap)
    },
    {
      label: '24h Volume',
      coin1Value: formatNumber(market1.total_volume?.usd || coin1.total_volume || 0),
      coin2Value: formatNumber(market2.total_volume?.usd || coin2.total_volume || 0),
      winner: getWinner(market1.total_volume?.usd || coin1.total_volume, market2.total_volume?.usd || coin2.total_volume)
    },
    {
      label: 'Market Rank',
      coin1Value: `#${market1.market_cap_rank || coin1.market_cap_rank || 'N/A'}`,
      coin2Value: `#${market2.market_cap_rank || coin2.market_cap_rank || 'N/A'}`,
      winner: getWinner(market1.market_cap_rank || coin1.market_cap_rank, market2.market_cap_rank || coin2.market_cap_rank, false)
    },
    {
      label: '24h Change',
      coin1Value: `${(market1.price_change_percentage_24h || coin1.price_change_percentage_24h || 0).toFixed(2)}%`,
      coin2Value: `${(market2.price_change_percentage_24h || coin2.price_change_percentage_24h || 0).toFixed(2)}%`,
      winner: getWinner(market1.price_change_percentage_24h || coin1.price_change_percentage_24h, market2.price_change_percentage_24h || coin2.price_change_percentage_24h)
    }
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, backgroundColor: 'background.paper', height: 'fit-content' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CompareArrows sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" sx={{ color: 'primary.main' }}>
          Head-to-Head
        </Typography>
      </Box>
      
      {comparisons.map((comp, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {comp.label}
          </Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Chip
                label={comp.coin1Value}
                size="small"
                color={comp.winner === 'coin1' ? 'success' : 'default'}
                variant={comp.winner === 'coin1' ? 'filled' : 'outlined'}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">VS</Typography>
            </Grid>
            <Grid item xs={5}>
              <Chip
                label={comp.coin2Value}
                size="small"
                color={comp.winner === 'coin2' ? 'success' : 'default'}
                variant={comp.winner === 'coin2' ? 'filled' : 'outlined'}
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default ComparisonStats;