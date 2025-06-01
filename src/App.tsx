import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/layouts/MainLayout';
import './i18n'; // Initialize i18n
import BookmarksPage from './views/BookmarksPage/BookmarksPage';
import LoginPage from './views/LoginPage/LoginPage';
import NotificationsPage from './views/NotificationsPage/NotificationsPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import SearchPage from './views/SearchPage/SearchPage';
import TweetPage from './views/TweetPage/TweetPage';
import LandingPage from './views/LandingPage/LandingPage';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';

// Authentication check
const isAuthenticated = () => {
  return localStorage.getItem('access_token') !== null;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Public route (redirects to home if authenticated)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return !isAuthenticated() ? children : <Navigate to="/" />;
};

// App component with I18nextProvider
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    
    window.addEventListener('storage', checkAuth);
    checkAuth();
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Home route - show landing page for non-authenticated users */}
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <Layout>
                  <TweetPage />
                </Layout>
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Authentication routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected app routes */}
          <Route 
            path="/profile/:identifier" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookmarksPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <Layout>
                  <SearchPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
