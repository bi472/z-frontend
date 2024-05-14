import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TweetPage from './views/TweetPage/TweetPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TweetPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
            </Routes>
        </Router>
    );
}

export default App;
