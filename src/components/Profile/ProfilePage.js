import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Star,
  TrendingUp,
  AccountCircle,
  Settings,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';
import { useApi } from '../../hooks/useApi';

const ProfilePage = () => {
  const { user, updateUserProfile, addToFavorites, removeFromFavorites } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    preferences: {
      theme: 'dark',
      currency: 'usd',
      notifications: true
    }
  });
  const [success, setSuccess] = useState('');

  const { data: favoriteCoinsData } = useApi(
    user?.profile?.favoriteCoins?.length > 0
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${user.profile.favoriteCoins.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
      : null
  );

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        bio: user.profile?.bio || '',
        preferences: {
          theme: user.profile?.preferences?.theme || 'dark',
          currency: user.profile?.preferences?.currency || 'usd',
          notifications: user.profile?.preferences?.notifications ?? true
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        displayName: profileData.displayName,
        bio: profileData.bio,
        preferences: profileData.preferences
      });
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setProfileData({
      displayName: user.displayName || '',
      bio: user.profile?.bio || '',
      preferences: user.profile?.preferences || {
        theme: 'dark',
        currency: 'usd',
        notifications: true
      }
    });
    setEditing(false);
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num?.toFixed(2)}`;
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Please sign in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={user.photoURL}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                <AccountCircle sx={{ fontSize: 80 }} />
              </Avatar>

              {editing ? (
                <TextField
                  fullWidth
                  label="Display Name"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    displayName: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                  {user.displayName || 'Anonymous User'}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>

              {editing ? (
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    bio: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
                  {user.profile?.bio || 'No bio added yet.'}
                </Typography>
              )}

              <Box display="flex" gap={1}>
                {editing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      size="small"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                    size="small"
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Settings Card */}
          <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: 'background.paper' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Settings sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Preferences
              </Typography>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.notifications}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        notifications: e.target.checked
                      }
                    })}
                    disabled={!editing}
                  />
                }
                label="Email Notifications"
                sx={{ mb: 1 }}
              />

              <TextField
                select
                fullWidth
                label="Preferred Currency"
                value={profileData.preferences.currency}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: {
                    ...profileData.preferences,
                    currency: e.target.value
                  }
                })}
                disabled={!editing}
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="btc">BTC</option>
                <option value="eth">ETH</option>
              </TextField>
            </Box>
          </Paper>
        </Grid>

        {/* Favorite Coins */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Favorite sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Favorite Cryptocurrencies
              </Typography>
              <Chip
                label={user.profile?.favoriteCoins?.length || 0}
                size="small"
                sx={{ ml: 2, backgroundColor: 'primary.main', color: 'white' }}
              />
            </Box>

            {favoriteCoinsData && favoriteCoinsData.length > 0 ? (
              <Grid container spacing={2}>
                {favoriteCoinsData.map((coin) => (
                  <Grid item xs={12} sm={6} key={coin.id}>
                    <Card
                      sx={{
                        backgroundColor: 'rgba(26, 35, 50, 0.8)',
                        border: '1px solid rgba(58, 128, 233, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              style={{ width: 32, height: 32, marginRight: 12 }}
                            />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {coin.symbol.toUpperCase()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {coin.name}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            onClick={() => removeFromFavorites(coin.id)}
                            size="small"
                            sx={{ color: 'error.main' }}
                          >
                            <Star />
                          </IconButton>
                        </Box>

                        <Box mt={2}>
                          <Typography variant="h6" color="primary.main">
                            {formatNumber(coin.current_price)}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            <TrendingUp
                              sx={{
                                color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main',
                                mr: 0.5,
                                fontSize: 16
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main'
                              }}
                            >
                              {coin.price_change_percentage_24h?.toFixed(2)}%
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No favorite coins yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start adding coins to your favorites from the dashboard!
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Account Stats */}
          <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Account Statistics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {user.profile?.favoriteCoins?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Favorites
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {user.profile?.watchlist?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Watchlist
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {user.profile?.createdAt ? 
                      Math.floor((new Date() - new Date(user.profile.createdAt)) / (1000 * 60 * 60 * 24)) 
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days Active
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {user.profile?.lastLogin ? 
                      new Date(user.profile.lastLogin).toLocaleDateString() 
                      : 'Today'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Login
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;