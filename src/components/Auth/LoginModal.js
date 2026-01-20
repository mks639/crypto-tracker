import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
  IconButton,
  Tab,
  Tabs,
  InputAdornment
} from '@mui/material';
import { Close, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';

const LoginModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, error, clearError } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    clearError();
    setFormData({
      email: '',
      password: '',
      displayName: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    
    try {
      if (tab === 1) { // Sign Up
        if (formData.password !== formData.confirmPassword) {
          return;
        }
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
      } else { // Sign In
        await signInWithEmail(formData.email, formData.password);
      }
      
      // Close modal after successful auth
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Email auth failed:', err);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      // Close modal after successful auth
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Google auth failed:', err);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          borderRadius: 3,
          border: '1px solid rgba(58, 128, 233, 0.2)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Welcome to CryptoTracker
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Tabs 
          value={tab} 
          onChange={handleTabChange} 
          centered 
          sx={{ mb: 3 }}
          TabIndicatorProps={{ sx: { backgroundColor: 'primary.main' } }}
        >
          <Tab 
            label="Sign In" 
            sx={{ 
              color: 'text.secondary',
              '&.Mui-selected': { color: 'primary.main' }
            }} 
          />
          <Tab 
            label="Sign Up" 
            sx={{ 
              color: 'text.secondary',
              '&.Mui-selected': { color: 'primary.main' }
            }} 
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          onClick={handleGoogleAuth}
          disabled={loading}
          sx={{
            mb: 3,
            py: 1.5,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(58, 128, 233, 0.1)',
              borderColor: 'primary.main'
            }
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Box component="form" onSubmit={handleEmailAuth}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { color: 'text.secondary' } }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            required
            sx={{ mb: tab === 1 ? 2 : 3 }}
            InputLabelProps={{ sx: { color: 'text.secondary' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {tab === 1 && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
              helperText={
                formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              }
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {loading ? 'Please wait...' : (tab === 0 ? 'Sign In' : 'Sign Up')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;