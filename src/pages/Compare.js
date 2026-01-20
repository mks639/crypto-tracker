import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import List from "../components/Dashboard/List";
import ErrorBoundary from "../components/Common/ErrorBoundary";
import ComparisonStats from "../components/ComparePage/ComparisonStats";
import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";
import { secureLog } from "../utils/security";

function Compare() {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  // id states
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  // data states
  const [coin1Data, setCoin1Data] = useState({});
  const [coin2Data, setCoin2Data] = useState({});
  // days state
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

    useEffect(() => {
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const coins = await get100Coins();
      if (coins && Array.isArray(coins)) {
        setAllCoins(coins);
        const data1 = await getCoinData(crypto1);
        const data2 = await getCoinData(crypto2);
        
        if (data1 && data2) {
          settingCoinObject(data1, setCoin1Data);
          settingCoinObject(data2, setCoin2Data);
          
          const prices1 = await getPrices(crypto1, days, priceType);
          const prices2 = await getPrices(crypto2, days, priceType);
          
          if (prices1 && prices2) {
            settingChartData(setChartData, prices1, prices2);
          }
        }
      }
    } catch (error) {
      secureLog('error', 'Failed to load compare page data', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onCoinChange = async (e, isCoin2) => {
    setLoading(true);
    try {
      if (isCoin2) {
        const newCrypto2 = e.target.value;
        setCrypto2(newCrypto2);
        const data2 = await getCoinData(newCrypto2);
        if (data2) {
          settingCoinObject(data2, setCoin2Data);
          const prices1 = await getPrices(crypto1, days, priceType);
          const prices2 = await getPrices(newCrypto2, days, priceType);
          if (prices1 && prices2) {
            settingChartData(setChartData, prices1, prices2);
          }
        }
      } else {
        const newCrypto1 = e.target.value;
        setCrypto1(newCrypto1);
        const data1 = await getCoinData(newCrypto1);
        if (data1) {
          settingCoinObject(data1, setCoin1Data);
          const prices1 = await getPrices(newCrypto1, days, priceType);
          const prices2 = await getPrices(crypto2, days, priceType);
          if (prices1 && prices2) {
            settingChartData(setChartData, prices1, prices2);
          }
        }
      }
    } catch (error) {
      secureLog('error', 'Failed to change coin', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDaysChange = async (e) => {
    const newDays = e.target.value;
    setLoading(true);
    setDays(newDays);
    const prices1 = await getPrices(crypto1, newDays, priceType);
    const prices2 = await getPrices(crypto2, newDays, priceType);
    settingChartData(setChartData, prices1, prices2);
    setLoading(false);
  };

  const handlePriceTypeChange = async (e) => {
    const newPriceType = e.target.value;
    setLoading(true);
    setPriceType(newPriceType);
    const prices1 = await getPrices(crypto1, days, newPriceType);
    const prices2 = await getPrices(crypto2, days, newPriceType);
    settingChartData(setChartData, prices1, prices2);
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading || !coin1Data?.id || !coin2Data?.id ? (
          <Loader />
        ) : (
          <>
            {/* Coin Selection */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                Compare Cryptocurrencies
              </Typography>
              <SelectCoins
                allCoins={allCoins}
                crypto1={crypto1}
                crypto2={crypto2}
                onCoinChange={onCoinChange}
                days={days}
                handleDaysChange={handleDaysChange}
              />
            </Paper>

            {/* Coin Comparison Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                    {coin1Data.name} ({coin1Data.symbol?.toUpperCase()})
                  </Typography>
                  <Box sx={{ '& .list-row': { backgroundColor: 'transparent !important' } }}>
                    <List coin={coin1Data} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                    {coin2Data.name} ({coin2Data.symbol?.toUpperCase()})
                  </Typography>
                  <Box sx={{ '& .list-row': { backgroundColor: 'transparent !important' } }}>
                    <List coin={coin2Data} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Chart Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
                Price Comparison Chart
              </Typography>
              <Box sx={{ mb: 3 }}>
                <ToggleComponents
                  priceType={priceType}
                  handlePriceTypeChange={handlePriceTypeChange}
                />
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Box sx={{ height: 400 }}>
                    <LineChart chartData={chartData} multiAxis={true} />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <ComparisonStats coin1={coin1Data} coin2={coin2Data} />
                </Grid>
              </Grid>
            </Paper>

            {/* Information Section */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ backgroundColor: 'background.paper' }}>
                  <Info title={coin1Data.name} desc={coin1Data.desc} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ backgroundColor: 'background.paper' }}>
                  <Info title={coin2Data.name} desc={coin2Data.desc} />
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </ErrorBoundary>
  );
}

export default Compare;
