// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ConfigProvider} from 'antd'; // Import ConfigProvider
import Home from './pages/home';
import Admin from './pages/admin';
import TestComponent from './TestComponent';

const App: React.FC = () => {
    return (
        <ConfigProvider>
            <Router>
                <TestComponent/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                </Routes>
            </Router>
        </ConfigProvider>
    );
};

export default App;
