import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Alert, Snackbar } from "@mui/material";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import TabsComponent from "../components/Dashboard/Tabs";
import PaginationComponent from "../components/Dashboard/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";
import ErrorBoundary from "../components/Common/ErrorBoundary";
import { useApi } from "../hooks/useApi";
import { sanitizeInput, secureLog } from "../utils/security";

const COINS_PER_PAGE = 10;
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  
  // Use custom API hook with caching
  const { data: coins, loading, error: apiError, refetch } = useApi(API_URL, {
    cache: true,
    retries: 3
  });

  // Memoized filtered coins for performance
  const filteredCoins = useMemo(() => {
    if (!coins || !Array.isArray(coins)) return [];
    
    if (!search.trim()) return coins;
    
    const sanitizedSearch = sanitizeInput(search).toLowerCase();
    return coins.filter(coin => 
      coin.name?.toLowerCase().includes(sanitizedSearch) ||
      coin.symbol?.toLowerCase().includes(sanitizedSearch)
    );
  }, [coins, search]);

  // Memoized paginated coins
  const paginatedCoins = useMemo(() => {
    if (search.trim()) return filteredCoins;
    
    const startIndex = (page - 1) * COINS_PER_PAGE;
    return filteredCoins.slice(startIndex, startIndex + COINS_PER_PAGE);
  }, [filteredCoins, page, search]);

  // Optimized search handler
  const handleChange = useCallback((e) => {
    const value = sanitizeInput(e.target.value);
    setSearch(value);
    setPage(1);
    
    if (value.length > 2) {
      secureLog('info', 'User searched for coins', { searchTerm: value.substring(0, 20) });
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      setError('Failed to load cryptocurrency data. Please try again.');
      secureLog('error', 'Dashboard API error', { error: apiError });
    }
  }, [apiError]);

  const handleCloseError = () => {
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    refetch();
  };

  return (
    <ErrorBoundary>
      <Header />
      
      {loading ? (
        <Loader />
      ) : (
        <>
          <Search 
            search={search} 
            handleChange={handleChange}
            placeholder="Search cryptocurrencies..."
          />
          
          <TabsComponent
            coins={paginatedCoins}
            setSearch={setSearch}
            loading={loading}
          />
          
          {!search.trim() && filteredCoins.length > COINS_PER_PAGE && (
            <PaginationComponent
              page={page}
              handlePageChange={handlePageChange}
              totalPages={Math.ceil(filteredCoins.length / COINS_PER_PAGE)}
            />
          )}
        </>
      )}
      
      <TopButton />
      <Footer />
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          action={
            <button onClick={handleRetry} style={{ color: 'white' }}>
              Retry
            </button>
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </ErrorBoundary>
  );
}

export default Dashboard;

// coins == 100 coins

// PaginatedCoins -> Page 1 - coins.slice(0,10)
// PaginatedCoins -> Page 2 = coins.slice(10,20)
// PaginatedCoins -> Page 3 = coins.slice(20,30)
// .
// .
// PaginatedCoins -> Page 10 = coins.slice(90,100)

// PaginatedCoins -> Page X , then initial Count = (X-1)*10
// coins.slice(initialCount,initialCount+10)
