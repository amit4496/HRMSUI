import "./App.css";
import SideBar from "./components/Sidebar/SideBar";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

// Error handling imports
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { ErrorProvider } from "./contexts/ErrorContext";
import GlobalErrorHandler from "./components/GlobalErrorHandler/GlobalErrorHandler";
import ErrorContextConnector from "./components/ErrorContextConnector/ErrorContextConnector";

// Import your page components
import Dashboard from "./pages/Dashboard";
import AddEmployee from "./pages/Menu Master/AddEmployee/AddEmployee";
import SalarySetup from "./pages/Payroll/SalarySetup/SalarySetup";
import TrainingToFeedback from "./pages/TrainingModule/TrainingToFeedback/TrainingToFeedback";
import TrainingMaster from "./pages/TrainingModule/TrainingMaster/TrainingMaster";
import AddShift from "./pages/Shift Management/Add Shift/AddShift";
import AttendanceDetails from "./pages/Screening & Approval/AttendanceDetails.js";
import CreateLeave from "./pages/SelfPortal/CreateLeave/CreateLeave";
import MonthwiseReport from "./pages/Attendance/MonthwiseReport";
import ViewOtReport from "./pages/Attendance/ViewOtReport";
import AddOverTime from "./pages/Attendance/AddOverTime";
import UploadBulkAttendance from "./pages/Attendance/UploadBulkAttendance";
import AddIndividualAttendance from "./pages/Attendance/AddIndividualAttendance";
import AddHoliday from "./pages/Organisation Structure/AddHoliday";
import LeaveType from "./pages/Organisation Structure/LeaveType";
import UserMaster from "./pages/Menu Master/User Master/UserMaster";
import DepartmentMaster from "./pages/Menu Master/Department Master/DepartmentMaster";
import DesignationMaster from "./pages/Menu Master/Designation Master/DesignationMaster";
import EmploymentTypeMaster from "./pages/Menu Master/Employment Type Master/EmploymentTypeMaster";
import RoleMaster from "./pages/Menu Master/Role Master/RoleMaster";
import ModuleMaster from "./pages/Menu Master/Module Master/ModuleMaster";
import UserRoleMaster from "./pages/Menu Master/User Role Master/UserRoleMaster";
import Training from "./pages/Training/Training";
import SignIn from "./pages/Signin/SignIn";
import Event from "./pages/Training/Event";
import ViewEmployeeShift from "./pages/Shift Management/ViewEmployeeShift";
import UserMasterData from "./pages/Menu Master/User Master Data/UserMasterData";
import EmployeeMaster from "./pages/Menu Master/EmployeeMaster/EmployeeMaster";

import RegisterEmployee from "./pages/TrainingModule/RegisterEmployee/RegisterEmployee";
import Branch from "./pages/Branch/Branch";
import AttendanceDetail from "./pages/SelfPortal/AttendanceDetails/AttendanceDetail";
import NotFound from "./pages/NotFound";
import BasicInfo from "./pages/EmployeeDetails/BasicInfo";
import WorkInfo from "./pages/EmployeeDetails/WorkInfo";
import BankInfo from "./pages/EmployeeDetails/BankInfo";
import EmergencyInfo from "./pages/EmployeeDetails/EmergencyInfo";
import ViewShift from "./pages/SelfPortal/ViewShift";
import SalarySlipAll from "./pages/Payroll/SalarySlipAll";
import PendingLeaveApproval from "./pages/Screening & Approval/PendingLeaveApproval";
import TotalLeaveRequest from "./pages/Screening & Approval/TotalLeaveRequest";
import AdvanceSalary from "./pages/Payroll/PayRoll/AdvanceSalary";
import Resignation from "./pages/SelfPortal/Resignation/Resignation";
import ResignationDetails from "./pages/Screening & Approval/ResignationDetails";
import DasNav from "./pages/Dashboard/Navbar/DasNav";

import ForgotPassword from "./components/ForgetPassword/ForgotPassword";
import PasswordReset from "./components/ForgetPassword/PasswordReset";
import Deduction from "./pages/Payroll/Deduction";
import LeaveRecordDetails from "./pages/Screening & Approval/LeaveRecordDetails";
import ApplyWFH from "./pages/SelfPortal/ApplyWFH";
import WFHDetails from "./pages/Screening & Approval/WFHDetails";
import Termination from "./pages/Screening & Approval/Termination";
import AddEmployeePerformance from "./pages/Performance/AddEmployeePerformance.js";
import WFHfeedback from "./pages/Screening & Approval/WFHfeedback";

import HolidayCalendar from "./pages/SelfPortal/Holidaycalendar/HolidayCalendar";
import RequirementDetail from "./pages/Organisation Structure/RequirementDetail";
import TicketRaise from "./pages/SelfPortal/TicketRaise/TicketRaise";
import TotalRaiseTicket from "./pages/Screening & Approval/TotalRaiseTicket";
import TestErrorHandling from "./components/TestErrorHandling/TestErrorHandling";
//import AddEmployeePerformance from "./pages/Performance/AddEmployeePerformance.js";

function App() {
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const roleStr = localStorage.getItem("role");
  const role = new Map(
    roleStr.split(',').map(v=>[v,v])
  );
  console.log(role, 'role is')
  console.log(role.has("ADMIN"))
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token && role) {
      setLogged(true);
    } else {
      // navigate("/");
    }
  }, [location, navigate]);

  return (
    <ErrorProvider>
      <ErrorContextConnector>
        <ErrorBoundary>
          <GlobalErrorHandler />
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset" element={<PasswordReset />} />

        {logged &&
          (role.has("ADMIN") || role.has('EMPLOYEE') || role.has('HR')) && (
            <Route
              path="/Dashboard"
              element={
                <SideBar>
                  <Dashboard />
                </SideBar>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/UserMaster"
            element={
              <SideBar>
                <DasNav />
                <UserMaster />

              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/UserMasterData"
            element={
              <SideBar>
                <DasNav />
                <UserMasterData />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/AddEmployee"
            element={
              <SideBar>
                <DasNav />
                <AddEmployee />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/DepartmentMaster"
            element={
              <SideBar>
                <DasNav />
                <DepartmentMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/DesignationMaster"
            element={
              <SideBar>
                <DasNav />
                <DesignationMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/EmploymentTypeMaster"
            element={
              <SideBar>
                <DasNav />
                <EmploymentTypeMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/RoleMaster"
            element={
              <SideBar>
                <DasNav />
                <RoleMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/ModuleMaster"
            element={
              <SideBar>
                <DasNav />
                <ModuleMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/UserRoleMaster"
            element={
              <SideBar>
                <DasNav />
                <UserRoleMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/basicInfo"
            element={
              <SideBar>
                <DasNav />
                <BasicInfo />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/workInfo"
            element={
              <SideBar>
                <DasNav />
                <WorkInfo />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/bankInfo"
            element={
              <SideBar>
                <DasNav />
                <BankInfo />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/emergencyInfo"
            element={
              <SideBar>
                <DasNav />
                <EmergencyInfo />
              </SideBar>
            }
          />
        )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/AttendanceDetails"
              element={
                <SideBar>
                  <DasNav />
                  <AttendanceDetail />
                </SideBar>
              }
            />
          )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/CreateLeave"
              element={
                <SideBar>
                  <DasNav />
                  <CreateLeave />
                </SideBar>
              }
            />
          )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/ViewShift"
              element={
                <SideBar>
                  <DasNav />
                  <ViewShift />
                </SideBar>
              }
            />
          )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/Resignation"
              element={
                <SideBar>
                  <DasNav />
                  <Resignation />
                </SideBar>
              }
            />
          )}
          {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/applyForWFH"
              element={
                <SideBar>
                  <DasNav />
                  <ApplyWFH/>
                </SideBar>
              }
            />
          )}
          {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/ticketRaise"
              element={
                <SideBar>
                  <DasNav />
                <TicketRaise/>
                </SideBar>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/AttendanceDetails"
            element={
              <SideBar>
                <DasNav />
                <AttendanceDetails />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/PendingLeaveApproval"
            element={
              <SideBar>
                <DasNav />
                <PendingLeaveApproval />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/TotalLeaveRequest"
            element={
              <SideBar>
                <DasNav />
                <TotalLeaveRequest />
              </SideBar>
            }
          />
        )}
         {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/HolidayCalendar"
              element={
                <SideBar>
                  <DasNav />
                 <HolidayCalendar/>
                </SideBar>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/leaveRecordDetails"
            element={
              <SideBar>
                <DasNav />
                <LeaveRecordDetails/>
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/ResignationDetails"
            element={
              <SideBar>
                <DasNav />
                <ResignationDetails />
              </SideBar>
            }
          />
        )}
         {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/TotalRaiseTicket"
            element={
              <SideBar>
                <DasNav />
             <TotalRaiseTicket/> 
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/approvalForWFH"
            element={
              <SideBar>
                <DasNav />
                <WFHDetails/>
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/WFHfeedback"
            element={
              <SideBar>
                <DasNav />
                <WFHfeedback/>
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/termination"
            element={
              <SideBar>
                <DasNav />
                <Termination/>
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/SalarySetup"
            element={
              <SideBar>
                <DasNav />
                <SalarySetup />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/salarySlipAll"
            element={
              <SideBar>
                <DasNav />
                <SalarySlipAll />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/advanceSalary"
            element={
              <SideBar>
                <DasNav />
                <AdvanceSalary />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/deduction"
            element={
              <SideBar>
                <DasNav />
                <Deduction />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/organisationStructure/AddHoliday"
            element={
              <SideBar>
                <DasNav />
                <AddHoliday />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/organisationStructure/LeaveType"
            element={
              <SideBar>
                <DasNav />
                <LeaveType />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/organisationStructure/requirementdetail"
            element={
              <SideBar>
                <DasNav />
                <RequirementDetail/>
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/trainingModule/RegisterEmployee"
            element={
              <SideBar>
                <DasNav />
                <RegisterEmployee />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/trainingModule/TainingMaster"
            element={
              <SideBar>
                <DasNav />
                <TrainingMaster />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/trainingModule/TrainingToFeedback"
            element={
              <SideBar>
                <DasNav />
                <TrainingToFeedback />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/AddIndividualAttendance"
            element={
              <SideBar>
                <DasNav />
                <AddIndividualAttendance />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/UploadBulkAttendance"
            element={
              <SideBar>
                <DasNav />
                <UploadBulkAttendance />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/AddOverTime"
            element={
              <SideBar>
                <DasNav />
                <AddOverTime />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/ViewOtReport"
            element={
              <SideBar>
                <DasNav />
                <ViewOtReport />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/MonthwiseReport"
            element={
              <SideBar>
                <DasNav />
                <MonthwiseReport />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/ShiftManagement/AddShift"
            element={
              <SideBar>
                <DasNav />
                <AddShift />
              </SideBar>
            }
          />
        )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/ShiftManagement/ViewEmployeeShift"
              element={
                <SideBar>
                  <DasNav />
                  <ViewEmployeeShift />
                </SideBar>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/Training/Training"
            element={
              <SideBar>
                <DasNav />
                <Training />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/Training/Event"
            element={
              <SideBar>
                <DasNav />
                <Event />
              </SideBar>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/performance/addEmployeeperformance"
            element={
              <SideBar>
                <DasNav/>
                <AddEmployeePerformance/>
              </SideBar>
            }
          />
        )}
        
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/branch/Branch"
            element={
              <SideBar>
                <DasNav />
                <Branch />
              </SideBar>
            }
          />
        )}
        {logged && (
          <Route
            path="*"
            element={
              <SideBar>
                <DasNav />
                <NotFound />
              </SideBar>
            }
          />
        )}
        
        {/* Test route for error handling - remove in production */}
        {logged && (
          <Route
            path="/test-error-handling"
            element={
              <SideBar>
                <DasNav />
                <TestErrorHandling />
              </SideBar>
            }
          />
        )}
         
      </Routes>
        </ErrorBoundary>
      </ErrorContextConnector>
    </ErrorProvider>
  );
}

export default App;
