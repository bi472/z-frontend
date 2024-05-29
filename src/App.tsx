import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TweetPage from './views/TweetPage/TweetPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import ProfilePage from './views/ProfilePage/ProfilePage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TweetPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/profile" element={<ProfilePage/>} />
            </Routes>
        </Router>
    );
}

export default App;
