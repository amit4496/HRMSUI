import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import SideBar from '../Sidebar/SideBar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div style={{ display: 'flex', flex: 1 }}>
        {isSidebarOpen && (
          <div style={{ width: '280px', flexShrink: 0 }}>
            <SideBar />
          </div>
        )}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, padding: '20px', background: '#f8fafc' }}>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;