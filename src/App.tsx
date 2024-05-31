import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TweetPage from './views/TweetPage/TweetPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import Layout from './components/layouts/MainLayout';
import Header from './components/header/Header';
import NotificationsPage from './views/NotificationsPage/NotificationsPage';
import BookmarksPage from './views/BookmarksPage/BookmarksPage';

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
            </Routes>
        </Router>
    );
}

export default App;
