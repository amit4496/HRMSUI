import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import swal from "sweetalert";
import Swal from "sweetalert2";
import Validation from "../../../validation/Validation";
// import { useForm } from "react-hook-form";
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from "@coreui/bootstrap-react";
import { getData, postData } from "../../../Services/Api";
import {
  Add_Employe,
  Employeee,
  User,
  department,
  designation,
  get_branch,
  post_Emergency,
  post_bank,
  post_work,
  getAllEmp,
} from "../../../Services/service";

const AddEmployee = () => {
  const [des, setDes] = useState([]);

  const [report, setReport] = useState([]);
  const [user, setUser] = useState([]);

  const [dep, setDep] = useState([]);

  const basicEmp = {
    aadhaarNumber: "",
    ctc: "",
    designation: "",
    dob: "",
    email: "",
    employeeId: "",
    employeeName: "",
    joiningDate: "",
    mobile: "",
    pfnumber: "",
    panNumber: "",
    reportingTo: "",
    selectDepartment: "",
    whichCompany: "",
    workType: "",
  };
  const [data1, setData1] = useState(basicEmp);
  const resetEmployee = () => {
    UserIdd();
    setEmpName("");
    setEmp1Id("");
    setData1(basicEmp);
    setErrors1({});
    setErrorShow1(false);
  };

  const [workemployee, setWorkEmployee] = useState("");
  const basicWork = {
    employmentType: "",
    officeBranch: "",
    gender: "",
    bloodGroup: "",
    employeeType: "",
    address: "",
    description: "",
  };
  const [datawork, setDatawork] = useState(basicWork);
  const resetwork = () => {
    setSelectedId("");
    setDatawork(basicWork);
    setWorkEmployee("");

    // setErrors2({});
    // setErrorShow2(false);
  };

  const BasicBank = {
    bankAccountNo: "",
    bankName: "",
    bankBranch: "",
    ifscCode: "",
    name: "",
  };
  const [dataBank, setDataBank] = useState(BasicBank);
  const resetbank = () => {
    setBankId("");
    setName("");
    setDataBank(BasicBank);
    setErrors3({});
    setErrorShow3(false);
  };

  const BasicEmergency = {
    emergencyContactName: "",
    emergencyContactMobile: "",
    emergencyContactEmail: "",
    emergencyContactAddress: "",
    employeeName: "",
    id: "",
  };
  const [dataEm, setDataEmergency] = useState(BasicEmergency);

  const resetEmergency = () => {
    setDataEmergency(BasicEmergency);
    setErrors4({});
    setErrorShow4(false);
  };

  const [itemshow, setItemshow] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [eMP1Id, setEmp1Id] = useState("");
  const [basicempName, setEmpName] = useState("");

  const [selectedIdd, setSelectedIdd] = useState("");
  const [bankId, setBankId] = useState("");
  const [employeebank, setEmployeeBank] = useState("");
  const [name, setName] = useState("");
  const [emergencyContactId, setEmergencyContactId] = useState("");
  const [emergencyName, setEmergencyName] = useState("");

  const [errors1, setErrors1] = useState({});
  const [errorShow1, setErrorShow1] = useState(false);
  const [addDep, setAddDep] = useState();
  const [addEmail, setAddEmail] = useState();

  const inputChangeHandler1 = (e) => {
    let newData = { ...data1 };
    newData[e.target.name] = e.target.value;
    setData1(newData);
    let newErrors = { ...errors1 };
    newErrors[e.target.name] = "";
    setErrors1(newErrors);
    if (e.target.name === "employeeName") {
      setEmpName(e.target.value);
    }
    if (e.target.name === "empId") {
      setEmp1Id(e.target.value);
    }
    if (e.target.name === "addDep") {
      setAddDep(e.target.value);
    }
    if (e.target.name === "addEmail") {
      setAddEmail(e.target.value);
    }
  };
  const inputChangeHandler5 = (e) => {
    let newDataEm = { ...dataEm };
    newDataEm[e.target.name] = e.target.value;
    setDataEmergency(newDataEm);
    let newErrors = { ...errors1 };
    newErrors[e.target.name] = "";
    setErrors4(newErrors);
    if (e.target.name === "employeeName") {
      setEmployeeBank(e.target.value);
    }
    if (e.target.name === "id") {
      setEmergencyContactId(e.target.value);
    }
  };

  const handlekey = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }
  };

  const inputChangeHandler2 = (e) => {
    let newDatax = { ...datawork };
    newDatax[e.target.name] = e.target.value;
    setDatawork(newDatax);
    let newErrors = { ...errors1 };
    newErrors[e.target.name] = "";
    setErrors2(newErrors);
    if (e.target.name === "employeeName") {
      setWorkEmployee(e.target.value);
    }
    if (e.target.name === "workId") {
      setSelectedId(e.target.value);
    }
  };
  const inputChangeHandler3 = (e) => {
    let newDatabank = { ...dataBank };
    newDatabank[e.target.name] = e.target.value;
    setDataBank(newDatabank);
    let newErrors = { ...errors1 };
    newErrors[e.target.name] = "";
    setErrors3(newErrors);
    if (e.target.name === "employeeName") {
      setName(e.target.value);
    }
    if (e.target.name === "id") {
      setBankId(e.target.value);
    }
  };

  useEffect(() => {
    const myData = user?.filter(
      (item) => item?.employeeId == emergencyContactId
    );

    console.log("my emp", myData[0]?.employeeName, emergencyContactId);
    setEmergencyName(myData[0]?.employeeName);
    setDataEmergency({
      employeeName: myData[0]?.employeeName,
      id: myData[0]?.employeeId,
    });
  }, [emergencyContactId]);

  useEffect(() => {
    const myData = user?.filter((item) => item?.employeeId == selectedId);

    console.log("my emp", myData[0]?.employeeName, selectedId);
    setWorkEmployee(myData[0]?.employeeName);
    setDatawork({
      employeeName: myData[0]?.employeeName,
      workId: myData[0]?.employeeId,
    });
  }, [selectedId]);

  useEffect(() => {
    const myData = user?.filter((item) => item?.employeeId == bankId);

    // console.log("my em",myData[0]?.name , bankId);
    setName(myData[0]?.employeeName);
    setDataBank({
      id: myData[0]?.employeeId,
      name: myData[0]?.employeeName,
    });
  }, [bankId]);

  useEffect(() => {
    const namedata = user?.filter((item) => item?.employeeName == workemployee);
    setSelectedId(namedata[0]?.employeeId);
    setDatawork({
      workId: namedata[0]?.employeeId,
      employeeName: namedata[0]?.employeeName,
    });
    console.log("my 11 ", datawork, workemployee);
  }, [workemployee]);

  useEffect(() => {
    const namedata = user?.filter((item) => item?.employeeName == workemployee);
    setSelectedIdd(namedata[0]?.employeeId);
    setDataEmergency({
      id: namedata[0]?.employeeId,
      employeeName: namedata[0]?.employeeName,
    });
  }, [employeebank]);

  useEffect(() => {
    const namedata = report?.filter((item) => item?.id === eMP1Id);
    setEmpName(namedata[0]?.employeeName);
    setAddDep(namedata[0]?.departmentName);
    setAddEmail(namedata[0]?.username);
    setData1({
      employeeId: namedata[0]?.id,
      employeeName: namedata[0]?.employeeName,
      selectDepartment: namedata[0]?.departmentName,
      email: namedata[0]?.username,
    });
  }, [eMP1Id]);

  const FetchData = () => {
    getData(designation)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          setDes(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };
  const [empt, setEmpt] = useState([]);
  const Employement = () => {
    getData(getAllEmp)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          setEmpt(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  const ReportingTo = () => {
    getData(Employeee)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "rep");
        setReport(data);
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log(" code Error", err);
      });
  };

  const Department = () => {
    getData(department)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "dep");
        setDep(data?.Data);
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log(" code Error", err);
      });
  };

  const fetchData3 = () => {
    getData(get_branch)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setItemshow(data?.Data);
      });
  };
  const UserIdd = () => {
    getData(User)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "user");
        setUser(data?.Data);
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log(" code Error", err);
      });
  };
  useEffect(() => {
    Department();
    ReportingTo();
    UserIdd();
    fetchData3();
    FetchData();
    Employement();
  }, []);

  const submitHandler1 = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data1));
    try {
      const resp = await postData(data1, Add_Employe);
      const res = await resp.json();
      console.log(res);
      if (res.Status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your Data has been saved",
          showConfirmButton: false,
          timer: 1500,
        });

        setData1({
          aadhaarNumber: "",
          ctc: "",
          designation: "",
          dob: "",
          email: "",
          employeeId: "",
          employeeName: "",
          joiningDate: "",
          mobile: "",
          panNumber: "",
          reportingTo: "",
          pfnumber: "",
          selectDepartment: "",
          whichCompany: "",
          workType: "",
        });
        resetEmployee();
        setAddEmail(" ");
      } else {
        setErrors1({
          employeeId: res?.employeeId || res?.error_message,
          employeeName: res?.employeeName,
          whichCompany: res?.whichCompany,
          dob: res?.dob || res?.validation,
          employmentType: res?.employmentType,
          aadhaarNumber: res?.aadhaarNumber || res.response,
          designation: res?.designation,
          email: res?.email,
          ctc: res?.ctc,
          joiningDate: res?.joiningDate,
          mobile: res?.mobile || res.response,
          panNumber: res?.panNumber || res.response,
          reportingTo: res?.reportingTo,
          selectDepartment: res?.selectDepartment,
          workType: res?.workType,
        });
        setErrorShow1(true);
      }
    } catch (err) {
      console.log("Error ", err);
    }
  };
  const handleKeyMobile = (event) => {
    const { key } = event;
    const { value } = event.target;
    // Block characters that are not allowed in a phone number
    if (!/^[0-9()\s]+$/.test(key)) {
      event.preventDefault();
    }
    const newValue = value + key;
    if (newValue.length > 10) {
      event.preventDefault();
    }
  };
  const handleKeyBankNumber = (event) => {
    const { key } = event;
    const { value } = event.target;
    // Block characters that are not allowed in a phone number
    if (!/^[0-9()\s]+$/.test(key)) {
      event.preventDefault();
    }
    const newValue = value + key;
    if (newValue.length > 18) {
      event.preventDefault();
    }
  };
  const handleKeyIfsc = (event) => {
    const { key } = event;
    const { value } = event.target;
    const newValue = value + key;

    // IFSC code should be alphanumeric and exactly 11 characters long
    if (!/^[A-Za-z0-9]{0,11}$/.test(newValue)) {
      event.preventDefault();
    }

    // IFSC code should not exceed 11 characters
    if (newValue.length > 11) {
      event.preventDefault();
    }
  };
  const handleKeypf = (event) => {
    const { key } = event;
    const { value } = event.target;

    if (!/^[0-9()\s]+$/.test(key)) {
      event.preventDefault();
    }
    const newValue = value + key;
    if (newValue.length > 13) {
      event.preventDefault();
    }
  };
  const handleKeyCtc = (event) => {
    const { key } = event;
    const { value } = event.target;

    if (!/^[0-9,.]+$/.test(key)) {
      event.preventDefault();
      return;
    }

    const newValue = value + key;
    if (newValue.length > 9) {
      event.preventDefault();
    }
  };

  const handleKeyAadar = (event) => {
    const { key } = event;
    const { value } = event.target;

    // Block characters that are not allowed in CTC
    if (!/^[0-9,.]+$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Check the length of the value after adding the current key
    const newValue = value + key;
    if (newValue.length > 13) {
      // Change the length limit as per your requirement
      event.preventDefault();
    }
  };
  const [errors2, setErrors2] = useState({});
  const [errorShow2, setErrorShow2] = useState(false);
  const submitWorkHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(datawork));
    try {
      const resp = await postData(datawork, post_work);
      const res = await resp.json();
      console.log(res);
      if (res.Status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 2500,
        });

        setDatawork({
          employmentType: "",
          officeBranch: "",
          gender: "",
          bloodGroup: "",
          employeeType: "",
          address: "",
          description: "",
        });
        resetwork();
      } else {
        setErrors2({
          workId: res?.workId || res?.error_message,
          employeeName: res?.employeeName,
          employmentType: res?.employmentType,
          officeBranch: res?.officeBranch,
          gender: res?.gender,
          bloodGroup: res?.bloodGroup,
          employeeType: res?.employeeType,
          address: res?.address,
          description: res?.description,
        });
        setErrorShow2(true);
      }
    } catch (err) {
      console.log("Error ", err);
    }
  };

  const [errors3, setErrors3] = useState({});
  const [errorShow3, setErrorShow3] = useState(false);
  const submitBankHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await postData(dataBank, post_bank);
      const res = await resp.json();
      console.log(res);
      if (res.Status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${res.Message}`,
          showConfirmButton: false,
          timer: 2500,
        });
        resetbank();
      } else {
        setErrors3({
          employeeId: res?.employeeId || res?.error_message,
          bankAccountNo: res?.bankAccountNo || res?.response,
          bankName: res?.bankName,
          bankBranch: res?.bankBranch,
          ifscCode: res?.ifscCode,
          name: res?.name,
        });

        setErrorShow3(true);
      }
    } catch (err) {
      console.log("Error ", err);
    }
  };

  const [errors4, setErrors4] = useState({});
  const [errorShow4, setErrorShow4] = useState(false);
  const submitEmergencyHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(dataEm));
    try {
      const resp = await postData(dataEm, post_Emergency);
      const res = await resp.json();
      console.log(res);
      if (res.Status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${res.Message}`,
          showConfirmButton: false,
          timer: 2500,
        });
        resetEmergency();
        setEmergencyName("");
        setEmergencyContactId("");
      } else {
        setErrors4({
          id: res?.id,
          employeeName: res?.employeeName,
          emergencyContactName: res?.emergencyContactName,
          emergencyContactMobile: res?.emergencyContactMobile,
          emergencyContactEmail: res?.emergencyContactEmail,
          emergencyContactAddress: res?.emergencyContactAddress,
        });
        setErrorShow4(true);
      }
    } catch (err) {
      console.log("Error ", err);
    }
  };
  return (
    <>
      <h2 className="mb-4">Add Employee</h2>
      <CAccordion activeItemKey={1}>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>Basic Information</CAccordionHeader>
          <CAccordionBody>
            <div>
              <div className="container">
                <div className="bg-light">
                  <div className="row ">
                    <div className="col-sm-4 ">
                      <label for="cars" id="label">
                        Employee Id:
                        <span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={eMP1Id}
                        className="form-select"
                        name="empId"
                        onChange={inputChangeHandler1}
                      >
                        <option selected>Select ID</option>
                        {report?.map((e) => (
                          <option valueType={e.id}>{e.id}</option>
                        ))}
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.employeeId}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-4">
                      <label for="cars" id="label">
                        Employee Name:<span style={{ color: "red" }}> * </span>
                      </label>
                      {/* <label> */}

                      <select
                        value={basicempName}
                        className="form-select"
                        name="employeeName"
                        onChange={inputChangeHandler1}
                      >
                        <option selected>Select Name</option>
                        {report.map((e) => (
                          <option valueType={e.employeeName}>
                            {e.employeeName}
                          </option>
                        ))}
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.employeeName}
                        </span>
                      )}

                      {/* </label> */}
                    </div>
                    <div className="col-sm-4 ">
                      <label for="cars" id="label">
                        Company:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <select
                        value={data1.whichCompany}
                        className="form-select"
                        aria-label="Default select example"
                        name="whichCompany"
                        onChange={inputChangeHandler1}
                      >
                        <option selected value="">
                          Select Company
                        </option>
                        <option value="AhomTechnologies">
                          Ahom Technologies
                        </option>
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.whichCompany}
                        </span>
                      )}
                    </div>
                    <div className="col-sm-4 ">
                      <label className="form-label" for="cars" id="label">
                        Select Department:
                        <span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <select
                        value={data1.selectDepartment}
                        className="form-select"
                        aria-label="Default select example"
                        name="selectDepartment"
                        onChange={inputChangeHandler1}
                      >
                        <option selected value="">
                          Select Department
                        </option>
                        {dep?.map((e) => (
                          <option valueType={e.departmentName}>
                            {e.departmentName}
                          </option>
                        ))}
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.selectDepartment}
                        </span>
                      )}
                    </div>
                    <div className="col-sm-4 ">
                      <label className="form-label" for="cars" id="label">
                        Designation:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={data1.designation}
                        className="form-select"
                        aria-label="Default select example"
                        name="designation"
                        onChange={inputChangeHandler1}
                      >
                        <option selected value="">
                          Select Designation
                        </option>
                        {Array.isArray(des) &&
                          des.map((des) => (
                            <option valueType={des.designationName}>
                              {des.designationName}
                            </option>
                          ))}
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.designation}
                        </span>
                      )}
                    </div>
                    <div className="col-sm-4 ">
                      <label className="form-label" for="cars" id="label">
                        Select Email:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <select
                        value={addEmail}
                        className="form-select"
                        aria-label="Default select example"
                        name="email"
                        disabled
                        onChange={inputChangeHandler1}
                      >
                        <option selected value="">
                          Select Email
                        </option>
                        {/* <option valueType="ahomTechnologies">
                        Java
                      </option> */}
                        {report.map((e) => (
                          <option valueType={e.username}>{e.username}</option>
                        ))}
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">{errors1.email}</span>
                      )}
                    </div>
                    <div className=" col-sm-4">
                      <label className="form-label">Mobile:</label>
                      <br />
                      <input
                        value={data1.mobile}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="mobile"
                        onChange={inputChangeHandler1}
                        onKeyPress={handleKeyMobile}
                        placeholder="888 888 8888"
                        maxlength="10"
                      />
                      {errorShow1 && (
                        <span className="Errorsmessage">{errors1.mobile}</span>
                      )}
                    </div>
                    <div className=" col-sm-4">
                      <label className="form-label">
                        CTC:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={data1.ctc}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="ctc"
                        onChange={inputChangeHandler1}
                        onKeyPress={handleKeyCtc}
                        placeholder="Enter your CTC."
                      />
                      {errorShow1 && (
                        <span className="Errorsmessage">{errors1.ctc}</span>
                      )}
                    </div>
                    <div className=" col-sm-4">
                      <label className="form-label">Pf Number:</label>
                      <br />
                      <input
                        value={data1.pfnumber}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="pfnumber"
                        onChange={inputChangeHandler1}
                        onKeyPress={handleKeypf}
                        placeholder="Enter pf number  ."
                      />
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.pfnumber}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-4">
                      <label className="form-label">
                        PAN Number:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={data1.panNumber}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="panNumber"
                        onChange={inputChangeHandler1}
                        onKeyPress={handlekey}
                        placeholder="Enter PAN Number  ."
                        maxlength="10"
                      />
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.panNumber}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-4">
                      <label className="form-label">
                        Aadhar Number:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={data1.aadhaarNumber}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="aadhaarNumber"
                        onChange={inputChangeHandler1}
                        onKeyPress={handleKeyAadar}
                        placeholder="Enter Aadhaar Number  ."
                      />
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.aadhaarNumber}
                        </span>
                      )}
                    </div>

                    <div className="col-sm-4 ">
                      <label className="form-label" for="cars" id="label">
                        Reporting To:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={data1.reportingTo}
                        className="form-select"
                        aria-label="Default select example"
                        name="reportingTo"
                        onChange={inputChangeHandler1}
                      >
                        <option selected value="">
                          Reporting To
                        </option>
                        {report.map((e) => (
                          <option valueType={e.employeeName}>
                            {e.employeeName}
                          </option>
                        ))}
                      </select>

                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.reportingTo}
                        </span>
                      )}
                    </div>

                    <div className="col-sm-4 ">
                      <label className="form-label" for="cars" id="label">
                        Work Type:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={data1.workType}
                        className="form-select"
                        aria-label="Default select example"
                        name="workType"
                        onChange={inputChangeHandler1}
                      >
                        <option selected value="">
                          Select Type
                        </option>
                        <option value="technical">Technical</option>
                        <option value="Nontechnical">Non-Technical</option>
                        {/* {show.map(item=>( <option valueType={item.workType}>{item.workType}</option>))} */}
                      </select>
                      {errorShow1 && (
                        <span className="Errorsmessage">
                          {errors1.workType}
                        </span>
                      )}
                    </div>

                    <div className=" col-sm-4">
                      <label className="form-label">
                        Joining Date:<span> * </span>
                      </label>
                      <div>
                        <Form.Control
                          input
                          value={data1.joiningDate}
                          type="date"
                          name="joiningDate"
                          onChange={inputChangeHandler1}
                        ></Form.Control>
                        {errorShow1 && (
                          <span className="Errorsmessage">
                            {errors1.joiningDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className=" col-sm-4">
                      <label className="form-label">
                        DOB:<span style={{ color: "red" }}> * </span>
                      </label>
                      <div>
                        <Form.Control
                          value={data1.dob}
                          type="date"
                          name="dob"
                          onChange={inputChangeHandler1}
                          required
                        ></Form.Control>
                        {errorShow1 && (
                          <span style={{ color: "red" }}>{errors1.dob}</span>
                        )}
                      </div>
                    </div>

                    <div className="my-4">
                      <button
                        type="submit"
                        className="btn btn-primary mx-2"
                        onClick={submitHandler1}
                      >
                        save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CAccordionBody>
        </CAccordionItem>

        <CAccordionItem itemKey={2}>
          {/* =========workInformation========== */}
          <CAccordionHeader>Work Information</CAccordionHeader>
          <CAccordionBody>
            <div>
              <div className="container">
                <div className="bg-light">
                  <div className="row ">
                    <div className="col-sm-3 ">
                      <label className="form-label" for="cars" id="label">
                        Employee Id:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={selectedId}
                        className="form-select"
                        name="workId"
                        onChange={inputChangeHandler2}
                        required
                      >
                        <option selected value="">
                          Select ID
                        </option>
                        {user?.map((e) => (
                          <option valueType={e.employeeId}>
                            {e.employeeId}
                          </option>
                        ))}
                      </select>
                      {errorShow2 && (
                        <span className="Errorsmessage">{errors2.workId}</span>
                      )}
                    </div>

                    <div className="col-sm-3 ">
                      <label className="form-label" for="cars" id="label">
                        Employee Name:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={workemployee}
                        className="form-select"
                        name="employeeName"
                        onChange={inputChangeHandler2}
                      >
                        <option value="">Select Name</option>
                        {user.map((e) => (
                          <option valueType={e.employeeName}>
                            {e.employeeName}
                          </option>
                        ))}
                      </select>
                      {errorShow2 && (
                        <span className="Errorsmessage">
                          {errors2.employeeName}
                        </span>
                      )}
                    </div>
                    <div className="col-sm-3 ">
                      <div>
                        <label className="form-label" for="cars" id="label">
                          Employement type:
                          <span style={{ color: "red" }}> * </span>
                        </label>

                        <select
                          value={datawork.employmentType}
                          className="form-select form-control"
                          aria-label="Default select example"
                          name="employmentType"
                          onChange={inputChangeHandler2}
                        >
                          <option selected value="">
                            Select Employment Type
                          </option>
                          {Array.isArray(empt) &&
                            empt.map((empt) => (
                              <option valueType={empt.employmentType}>
                                {empt.employmentType}
                              </option>
                            ))}
                        </select>
                        {errorShow2 && (
                          <span className="Errorsmessage">
                            {errors2.employmentType}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-3 ">
                      <label className="form-label" for="cars" id="label">
                        Office Branch:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        required
                        value={datawork.officeBranch}
                        className="form-select"
                        aria-label="Default select example"
                        name="officeBranch"
                        onChange={inputChangeHandler2}
                      >
                        <option selected value="">
                          Select Branch
                        </option>
                        {itemshow?.map((e) => (
                          <option valueType={e.name}>{e.name}</option>
                        ))}
                      </select>
                      {errorShow2 && (
                        <span className="Errorsmessage">
                          {errors2.officeBranch}
                        </span>
                      )}
                    </div>
                    {/* <div className="col-sm-3 ">
                    <label className="form-label" for="cars" id="label">
                      Employee Grade:
                    </label>

                    <select
                      value={data.employeeGrade}
                      className="form-select"
                      aria-label="Default select example"
                      name="employeeGrade"
                      onChange={inputChangeHandler}
                    >
                      <option selected disabled>
                        Select Employee Grade{" "}
                      </option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div> */}
                    {/* <div className="col-sm-3 ">
                    <label className="form-label" for="cars" id="label">
                      Employee Group:
                    </label>

                    <select
                      value={data.employeeGroup}
                      className="form-select"
                      aria-label="Default select example"
                      name="employeeGroup"
                      onChange={inputChangeHandler}
                    >
                      <option selected disabled>
                        Choose Employee Group
                      </option>
                      <option value="abcd">abcd</option>
                      <option value="defg">defg</option>
                      <option value="hijk">hijk</option>
                      <option value="slmno">lmno</option>
                    </select>
                  </div> */}
                    {/* <div className="col-sm-3 ">
                    <label className="form-label" for="cars" id="label">
                      Insurance avail:
                    </label>

                    <select
                      value={data.insuranceAvail}
                      className="form-select"
                      aria-label="Default select example"
                      name="insuranceAvail"
                      onChange={inputChangeHandler}
                    >
                      <option selected disabled>
                        Select insurance
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div> */}
                    <div className="col-sm-3 ">
                      <label className="form-label" for="cars" id="label">
                        Gender:
                      </label>

                      <select
                        required
                        value={datawork.gender}
                        className="form-select"
                        aria-label="Default select example"
                        name="gender"
                        onChange={inputChangeHandler2}
                      >
                        <option selected value="">
                          Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errorShow2 && (
                        <span className="Errorsmessage">{errors2.gender}</span>
                      )}
                    </div>
                    <div className="col-sm-3 ">
                      <label className="form-label" for="cars" id="label">
                        Blood Group:
                      </label>

                      <select
                        value={datawork.bloodGroup}
                        className="form-select"
                        aria-label="Default select example"
                        name="bloodGroup"
                        onChange={inputChangeHandler2}
                      >
                        <option selected value="">
                          Group
                        </option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                      {errorShow2 && (
                        <span className="Errorsmessage">
                          {errors2.bloodGroup}
                        </span>
                      )}
                    </div>
                    {/* <div className="col-sm-3 ">
                    <label className="form-label" for="cars" id="label">
                      Incentive:
                    </label>

                    <input
                      value={data.incentive}
                      type="number"
                      className="form-control"
                      id="formGroupExampleInput"
                      name="incentive"
                      onChange={inputChangeHandler}
                      placeholder="Enter Incentive"
                      required
                    />
                  </div> */}

                    <div className="col-sm-3">
                      <label className="form-label">
                        Address:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={datawork.address}
                        className="form-control"
                        id="my box"
                        rows="3"
                        name="address"
                        placeholder="Enter Address here"
                        onChange={inputChangeHandler2}
                        onKeyPress={handlekey}
                      />
                      {errorShow2 && (
                        <span className="Errorsmessage">{errors2.address}</span>
                      )}
                    </div>
                    <div className="col-sm-3 pb-3">
                      <label className="form-label"> Description:</label>
                      <br />
                      <input
                        value={datawork.description}
                        className="form-control"
                        id="my box"
                        rows="3"
                        name="description"
                        placeholder="Write Something here..."
                        onChange={inputChangeHandler2}
                        onKeyPress={handlekey}
                      />
                      {errorShow2 && (
                        <span className="Errorsmessage">
                          {errors2.description}
                        </span>
                      )}
                    </div>

                    <div className="my-3">
                      <button
                        type="submit"
                        className="btn btn-primary mx-2"
                        onClick={submitWorkHandler}
                      >
                        save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CAccordionBody>
        </CAccordionItem>
        <CAccordionItem itemKey={3}>
          <CAccordionHeader>Banking Information</CAccordionHeader>
          <CAccordionBody>
            <div>
              <div className="container">
                <div className="bg-light">
                  <div className="row ">
                    <div className="col-sm-6 ">
                      <label className="form-label" for="cars" id="label">
                        Employee Id:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={bankId}
                        className="form-select"
                        name="id"
                        onChange={inputChangeHandler3}
                      >
                        <option selected value="">
                          Select ID
                        </option>
                        {user.map((e) => (
                          <option valueType={e.employeeId}>
                            {e.employeeId}
                          </option>
                        ))}
                      </select>
                      {errorShow3 && (
                        <span className="Errorsmessage">
                          {errors3.employeeId}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Name :<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataBank.name}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="name"
                        onChange={inputChangeHandler3}
                        placeholder="Enter Your Name"
                        onKeyPress={handlekey}
                        required
                      />
                      {errorShow3 && (
                        <span className="Errorsmessage">{errors3.name}</span>
                      )}
                    </div>

                    <div className=" col-sm-6">
                      <label className="form-label">
                        Bank Name:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataBank.bankName}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="bankName"
                        onChange={inputChangeHandler3}
                        placeholder="Enter Bank Name"
                        onKeyPress={handlekey}
                        required
                      />
                      {errorShow3 && (
                        <span className="Errorsmessage">
                          {errors3.bankName}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Bank Branch:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataBank.bankBranch}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="bankBranch"
                        onChange={inputChangeHandler3}
                        onKeyPress={handlekey}
                        placeholder="Enter Bank Branch"
                        required
                      />
                      {errorShow3 && (
                        <span className="Errorsmessage">
                          {errors3.bankBranch}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Bank Account No:
                        <span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataBank.bankAccountNo}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="bankAccountNo"
                        onChange={inputChangeHandler3}
                        onKeyPress={handleKeyBankNumber}
                        placeholder="Enter Account Number"
                        required
                      />
                      {errorShow3 && (
                        <span className="Errorsmessage">
                          {errors3.bankAccountNo}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        IFSC Code:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataBank.ifscCode}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="ifscCode"
                        onChange={inputChangeHandler3}
                        onKeyPress={handleKeyIfsc}
                        placeholder="Enter IFSC Code"
                        required
                      />
                      {errorShow3 && (
                        <span className="Errorsmessage">
                          {errors3.ifscCode}
                        </span>
                      )}
                    </div>

                    <div className=" my-4">
                      <button
                        type="submit"
                        className="btn btn-primary mx-2"
                        onClick={submitBankHandler}
                      >
                        Save
                      </button>
                      {/* <button className="btn btn-info ">Back</button> */}
                    </div>
                    {/* <div className=" col-sm-6">
                    <label className="form-label" for="cars" id="label">
                      Payment type:
                    </label>

                    <select
                      value={data.paymentType}
                      className="form-select"
                      aria-label="Default select example"
                      name="paymentType"
                      onChange={inputChangeHandler}
                    >
                      <option selected disabled>
                        Choice Payment type
                      </option>
                      <option value="slmno">Cash</option>
                      <option value="defg">Cheque</option>
                      <option value="abcd">RTGS</option>
                      <option value="hijk">NEFT</option>
                    </select>
                  </div> */}
                    {/* <div>{errors}</div> */}
                  </div>
                </div>
              </div>
            </div>
          </CAccordionBody>
        </CAccordionItem>

        <CAccordionItem itemKey={4}>
          <CAccordionHeader>Emergency Contact Information</CAccordionHeader>
          <CAccordionBody>
            <div>
              <div className="container">
                <div className="bg-light">
                  <div className="row ">
                    <div className="col-sm-6 ">
                      <label className="form-label" for="cars" id="label">
                        Employee Id:<span style={{ color: "red" }}> * </span>
                      </label>

                      <select
                        value={emergencyContactId}
                        className="form-select"
                        name="id"
                        onChange={inputChangeHandler5}
                        required
                      >
                        <option selected>Select ID</option>
                        {user?.map((e) => (
                          <option valueType={e.employeeId}>
                            {e.employeeId}
                          </option>
                        ))}
                      </select>
                      {errorShow4 && (
                        <span className="Errorsmessage">{errors4.id}</span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Employee Name:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />

                      <select
                        value={emergencyName}
                        className="form-select"
                        name="employeeName"
                        onChange={inputChangeHandler5}
                        required
                      >
                        <option selected value="">
                          Select Name
                        </option>
                        {user?.map((e) => (
                          <option valueType={e.employeeName}>
                            {e.employeeName}
                          </option>
                        ))}
                      </select>
                      {errorShow4 && (
                        <span className="Errorsmessage">
                          {errors4.employeeName}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Contact Name:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataEm.emergencyContactName}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="emergencyContactName"
                        onChange={inputChangeHandler5}
                        onKeyPress={handlekey}
                        placeholder="Enter Contact Name"
                      />
                      {errorShow4 && (
                        <span className="Errorsmessage">
                          {errors4.emergencyContactName}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Mobile Number:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataEm.emergencyContactMobile}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="emergencyContactMobile"
                        onChange={inputChangeHandler5}
                        onKeyPress={handleKeyMobile}
                        placeholder="Enter Mobile Number"
                      />
                      {errorShow4 && (
                        <span className="Errorsmessage">
                          {errors4.emergencyContactMobile}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Email:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataEm.emergencyContactEmail}
                        type="email"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="emergencyContactEmail"
                        onChange={inputChangeHandler5}
                        onKeyPress={handlekey}
                        placeholder="Enter Email"
                      />
                      {errorShow4 && (
                        <span className="Errorsmessage">
                          {errors4.emergencyContactEmail}
                        </span>
                      )}
                    </div>
                    <div className=" col-sm-6">
                      <label className="form-label">
                        Address:<span style={{ color: "red" }}> * </span>
                      </label>
                      <br />
                      <input
                        value={dataEm.emergencyContactAddress}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        name="emergencyContactAddress"
                        onChange={inputChangeHandler5}
                        placeholder="Enter Address"
                        onKeyPress={handlekey}
                      />
                      {errorShow4 && (
                        <span className="Errorsmessage">
                          {errors4.emergencyContactAddress}
                        </span>
                      )}
                    </div>
                    <div className=" my-4">
                      <button
                        type="submit"
                        className="btn btn-primary mx-2"
                        onClick={submitEmergencyHandler}
                      >
                        Save
                      </button>
                      {/* <button className="btn btn-info ">Back</button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </>
  );
};

export default AddEmployee;
