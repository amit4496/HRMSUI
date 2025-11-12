import "./App.css";
import MainLayout from "./components/Layout/MainLayout";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { ErrorProvider } from "./contexts/ErrorContext";
import GlobalErrorHandler from "./components/GlobalErrorHandler/GlobalErrorHandler";
import ErrorContextConnector from "./components/ErrorContextConnector/ErrorContextConnector";
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

function App() {
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const roleStr = localStorage.getItem("role") || '';
  const role = new Map(
    roleStr.split(',').map(v=>[v,v])
  );
  console.log(role, 'role is')
  console.log(role.has("ADMIN"))
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && role) {
      setLogged(true);
    } else {
      navigate("/");
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
              path="/dashboard"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/UserMaster"
            element={
              <MainLayout>
                <UserMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/UserMasterData"
            element={
              <MainLayout>
                <UserMasterData />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/AddEmployee"
            element={
              <MainLayout>
                <AddEmployee />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/DepartmentMaster"
            element={
              <MainLayout>
                <DepartmentMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/DesignationMaster"
            element={
              <MainLayout>
                <DesignationMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/EmploymentTypeMaster"
            element={
              <MainLayout>
                <EmploymentTypeMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/RoleMaster"
            element={
              <MainLayout>
                <RoleMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/ModuleMaster"
            element={
              <MainLayout>
                <ModuleMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/menuMaster/UserRoleMaster"
            element={
              <MainLayout>
                <UserRoleMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/basicInfo"
            element={
              <MainLayout>
                <BasicInfo />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/workInfo"
            element={
              <MainLayout>
                <WorkInfo />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/bankInfo"
            element={
              <MainLayout>
                <BankInfo />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/employeeDetails/employee/emergencyInfo"
            element={
              <MainLayout>
                <EmergencyInfo />
              </MainLayout>
            }
          />
        )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/AttendanceDetails"
              element={
                <MainLayout>
                  <AttendanceDetail />
                </MainLayout>
              }
            />
          )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/CreateLeave"
              element={
                <MainLayout>
                  <CreateLeave />
                </MainLayout>
              }
            />
          )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/ViewShift"
              element={
                <MainLayout>
                  <ViewShift />
                </MainLayout>
              }
            />
          )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/Resignation"
              element={
                <MainLayout>
                  <Resignation />
                </MainLayout>
              }
            />
          )}
          {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/applyForWFH"
              element={
                <MainLayout>
                  <ApplyWFH/>
                </MainLayout>
              }
            />
          )}
          {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/ticketRaise"
              element={
                <MainLayout>
                <TicketRaise/>
                </MainLayout>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/AttendanceDetails"
            element={
              <MainLayout>
                <AttendanceDetails />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/PendingLeaveApproval"
            element={
              <MainLayout>
                <PendingLeaveApproval />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/TotalLeaveRequest"
            element={
              <MainLayout>
                <TotalLeaveRequest />
              </MainLayout>
            }
          />
        )}
         {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/selfPortal/HolidayCalendar"
              element={
                <MainLayout>
                 <HolidayCalendar/>
                </MainLayout>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/leaveRecordDetails"
            element={
              <MainLayout>
                <LeaveRecordDetails/>
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/ResignationDetails"
            element={
              <MainLayout>
                <ResignationDetails />
              </MainLayout>
            }
          />
        )}
         {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/screening&Approval/TotalRaiseTicket"
            element={
              <MainLayout>
             <TotalRaiseTicket/> 
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/approvalForWFH"
            element={
              <MainLayout>
                <WFHDetails/>
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/WFHfeedback"
            element={
              <MainLayout>
                <WFHfeedback/>
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/termination"
            element={
              <MainLayout>
                <Termination/>
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/SalarySetup"
            element={
              <MainLayout>
                <SalarySetup />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/salarySlipAll"
            element={
              <MainLayout>
                <SalarySlipAll />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/advanceSalary"
            element={
              <MainLayout>
                <AdvanceSalary />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/payroll/deduction"
            element={
              <MainLayout>
                <Deduction />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/organisationStructure/AddHoliday"
            element={
              <MainLayout>
                <AddHoliday />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/organisationStructure/LeaveType"
            element={
              <MainLayout>
                <LeaveType />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/organisationStructure/requirementdetail"
            element={
              <MainLayout>
                <RequirementDetail/>
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/trainingModule/RegisterEmployee"
            element={
              <MainLayout>
                <RegisterEmployee />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/trainingModule/TainingMaster"
            element={
              <MainLayout>
                <TrainingMaster />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/trainingModule/TrainingToFeedback"
            element={
              <MainLayout>
                <TrainingToFeedback />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/AddIndividualAttendance"
            element={
              <MainLayout>
                <AddIndividualAttendance />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/UploadBulkAttendance"
            element={
              <MainLayout>
                <UploadBulkAttendance />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/AddOverTime"
            element={
              <MainLayout>
                <AddOverTime />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/ViewOtReport"
            element={
              <MainLayout>
                <ViewOtReport />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/attendance/MonthwiseReport"
            element={
              <MainLayout>
                <MonthwiseReport />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/ShiftManagement/AddShift"
            element={
              <MainLayout>
                <AddShift />
              </MainLayout>
            }
          />
        )}
        {logged &&
          (role.has('ADMIN') || role.has('HR') || role.has('EMPLOYEE')) && (
            <Route
              path="/ShiftManagement/ViewEmployeeShift"
              element={
                <MainLayout>
                  <ViewEmployeeShift />
                </MainLayout>
              }
            />
          )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/Training/Training"
            element={
              <MainLayout>
                <Training />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/Training/Event"
            element={
              <MainLayout>
                <Event />
              </MainLayout>
            }
          />
        )}
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/performance/addEmployeeperformance"
            element={
              <MainLayout>
                <AddEmployeePerformance/>
              </MainLayout>
            }
          />
        )}
        
        {logged && (role.has('ADMIN') || role.has('HR')) && (
          <Route
            path="/branch/Branch"
            element={
              <MainLayout>
                <Branch />
              </MainLayout>
            }
          />
        )}
        {logged && (
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
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
