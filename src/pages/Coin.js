import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Grid, Paper, Typography, Alert, Button as MuiButton } from "@mui/material";
import { ArrowBack, TrendingUp } from "@mui/icons-material";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import SelectDays from "../components/CoinPage/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import MarketStats from "../components/CoinPage/MarketStats";
// import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import List from "../components/Dashboard/List";
import ErrorBoundary from "../components/Common/ErrorBoundary";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

function Coin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{}] });
  const [coin, setCoin] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

    const getData = async () => {
      setLoading(true);
      let coinData = await getCoinData(id, setError);
      // console.log("Coin DATA>>>>", coinData);
      settingCoinObject(coinData, setCoin);
      let prices = await getPrices(id, days, priceType, setError);
      if (prices) {
        settingChartData(setChartData, prices, days);
      }
      setLoading(false);
    };

    useEffect(() => {
      if (id) {
        getData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

  const getData = async () => {
    setLoading(true);
    let coinData = await getCoinData(id, setError);
    // console.log("Coin DATA>>>>", coinData);
    settingCoinObject(coinData, setCoin);
    if (coinData) {
      const prices = await getPrices(id, days, priceType, setError);
      if (prices) {
        settingChartData(setChartData, prices);
        setLoading(false);
      }
    }
  };

  const handleDaysChange = async (event) => {
    setLoading(true);
    setDays(event.target.value);
    const prices = await getPrices(id, event.target.value, priceType, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  const handlePriceTypeChange = async (event) => {
    setLoading(true);
    setPriceType(event.target.value);
    const prices = await getPrices(id, days, event.target.value, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {!error && !loading && coin.id ? (
          <>
            {/* Back Button */}
            <Box sx={{ mb: 3 }}>
              <MuiButton
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                variant="outlined"
                sx={{ color: 'primary.main', borderColor: 'primary.main' }}
              >
                Back to Dashboard
              </MuiButton>
            </Box>

            {/* Coin Details Card */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  {coin.name} ({coin.symbol?.toUpperCase()})
                </Typography>
              </Box>
              <Box sx={{ '& .list-row': { backgroundColor: 'transparent !important', border: 'none' } }}>
                <List coin={coin} delay={0.5} />
              </Box>
            </Paper>

            {/* Chart Controls and Chart */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
                Price Analysis
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <SelectDays handleDaysChange={handleDaysChange} days={days} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ToggleComponents
                    priceType={priceType}
                    handlePriceTypeChange={handlePriceTypeChange}
                  />
                </Grid>
              </Grid>
              
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Box sx={{ height: 400 }}>
                    <LineChart chartData={chartData} />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <MarketStats coin={coin} />
                </Grid>
              </Grid>
            </Paper>

            {/* Information Section */}
            <Paper elevation={2} sx={{ backgroundColor: 'background.paper' }}>
              <Info title={coin.name} desc={coin.desc} />
            </Paper>
          </>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                Coin Not Found
              </Typography>
              <Typography variant="body1">
                Sorry, we couldn't find the cryptocurrency you're looking for. It might have been removed or the ID is incorrect.
              </Typography>
            </Alert>
            <MuiButton
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Go to Dashboard
            </MuiButton>
          </Box>
        ) : (
          <Loader />
        )}
      </Container>
    </ErrorBoundary>
  );
}

export default Coin;
