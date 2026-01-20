import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton, Avatar, Box, Typography, Divider, Button } from "@mui/material";
import { AccountCircle, ExitToApp } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../Auth/LoginModal";

export default function TemporaryDrawer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
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

  const handleProfileClick = () => {
    navigate('/profile');
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };
  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <MenuRoundedIcon className="link" />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="drawer-div">
          {user && (
            <>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={user.photoURL} sx={{ width: 40, height: 40 }}>
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                    {user.displayName || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 1 }} />
            </>
          )}
          
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
            <p className="link">Dashboard</p>
          </a>
          
          {user && (
            <div onClick={handleProfileClick}>
              <p className="link">Profile</p>
            </div>
          )}
          
          <Switch checked={darkMode} onClick={() => changeMode()} />
          
          {user ? (
            <Button
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              sx={{ 
                m: 2, 
                color: 'error.main',
                borderColor: 'error.main',
                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
              }}
              variant="outlined"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => { setLoginOpen(true); setOpen(false); }}
              sx={{ 
                m: 2,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': { backgroundColor: 'rgba(58, 128, 233, 0.1)' }
              }}
              variant="outlined"
            >
              Sign In
            </Button>
          )}
        </div>
      </Drawer>
      
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
      />
    </div>
  );
}
