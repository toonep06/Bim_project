import React from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate

function Topbar(props) {
  const navigate = useNavigate(); // ใช้ navigate เพื่อนำทางไปยังหน้า login

  // ดึง username จาก LocalStorage
  const username = localStorage.getItem('username');

  // ฟังก์ชันสำหรับ toggle sidebar
  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-toggled');
    const sidebar = document.getElementById('accordionSidebar');
    if (sidebar) {
      sidebar.classList.toggle('toggled');
    }
  };

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    // ลบข้อมูลที่เก็บใน LocalStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // นำผู้ใช้ไปยังหน้า Login
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md rounded-circle mr-3"
          onClick={toggleSidebar}
        >
          <i className="fa fa-bars"></i>
        </button>
        <h5 className='font-weight-bold text-primary mt-2'>{props.title}</h5>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown no-arrow">
            <a
              className="nav-link dropdown-toggle"
              href="/"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="mr-2 d-none d-lg-inline  text-gray-600 small">
                {username ? username : 'Guest'}
              </span>
              <img
                className="img-profile rounded-circle"
                style={{ border: 'solid 2px' }}
                src="src/assets/images/logo.png"
                alt="User Profile"
              />
            </a>
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown">
              <a className="dropdown-item" href="#">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Profile
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Settings
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Activity Log
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Topbar;
