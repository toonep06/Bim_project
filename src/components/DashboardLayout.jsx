import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Content from './Content';
import Footer from './Footer';

function DashboardLayout() {
  return (
    <>
    <div id="page-top" className=''>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <Content />
          </div>
          <Footer />
        </div>
      </div>
      </div>
    </>
  );
}

export default DashboardLayout;
