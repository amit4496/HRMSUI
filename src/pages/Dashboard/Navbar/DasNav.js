import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import mg from "./Ahom Logo.png";
import "../Navbar/Nav.css";


import NotificationsIcon from "@mui/icons-material/Notifications";

import { Modal } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { FolderUp } from "lucide-react";
import { BASE_URL } from "../../helper";

const DasNav = () => {
  const location = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // State to hold the profile photo URL from the API
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const defaultImageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png";

  const closePopup = () => {
    setShowPopup(false);
  };

  const logout = async () => {
    await fetch("/logout");
    sessionStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "/";
  };

  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  // Function to handle file selection for profile photo
  const [selectedProfilePhotoUrl, setSelectedProfilePhotoUrl] = useState("");
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
    if (!selectedProfilePhoto) return; // No file selected, return early

    const formData = new FormData();
    formData.append("image", selectedProfilePhoto);
    formData.append("id", localStorage.getItem("employeeId"));

    try {
      const response = await axios.post(
        `${BASE_URL}/image`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        setProfilePhoto(selectedProfilePhoto);
        // setSelectedProfilePhoto(selectedProfilePhoto); // Reset the selected photo state
        setShowModal(false); // Close the modal after successful upload
        fetchProfilePhoto();
      } else {
        console.error("Failed to update profile photo");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfilePhoto = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      if (!employeeId) {
        console.error("Employee ID not found in localStorage");
        return;
      }

      const formData1 = new FormData();
      formData1.append("employeeId", employeeId);

      const response = await axios.post(
        `${BASE_URL}/image/get`,
        formData1,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data, "Profile Photo Response: profile");

        const profilePhoto = response.data;
        setProfilePhoto(profilePhoto);

        // setSelectedProfilePhoto(response.data.image);
      } else {
        console.error("Failed to fetch profile photo");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const imageUrl = profilePhoto
    ? `data:image/png;base64,${profilePhoto}`
    : defaultImageUrl;

  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const handleChangeProfile = () => {
    setShowModal(true);
  };

  const closeProfileModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbarBg">
        <div className="container-fluid homeBox NAVVVV">
          <img className="Ahompng" src={mg} alt="ahom" />

          

          <div className="dropdown">
          <div className="Notification ">
            <button
              type="button"
              className={`btn btn-secondary me-2 ${
                isShaking ? "shake" : ""
              } bell-button`}
            >
              <NotificationsIcon className="bell-icon" />
              {notificationCount > 0 && <span className="badge "></span>}
            </button>
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <span
                    className="close-icon"
                    style={{ float: "right" }}
                    onClick={closePopup}
                    aria-label="Close"
                  >
                    <FaTimes />
                  </span>
                  <h3>Notifications</h3>

                  {notification.map((item) => (
                    <div key={item.id} className="notification-item">
                      <div className="notification-message">{item.message}</div>
                      <div className="notification-time">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
            <img src={imageUrl} alt="Profile" className="profile-icon" />

            <span className="dropdown-toggle" data-bs-toggle="dropdown">
              <span className="PersonName">{localStorage.getItem("user")}</span>
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={handleChangeProfile}>
                Edit Picture{" "}
              </button>
              <button className="dropdown-item" onClick={logout}>
                Logout
              </button>
            </ul>
          </div>
        </div>
      </nav>
      <br /> <br />
      {/* Profile Modal */}
      <Modal open={showModal} onClose={closeProfileModal}>
        <div className="profile-modal">
          <h3>Edit Profile Photo</h3>
          <div className="current-profile-photo">
            {selectedProfilePhotoUrl ? (
              <img
                src={selectedProfilePhotoUrl}
                alt="Preview"
                className="profile-icon"
              />
            ) : (
              <img
                src={imageUrl}
                alt="Current Profile"
                className="profile-icon"
              />
            )}
          </div>
          <input
            className="file-input"
            type="file"
            onChange={handleProfilePhotoUpload}
          />
          <span className="Uploadddd" onClick={uploadProfilePhoto}>
            <FolderUp size={48} color="#ff7300" strokeWidth={1.25} />
          </span>
        </div>
      </Modal>
      {/* Rest of the code */}
    </>
  );
};

export default DasNav;
