// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Admin from './pages/admin';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/admin" element={<Admin/>}/>
            </Routes>
        </Router>
    );
};

export default App;
