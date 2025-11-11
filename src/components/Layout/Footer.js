import React from 'react';

const Footer = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b, #334155)',
      color: 'white',
      padding: '1rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Company Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f97316, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            HRMS
          </h3>
          <span style={{ 
            color: '#94a3b8', 
            fontSize: '0.85rem'
          }}>
            © 2024 All rights reserved
          </span>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {['Help', 'Support', 'Contact'].map(link => (
            <a 
              key={link}
              href="#" 
              style={{ 
                color: '#cbd5e1', 
                textDecoration: 'none', 
                fontSize: '0.85rem',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#f97316'}
              onMouseOut={(e) => e.target.style.color = '#cbd5e1'}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;