import React from 'react';

const Footer = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b, #334155)',
      color: 'white',
      padding: '2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f97316, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            HRMS
          </h3>
          <p style={{ 
            margin: '0 0 1rem 0', 
            color: '#cbd5e1', 
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Comprehensive Human Resource Management System designed to streamline your HR processes and enhance employee experience.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.2rem' }}>📧</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.2rem' }}>📱</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.2rem' }}>🌐</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            fontWeight: '600',
            color: '#e2e8f0'
          }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Dashboard', 'Employee Management', 'Attendance', 'Payroll', 'Reports'].map(link => (
              <a 
                key={link}
                href="#" 
                style={{ 
                  color: '#cbd5e1', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem',
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

        {/* Support */}
        <div>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            fontWeight: '600',
            color: '#e2e8f0'
          }}>
            Support
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Help Center', 'Contact Support', 'Documentation', 'Training'].map(link => (
              <a 
                key={link}
                href="#" 
                style={{ 
                  color: '#cbd5e1', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                onMouseOut={(e) => e.target.style.color = '#cbd5e1'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            fontWeight: '600',
            color: '#e2e8f0'
          }}>
            Stay Updated
          </h4>
          <p style={{ 
            margin: '0 0 1rem 0', 
            color: '#cbd5e1', 
            fontSize: '0.85rem',
            lineHeight: '1.5'
          }}>
            Get the latest updates and news about HRMS features.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #475569',
                borderRadius: '0.375rem',
                background: '#334155',
                color: 'white',
                fontSize: '0.875rem'
              }}
            />
            <button style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #f97316, #3b82f6)',
              border: 'none',
              borderRadius: '0.375rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div style={{
        borderTop: '1px solid #475569',
        marginTop: '2rem',
        paddingTop: '1rem',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 HRMS. All rights reserved. | Made with ❤️ for better HR management
        </p>
      </div>
    </div>
  );
};

export default Footer;