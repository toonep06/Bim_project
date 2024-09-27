import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './App.css';
//import '../node_modules/startbootstrap-sb-admin-2/css/sb-admin-2.min.css'; // นำเข้า SB Admin 2 CSS
//import '../node_modules/startbootstrap-sb-admin-2/vendor/bootstrap/js/bootstrap.bundle.min.js'; // นำเข้า Bootstrap JS
//import '../node_modules/startbootstrap-sb-admin-2/js/sb-admin-2.min.js'; // นำเข้า SB Admin 2 JS
// index.js หรือ App.js
// กำหนด jQuery เป็น global variable


createRoot(document.getElementById('root')).render(
    <App />
);
