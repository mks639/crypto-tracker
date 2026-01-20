import React, { Suspense, lazy } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./auth/AuthContext";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import Loader from "./components/Common/Loader";
import { useFirebaseSync } from "./hooks/useFirebaseSync";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Coin = lazy(() => import("./pages/Coin"));
const Compare = lazy(() => import("./pages/Compare"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const ProfilePage = lazy(() => import("./components/Profile/ProfilePage"));

function App() {
  useFirebaseSync();
  
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: "#3a80e9",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: "#0b1426",
        paper: "#1a2332",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: "#3a80e9 #1a2332",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#1a2332",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#3a80e9",
              borderRadius: "4px",
            },
          },
        },
      },
    },
  });

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
              <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <BrowserRouter>
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/coin/:id" element={<Coin />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </div>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
