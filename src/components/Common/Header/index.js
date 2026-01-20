import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  Box,
  IconButton,
  Button as MuiButton
} from "@mui/material";
import { AccountCircle, ExitToApp } from "@mui/icons-material";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import LoginModal from "../../Auth/LoginModal";
import { useAuth } from "../../../auth/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") == "dark" ? true : false
  );

  useEffect(() => {
    if (localStorage.getItem("theme") == "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") != "dark") {
      setDark();
    } else {
      setLight();
    }
    setDarkMode(!darkMode);
    toast.success("Theme Changed!");
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
  };

  return (
    <>
      <div className="header">
        <h1>
          CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
        </h1>
        <div className="links">
          <Switch checked={darkMode} onClick={() => changeMode()} />
          <a href="/">
            <p className="link">Home</p>
          </a>
          <a href="/compare">
            <p className="link">Compare</p>
          </a>
          <a href="/watchlist">
            <p className="link">Watchlist</p>
          </a>
          <a href="/dashboard">
            <Button text={"dashboard"} />
          </a>
          
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0 }}
              >
                <Avatar 
                  src={user.photoURL} 
                  sx={{ width: 32, height: 32 }}
                >
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: 'background.paper',
                    border: '1px solid rgba(58, 128, 233, 0.2)',
                    mt: 1,
                    minWidth: 150
                  }
                }}
              >
                <MenuItem 
                  onClick={handleProfileClick}
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(58, 128, 233, 0.1)' },
                    py: 1.5
                  }}
                >
                  <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
                    py: 1.5
                  }}
                >
                  <ExitToApp sx={{ mr: 1, color: 'error.main' }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <MuiButton
              variant="outlined"
              onClick={() => setLoginOpen(true)}
              sx={{ 
                ml: 2,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(58, 128, 233, 0.1)'
                }
              }}
            >
              Sign In
            </MuiButton>
          )}
        </div>
        <div className="drawer-component">
          <TemporaryDrawer />
        </div>
      </div>
      
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
      />
    </>
  );
}

export default Header;
