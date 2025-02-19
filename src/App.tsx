import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/layouts/MainLayout';
import BookmarksPage from './views/BookmarksPage/BookmarksPage';
import LoginPage from './views/LoginPage/LoginPage';
import NotificationsPage from './views/NotificationsPage/NotificationsPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import SearchPage from './views/SearchPage/SearchPage';
import TweetPage from './views/TweetPage/TweetPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Layout>
                            <TweetPage />
                        </Layout>
                    } 
                />
                <Route 
                    path="/login" 
                    element={<LoginPage />} 
                />
                <Route 
                    path="/register" 
                    element={<RegisterPage />} 
                />
                <Route 
                    path="/profile/:identifier" 
                    element={
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    } 
                />
                <Route
                    path="notifications"
                    element={
                        <Layout>
                            <NotificationsPage />
                        </Layout>
                    }
                />
                <Route
                    path="bookmarks"
                    element={
                        <Layout>
                            <BookmarksPage />
                        </Layout>
                    }
                />
                <Route path="/search" element={
                        <Layout>
                            <SearchPage />
                        </Layout>} />
                        
            </Routes>
        </Router>
    );
}

export default App;
