import React, { useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import logo from '/src/assets/images/logo.png';
import { RoleContext } from '../services/RoleContext';
function Sidebar() {
  const { role } = useContext(RoleContext);
  return (
    <ul data-toggle="collapse" className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <div className="sidebar-brand d-flex align-items-center justify-content-center mt-4">
        <div className="sidebar-brand-icon">
          <img className="img-profile rounded-circle mt-2" style={{ backgroundColor: 'white' }} src={logo} width='70px' alt="User Profile" />
        </div>
      </div>
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
        <div className="sidebar-brand-text mx- ">BIM Management</div>
      </a>
      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <Link to="/" className="nav-link">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>
      <li className="nav-item active">
        <Link to="/" className="nav-link" href="/">
          <i className="fas fa-fw fa-project-diagram"></i>
          <span>Projects</span>
        </Link>
      </li>
      <li className="nav-item active">
        <Link to="/" className="nav-link" href="/tasks">
          <i className="fas fa-fw fa-tasks"></i>
          <span>Tasks</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />

      <div className="sidebar-heading">Admin</div>
      {role === 'admin' ? (
        <li className="nav-item active">
          <Link to="/" className="nav-link" href="/tasks">
            <i className="fas fa-fw fa-tasks"></i>
            <span>User</span>
          </Link>
        </li>
      ) : (
        <></>
      )}

    </ul>
  );
}

export default Sidebar;
