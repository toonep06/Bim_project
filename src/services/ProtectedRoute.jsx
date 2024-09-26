import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // ถ้าไม่มี token แสดงว่ายังไม่ได้ล็อกอิน นำไปที่หน้า login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ถ้ามี token ให้แสดงหน้าที่ร้องขอได้
  return children;
}

export default ProtectedRoute;
