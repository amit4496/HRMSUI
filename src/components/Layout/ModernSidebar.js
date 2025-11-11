import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ModernSidebar.css';
import {
  FaBars,
  FaBusinessTime,
  FaUserClock,
  FaUserEdit,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaBriefcase
} from 'react-icons/fa';
import {
  AiFillAccountBook,
  AiFillHome,
  AiOutlineCaretRight,
} from 'react-icons/ai';
import { HiAcademicCap } from 'react-icons/hi';
import {
  BsBank2,
  BsFillCalendar2CheckFill,
  BsInfoSquareFill,
  BsPersonLinesFill,
} from 'react-icons/bs';
import { GrDocumentPerformance } from 'react-icons/gr';
import { HIRING_PORTAL_API_URL, HIRING_PORTAL_URL } from '../../pages/helper';

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <AiFillHome />,
  },
  {
    path: "/menuMaster",
    name: "Menu Master",
    icon: <FaUserEdit />,
    subRoutes: [
      {
        path: "/menuMaster/UserMaster",
        name: "Add User",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/UserMasterData",
        name: "User Record",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/AddEmployee",
        name: "Add Employee Information",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/DepartmentMaster",
        name: "Add Department",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/DesignationMaster",
        name: "Add Designation",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/EmploymentTypeMaster",
        name: "Employment Type",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/RoleMaster",
        name: "Role Master",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/ModuleMaster",
        name: "Module Master",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/menuMaster/UserRoleMaster",
        name: "User Role Master",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/employeeDetails",
    name: "Employee Details",
    icon: <BsInfoSquareFill />,
    subRoutes: [
      {
        path: "/employeeDetails/employee/basicInfo",
        name: "Basic Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/employeeDetails/employee/workInfo",
        name: "Work Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/employeeDetails/employee/bankInfo",
        name: "Bank Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/employeeDetails/employee/emergencyInfo",
        name: "Emergency Contact Details",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/selfPortal",
    name: "Self Portal",
    icon: <BsPersonLinesFill />,
    subRoutes: [
      {
        path: "/selfPortal/AttendanceDetails",
        name: "Attendance Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/selfPortal/CreateLeave",
        name: "Create Leave Request",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/selfPortal/ViewShift",
        name: "Employee Shift",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/selfPortal/Resignation",
        name: "Resignation Request",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/selfPortal/applyForWFH",
        name: "Add Work From Home",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/selfPortal/holidaycalendar",
        name: "Holiday Calendar",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/selfPortal/ticketRaise",
        name: "Ticket Raise",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/screening&Approval",
    name: "Screening & Approval",
    icon: <FaUserClock />,
    subRoutes: [
      {
        path: "/screening&Approval/AttendanceDetails",
        name: "Attendance Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/screening&Approval/PendingLeaveApproval",
        name: "Pending Leave Approval",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/screening&Approval/TotalLeaveRequest",
        name: "Total Leave Request",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/screening&Approval/ResignationDetails",
        name: "Resignation Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/screening&Approval/TotalRaiseTicket",
        name: "Total Raise Ticket",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/leaveRecordDetails",
        name: "Total Available Leaves",
        icon: <AiOutlineCaretRight />
      },
      {
        path: "/approvalForWFH",
        name: "Work From Home Request",
        icon: <AiOutlineCaretRight />
      },
      {
        path: "/WFHfeedback",
        name: "Work From Home Feedback",
        icon: <AiOutlineCaretRight />
      },
      {
        path: "/termination",
        name: "Termination Log",
        icon: <AiOutlineCaretRight />
      },
    ],
  },
  {
    path: "/payroll",
    name: "Payroll",
    icon: <AiFillAccountBook />,
    subRoutes: [
      {
        path: "/payroll/SalarySetup",
        name: "Salary Setup",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/payroll/salarySlipAll",
        name: "Generate Salary",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/payroll/advanceSalary",
        name: "Advance Salary",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/payroll/deduction",
        name: "Deduction",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/organisationStructure",
    name: "Organisation Structure",
    icon: <FaUsers />,
    subRoutes: [
      {
        path: "/organisationStructure/AddHoliday",
        name: "Add Holiday",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/organisationStructure/LeaveType",
        name: "Leave Type",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/organisationStructure/requirementdetail",
        name: "Requirement Detail",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/trainingModule",
    name: "Training Module",
    icon: <HiAcademicCap />,
    subRoutes: [
      {
        path: "/trainingModule/TainingMaster",
        name: "Add Training Type",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/trainingModule/RegisterEmployee",
        name: "Training Record",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/trainingModule/TrainingToFeedback",
        name: "Training Feedback",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/Training/Training",
        name: "Training Details",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/Training/Event",
        name: "Event",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: <BsFillCalendar2CheckFill />,
    subRoutes: [
      {
        path: "/attendance/AddIndividualAttendance",
        name: "Add Individual Attendance",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/attendance/UploadBulkAttendance",
        name: "Upload Batch Attendance",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/attendance/AddOverTime",
        name: "Add Over Time",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/attendance/ViewOtReport",
        name: "OverTime Report Viewer",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/attendance/MonthwiseReport",
        name: "Monthly Attendance Overview",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/ShiftManagement",
    name: "Shift Management",
    icon: <FaBusinessTime />,
    subRoutes: [
      {
        path: "/ShiftManagement/AddShift",
        name: "Shift Scheduling",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/ShiftManagement/ViewEmployeeShift",
        name: "Employee Shift Details",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/branch",
    name: "Branch",
    icon: <BsBank2 />,
    subRoutes: [
      {
        path: "/branch/Branch",
        name: "Branch",
        icon: <AiOutlineCaretRight />,
      },
    ],
  },
  {
    path: "/performance",
    name: "Performance",
    icon: <GrDocumentPerformance />,
    subRoutes: [
      {
        path: "/performance/addEmployeeperformance",
        name: "Add Performance",
        icon: <AiOutlineCaretRight />,
      }
    ]
  },
  {
    path: "/recruitment",
    name: "Recruitment",
    icon: <FaBriefcase />,
    isExternal: true, // Flag to indicate external link with API call
  }
];

const ModernSidebar = ({ isOpen, toggleSidebar, isMobile, setIsOpen }) => {
  const location = useLocation();
  const [modifiedRoutes, setModifiedRoutes] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isLoadingRecruitment, setIsLoadingRecruitment] = useState(false);

  // Filter routes based on user role
  useEffect(() => {
    const roleStr = localStorage.getItem("role") || '';
    const role = new Map(
        roleStr.split(',').map(v=>[v,v])
    );
    let filteredRoutes = [...routes];

    if (role.has("EMPLOYEE")) {
      filteredRoutes = filteredRoutes.filter((route) => {
        return (
          route.path === "/dashboard" || route.path.startsWith("/selfPortal")
        );
      });
    }

    setModifiedRoutes(filteredRoutes);
  }, []);

  // Auto-expand menu if current path is inside it
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedMenus = {};
    
    modifiedRoutes.forEach((route) => {
      if (route.subRoutes) {
        const isActiveInSubmenu = route.subRoutes.some(subRoute => 
          currentPath === subRoute.path || currentPath.startsWith(subRoute.path)
        );
        if (isActiveInSubmenu) {
          newExpandedMenus[route.path] = true;
        }
      }
    });
    
    setExpandedMenus(newExpandedMenus);
  }, [location.pathname, modifiedRoutes]);
  
  // Auto-collapse submenus when sidebar is collapsed (same behavior as original)
  useEffect(() => {
    if (!isOpen) {
      setExpandedMenus({});
    }
  }, [isOpen]);

  const toggleSubmenu = (routePath) => {
    setExpandedMenus(prev => ({
      ...prev,
      [routePath]: !prev[routePath]
    }));
    
    // Auto-expand sidebar when clicking submenu (same behavior as original)
    if (setIsOpen && !isOpen) {
      setIsOpen(true);
    }
  };

  const isActiveRoute = (routePath) => {
    return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
  };

  const isActiveSubmenu = (route) => {
    if (!route.subRoutes) return false;
    return route.subRoutes.some(subRoute => 
      location.pathname === subRoute.path || location.pathname.startsWith(subRoute.path)
    );
  };

  const handleLinkClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  const handleRecruitmentClick = async (e) => {
    e.preventDefault();
    setIsLoadingRecruitment(true);
    
    try {
      // Get current user token for authorization
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        alert('You must be logged in to access the recruitment portal.');
        setIsLoadingRecruitment(false);
        return;
      }
      
      // Fetch the recruitment authorization API
      const response = await fetch(`${HIRING_PORTAL_API_URL}/api/register-authorize`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Validate response data before storing
      if (!data) {
        throw new Error('Invalid response from recruitment portal');
      }

      // Store the response data in sessionStorage
      if (data.name) {
        sessionStorage.setItem('name', data.name);
      }
      if (data.email) {
        sessionStorage.setItem('email', data.email);
      }
      if (data.token) {
        sessionStorage.setItem('token', data.token);
      }
      if (data.roles) {
        // Handle roles - can be string or array
        const rolesValue = Array.isArray(data.roles) ? data.roles.join(',') : data.roles;
        sessionStorage.setItem('roles', rolesValue);
      }

      // Redirect to the recruitment portal
      window.location.href = `${HIRING_PORTAL_URL}/dashboard`;
    } catch (error) {
      console.error('Recruitment portal access error:', error);
      alert('Unable to access recruitment portal. Please try again later.');
      setIsLoadingRecruitment(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile && !isOpen ? '-100%' : '0%',
          width: isOpen ? '280px' : '70px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: isMobile ? 50 : 10,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #f97316, #3b82f6)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  {/* <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    🏢
                  </div> */}
                  <div>
                    <h1 style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}>
                      HRMS Portal
                    </h1>
                    <p style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      opacity: 0.8
                    }}>
                      Management System
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                if (setIsOpen) {
                  setIsOpen(!isOpen);
                } else {
                  toggleSidebar();
                }
              }}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '1rem 0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {modifiedRoutes.map((route, index) => (
            <div key={index}>
              {/* Main Route */}
              {route.subRoutes ? (
                <button
                  onClick={() => toggleSubmenu(route.path)}
                  className={isActiveSubmenu(route) ? 'modern-sidebar-link modern-sidebar-parent-active' : 'modern-sidebar-link'}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => {
                    if (!isActiveSubmenu(route)) {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#f97316';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActiveSubmenu(route)) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {route.icon}
                    </span>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {route.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {isOpen && (
                    <motion.span
                      animate={{ rotate: expandedMenus[route.path] ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <FaChevronDown />
                    </motion.span>
                  )}
                </button>
              ) : route.isExternal ? (
                <button
                  onClick={handleRecruitmentClick}
                  disabled={isLoadingRecruitment}
                  className='modern-sidebar-link'
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: 'none',
                    textDecoration: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    cursor: isLoadingRecruitment ? 'not-allowed' : 'pointer',
                    opacity: isLoadingRecruitment ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isLoadingRecruitment) {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#f97316';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoadingRecruitment) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span style={{
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {route.icon}
                  </span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {isLoadingRecruitment ? 'Loading...' : route.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <NavLink
                  to={route.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) => isActive ? 'modern-sidebar-link active' : 'modern-sidebar-link'}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    textDecoration: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!e.target.closest('.active')) {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#f97316';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!e.target.closest('.active')) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span style={{
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {route.icon}
                  </span>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {route.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              )}

              {/* Submenu */}
              <AnimatePresence>
                {route.subRoutes && expandedMenus[route.path] && isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginLeft: '1rem',
                      paddingLeft: '1rem',
                      borderLeft: '2px solid #e2e8f0',
                      marginTop: '0.25rem'
                    }}
                  >
                    {route.subRoutes.map((subRoute, subIndex) => (
                      <motion.div
                        key={subIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.2, 
                          delay: subIndex * 0.05 
                        }}
                      >
                        <NavLink
                          to={subRoute.path}
                          onClick={handleLinkClick}
                          className={({ isActive }) => isActive ? 'modern-sidebar-sublink active' : 'modern-sidebar-sublink'}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 0.75rem',
                            textDecoration: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                            marginBottom: '0.125rem'
                          }}
                          onMouseOver={(e) => {
                            if (!e.target.closest('.active')) {
                              e.target.style.background = 'rgba(249, 115, 22, 0.05)';
                              e.target.style.color = '#f97316';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!e.target.closest('.active')) {
                              e.target.style.background = 'transparent';
                              e.target.style.color = '#6b7280';
                            }
                          }}
                        >
                          <span style={{
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <FaChevronRight />
                          </span>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {subRoute.name}
                          </span>
                        </NavLink>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ marginBottom: '0.25rem', fontWeight: '600' }}>
                  HRMS v2.0
                </div>
                <div>© 2024 All Rights Reserved</div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#f97316',
                  borderRadius: '50%'
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default ModernSidebar;