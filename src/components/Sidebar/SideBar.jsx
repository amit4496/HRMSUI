import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaBusinessTime,
  FaUserClock,
  FaUserEdit,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import { BiAlignLeft } from "react-icons/bi";
import {
  AiFillAccountBook,
  AiFillHome,
  AiOutlineCaretRight,
} from "react-icons/ai";
import { HiAcademicCap, IconName } from "react-icons/hi";
import {
  BsBank2,
  BsFillCalendar2CheckFill,
  BsFillPersonFill,
  BsInfoSquareFill,
  BsPersonLinesFill,
} from "react-icons/bs";
import {GrDocumentPerformance} from "react-icons/gr"

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";

const routes = [
  {
    path: "/Dashboard",
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
        name: "HR Attendance Details",
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
        name: " Leave Request",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/screening&Approval/TotalLeaveRequest",
        name: "Total Leave Approval",
        icon: <AiOutlineCaretRight />,
      },
      {
        path: "/screening&Approval/ResignationDetails",
        name: "Resignation Details",
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
        path: "/termination",
        name: "Termination Log",
        icon: <AiOutlineCaretRight />
      }
    ],
  },
  {
    path: "/payroll",
    name: "Payroll",
    icon: <AiFillAccountBook />,
    subRoutes: [
      {
        path: "/payroll/SalarySetup",
        name: "SalarySetup",
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
        name: "Monthly Attendence Overview",
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

  // {
  //   path: "/Training",
  //   name: "Training",
  //   icon: <FaUserGraduate />,
  //   subRoutes: [

  //   ],
  // },
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
  //add performance//
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
  }
];

const roleName = localStorage.getItem("role");
console.log("roleeeeeee", roleName);

// let modifiedRoutes = [...routes];

// if (roleName === 'EMPLOYEE') {
//   modifiedRoutes = modifiedRoutes.filter(route => {
//     return (
//       route.path === '/Dashboard' ||
//       route.path.startsWith('/selfPortal')
//       // route.path ===' /selfPortal/AttendanceDetails' ||
//       // route.path === '/selfPortal/CreateLeave'
//       )
//   });
// }

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [modifiedRoutes, setModifiedRoutes] = useState([]);

  useEffect(() => {
    const roleName = localStorage.getItem("role");

    let filteredRoutes = [...routes];

    if (roleName === "EMPLOYEE") {
      filteredRoutes = filteredRoutes.filter((route) => {
        return (
          route.path === "/Dashboard" || route.path.startsWith("/selfPortal")
        );
      });
    }

    setModifiedRoutes(filteredRoutes);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "285px" : "55px",
            transition: { duration: 0.5, type: "spring", damping: 10 },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {modifiedRoutes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              } else {
                return (
                  <NavLink
                    to={route.path}
                    key={index}
                    className="link"
                    activeClassName="active"
                  >
                    <div className="icon">{route.icon}</div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text pe-auto"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              }
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
