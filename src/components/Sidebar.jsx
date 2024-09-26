import React, { useEffect } from 'react';

function Sidebar() {

  return (
    <ul data-toggle="collapse" className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <a className="sidebar-brand d-flex align-items-center justify-content-center mt-4" href="/">
        <div className="sidebar-brand-icon">
          <img className="img-profile rounded-circle mt-2" style={{ backgroundColor: 'white' }} src="src/assets/images/logo.png" width='70px' alt="User Profile" />
        </div>
      </a>
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
        <div className="sidebar-brand-text mx- ">BIM Management</div>
      </a>
      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
      </li>
      <li className="nav-item active">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Projects</span>
        </a>
      </li>
      <hr className="sidebar-divider" />

      <div className="sidebar-heading">Interface</div>
    </ul>
  );
}

export default Sidebar;
