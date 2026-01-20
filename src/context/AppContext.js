import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Action types
const ACTIONS = {
  SET_COINS: 'SET_COINS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH: 'SET_SEARCH',
  SET_PAGE: 'SET_PAGE',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  SET_THEME: 'SET_THEME'
};

// Initial state
const initialState = {
  coins: [],
  loading: false,
  error: null,
  search: '',
  page: 1,
  watchlist: JSON.parse(localStorage.getItem('watchlist') || '[]'),
  theme: localStorage.getItem('theme') || 'dark'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_COINS:
      return { ...state, coins: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload, page: 1 };
    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    case ACTIONS.ADD_TO_WATCHLIST:
      const newWatchlist = [...state.watchlist, action.payload];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return { ...state, watchlist: newWatchlist };
    case ACTIONS.REMOVE_FROM_WATCHLIST:
      const filteredWatchlist = state.watchlist.filter(id => id !== action.payload);
      localStorage.setItem('watchlist', JSON.stringify(filteredWatchlist));
      return { ...state, watchlist: filteredWatchlist };
    case ACTIONS.SET_THEME:
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setCoins = useCallback((coins) => {
    dispatch({ type: ACTIONS.SET_COINS, payload: coins });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const setSearch = useCallback((search) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: search });
  }, []);

  const setPage = useCallback((page) => {
    dispatch({ type: ACTIONS.SET_PAGE, payload: page });
  }, []);

  const addToWatchlist = useCallback((coinId) => {
    if (!state.watchlist.includes(coinId)) {
      dispatch({ type: ACTIONS.ADD_TO_WATCHLIST, payload: coinId });
    }
  }, [state.watchlist]);

  const removeFromWatchlist = useCallback((coinId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: coinId });
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: ACTIONS.SET_THEME, payload: newTheme });
  }, [state.theme]);

  const value = {
    ...state,
    setCoins,
    setLoading,
    setError,
    setSearch,
    setPage,
    addToWatchlist,
    removeFromWatchlist,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};