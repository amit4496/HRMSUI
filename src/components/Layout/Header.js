import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { FolderUp } from 'lucide-react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { BASE_URL } from '../../pages/helper';

const Header = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState({ name: 'User', role: 'Employee' });
  const [showNotification, setShowNotification] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [selectedProfilePhotoUrl, setSelectedProfilePhotoUrl] = useState('');

  const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png';

  useEffect(() => {
    const userName = localStorage.getItem('user') || 'User';
    const userRole = localStorage.getItem('role') || 'Employee';
    setUser({
      name: userName,
      role: userRole
    });
    fetchProfilePhoto();
  }, []);

  const handleLogout = async () => {
    await fetch('/logout');
    sessionStorage.removeItem('token');
    localStorage.clear();
    window.location.href = '/';
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfilePhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedProfilePhoto(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!selectedProfilePhoto) return;

    const formData = new FormData();
    formData.append('image', selectedProfilePhoto);
    formData.append('id', localStorage.getItem('employeeId'));

    try {
      const response = await axios.post(`${BASE_URL}/image`, formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        setProfilePhoto(selectedProfilePhoto);
        setShowModal(false);
        fetchProfilePhoto();
      } else {
        console.error('Failed to update profile photo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfilePhoto = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) {
        console.error('Employee ID not found in localStorage');
        return;
      }

      const formData1 = new FormData();
      formData1.append('employeeId', employeeId);

      const response = await axios.post(`${BASE_URL}/image/get`, formData1, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        const profilePhoto = response.data;
        setProfilePhoto(profilePhoto);
      } else {
        console.error('Failed to fetch profile photo');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeProfile = () => {
    setShowModal(true);
    setShowProfileMenu(false);
  };

  const closeProfileModal = () => {
    setShowModal(false);
  };

  const imageUrl = profilePhoto ? `data:image/png;base64,${profilePhoto}` : defaultImageUrl;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f97316, #3b82f6)',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☰
          </button>
        )}
        <img 
          src="/Ahom Logo.png" 
          alt="Ahom Logo" 
          style={{
            height: '40px',
            width: 'auto',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          display: 'none'
        }}>
          HRMS
        </h1>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPopup(!showPopup)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <NotificationsIcon style={{ fontSize: '1.2rem' }} />
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notificationCount}
              </span>
            )}
          </button>

          {showPopup && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              minWidth: '300px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1002
            }}>
              <div style={{ 
                padding: '1rem', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, color: '#374151', fontSize: '1rem' }}>Notifications</h3>
                <button
                  onClick={closePopup}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div style={{ padding: '0.5rem' }}>
                {notification.length > 0 ? (
                  notification.map((item) => (
                    <div key={item.id} style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#374151'
                    }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.message}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.time}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <img 
            src={imageUrl} 
            alt="Profile" 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{user.role}</div>
          </div>
          <span style={{ fontSize: '0.8rem' }}>▼</span>
        </button>

        {showProfileMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            minWidth: '220px',
            zIndex: 1001,
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '1rem', 
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
            }}>
              <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{user.role}</div>
            </div>
            
            <button
              onClick={handleChangeProfile}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#374151',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <span>🖼️</span> Edit Picture
            </button>
            
            {/* <button
              onClick={() => setShowProfileMenu(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#374151',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <span>👤</span> View Profile
            </button>
            
            <button
              onClick={() => setShowProfileMenu(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#374151',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <span>⚙️</span> Settings
            </button> */}
            
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.target.style.background = '#fef2f2'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>

      {/* Profile Photo Upload Modal */}
      <Modal open={showModal} onClose={closeProfileModal}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          minWidth: '400px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem 0', 
            color: '#374151',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Edit Profile Photo
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <img
              src={selectedProfilePhotoUrl || imageUrl}
              alt="Profile Preview"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #e5e7eb',
                marginBottom: '1rem'
              }}
            />
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoUpload}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              cursor: 'pointer'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={closeProfileModal}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={uploadProfilePhoto}
              disabled={!selectedProfilePhoto}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: selectedProfilePhoto ? '#3b82f6' : '#d1d5db',
                color: 'white',
                borderRadius: '0.5rem',
                cursor: selectedProfilePhoto ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FolderUp size={16} />
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;