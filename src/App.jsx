import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './services/ProtectedRoute';
import ProjectPage from './pages/ProjectPage';
import TaskPage from './pages/TaskPage';
import { RoleProvider } from './services/RoleContext'; // นำเข้า RoleProvider

function App() {
  return (
    <RoleProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* ใช้ ProtectedRoute เพื่อป้องกันการเข้าถึงหน้า Dashboard */}
        <Route path="/" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
        <Route path="/tasks/:project_name/:project_id" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
      </Routes>
    </Router>
    </RoleProvider>
  );
}

export default App;
