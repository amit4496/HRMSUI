import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ModernSidebar from './ModernSidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile by default
      if (mobile && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)'
    }}>
      {/* Sidebar */}
      <ModernSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        setIsOpen={setIsSidebarOpen}
      />
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: isMobile ? 0 : 0,
        minWidth: 0 // Prevents flex child from overflowing
      }}>
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        
        <main style={{ 
          flex: 1, 
          padding: isMobile ? '1rem' : '1.5rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
          overflowY: 'auto'
        }}>
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;