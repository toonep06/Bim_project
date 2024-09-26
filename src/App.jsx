import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './services/ProtectedRoute';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* ใช้ ProtectedRoute เพื่อป้องกันการเข้าถึงหน้า Dashboard */}
        <Route path="/" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
