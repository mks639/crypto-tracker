import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { secureLog } from '../utils/security';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_PROFILE':
      return { 
        ...state, 
        user: { ...state.user, profile: { ...state.user.profile, ...action.payload } }
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Skip Firebase auth if not configured
    if (!auth) {
      dispatch({ type: 'SET_USER', payload: null });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          dispatch({
            type: 'SET_USER',
            payload: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              profile: userProfile
            }
          });
        } catch (error) {
          secureLog('error', 'Failed to load user profile', { error: error.message });
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });

    return unsubscribe;
  }, []);

  const getUserProfile = async (uid) => {
    if (!db) {
      return {
        favoriteCoins: [],
        watchlist: [],
        preferences: {
          theme: 'dark',
          currency: 'usd',
          notifications: true
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
    }

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        const defaultProfile = {
          favoriteCoins: [],
          watchlist: [],
          preferences: {
            theme: 'dark',
            currency: 'usd',
            notifications: true
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        await setDoc(docRef, defaultProfile);
        return defaultProfile;
      }
    } catch (error) {
      secureLog('error', 'Failed to get user profile', { uid, error: error.message });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication not configured. Please set up Firebase.' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (db) {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString(),
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      }
      
      secureLog('info', 'User signed in with Google', { uid: user.uid });
    } catch (error) {
      secureLog('error', 'Google sign-in failed', { error: error.message });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const signInWithEmail = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date().toISOString()
      });
      secureLog('info', 'User signed in with email', { uid: result.user.uid });
    } catch (error) {
      secureLog('error', 'Email sign-in failed', { error: error.message });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userProfile = {
        displayName,
        email: user.email,
        favoriteCoins: [],
        watchlist: [],
        preferences: {
          theme: 'dark',
          currency: 'usd',
          notifications: true
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      secureLog('info', 'User signed up with email', { uid: user.uid });
    } catch (error) {
      secureLog('error', 'Email sign-up failed', { error: error.message });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      secureLog('info', 'User signed out');
    } catch (error) {
      secureLog('error', 'Sign-out failed', { error: error.message });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateUserProfile = async (updates) => {
    if (!state.user) return;
    
    try {
      await updateDoc(doc(db, 'users', state.user.uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
      secureLog('info', 'User profile updated', { uid: state.user.uid });
    } catch (error) {
      secureLog('error', 'Failed to update profile', { error: error.message });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
    }
  };

  const addToFavorites = async (coinId) => {
    if (!state.user) return;
    
    const currentFavorites = state.user.profile?.favoriteCoins || [];
    if (!currentFavorites.includes(coinId)) {
      const updatedFavorites = [...currentFavorites, coinId];
      await updateUserProfile({ favoriteCoins: updatedFavorites });
    }
  };

  const removeFromFavorites = async (coinId) => {
    if (!state.user) return;
    
    const currentFavorites = state.user.profile?.favoriteCoins || [];
    const updatedFavorites = currentFavorites.filter(id => id !== coinId);
    await updateUserProfile({ favoriteCoins: updatedFavorites });
  };

  const value = {
    ...state,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    updateUserProfile,
    addToFavorites,
    removeFromFavorites,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};