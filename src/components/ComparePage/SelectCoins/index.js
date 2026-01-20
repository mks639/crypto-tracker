import { MenuItem, Select, FormControl, InputLabel, Grid, Box } from "@mui/material";
import React from "react";
import SelectDays from "../../CoinPage/SelectDays";
import "./styles.css";

function SelectCoins({
  allCoins,
  crypto1,
  crypto2,
  onCoinChange,
  days,
  handleDaysChange,
}) {
  const selectStyle = {
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: 'primary.main',
      },
    },
    '& .MuiSvgIcon-root': {
      color: 'white',
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={selectStyle}>
            <InputLabel>First Cryptocurrency</InputLabel>
            <Select
              value={crypto1}
              onChange={(e) => onCoinChange(e, false)}
              label="First Cryptocurrency"
            >
              {allCoins
                .filter((coin) => coin.id !== crypto2)
                .map((coin) => (
                  <MenuItem value={coin.id} key={coin.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      />
                      {coin.name} ({coin.symbol?.toUpperCase()})
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={selectStyle}>
            <InputLabel>Second Cryptocurrency</InputLabel>
            <Select
              value={crypto2}
              onChange={(e) => onCoinChange(e, true)}
              label="Second Cryptocurrency"
            >
              {allCoins
                .filter((coin) => coin.id !== crypto1)
                .map((coin) => (
                  <MenuItem value={coin.id} key={coin.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      />
                      {coin.name} ({coin.symbol?.toUpperCase()})
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <SelectDays
            days={days}
            handleDaysChange={handleDaysChange}
            noPTag={true}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SelectCoins;
