import React, { useEffect, useState } from "react";
import { getData } from "../../../Services/Api";
import { Employeee, get_bank } from "../../../Services/service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import mg from "./Ahom Logo.png";
import axios from "axios";
import { format } from "date-fns";

const SalarySetup = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [setup,setSetup]=useState([])

  const [pdf, setPdf] = useState(false);
  //const [current,setCurrent]=useState([]);

  const [view, setView] = useState();
  console.log(empName, selectedId, "selectedId");

  const handleDownload = () => {
    const element = document.getElementById("pdf");
    const footerElement = document.getElementsByClassName("mt-2")[0];
  
    footerElement.style.display = "none";
  
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    const elementAspectRatio = element.offsetWidth / element.offsetHeight;
  
    let scale;
    if (elementAspectRatio > screenAspectRatio) {
      scale = window.innerWidth / element.offsetWidth;
    } else {
      scale = window.innerHeight / element.offsetHeight;
    }
  
    const pdfWidth = element.offsetWidth * scale;
    const pdfHeight = element.offsetHeight * scale;
  
    // Increase the canvas resolution by scaling it up (e.g., 2x or 3x)
    const canvas = document.createElement("canvas");
    canvas.width = pdfWidth * 2; // You can adjust the scale factor as needed
    canvas.height = pdfHeight * 2;
    canvas.style.width = pdfWidth + "px";
    canvas.style.height = pdfHeight + "px";
    const context = canvas.getContext("2d");
    context.scale(2, 2); // Scale the context to match the increased canvas size
  
    // Use the custom canvas for html2canvas
    html2canvas(element, { canvas: canvas, scale: scale }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });
  
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20, "", "FAST");
  
      pdf.save("file.pdf");
  
      footerElement.style.display = "block";
    });
  };
  
  
  

  const [formData, setFormData] = useState({ employeeId: "", month: "" });
  
  const [form, setForm] = useState({
    month: ""
  });

  const inputChangeHandler1 = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedMonth = format(new Date(form.month), "MMMM yyyy");
    const month1 = formattedMonth.toUpperCase();

    axios.post("https://apihrms.atwpl.com/salarySlip/getById", {
      ...formData,
      month: month1,
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem('token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setView(response.data.Data);
          // Swal.fire("Success", "Data Fetched Successfully", "success")
          setPdf(true);
          setTimeout(function () {
            Swal.close();
          }, 2000);
          setFormData({
            employeeId: ""
          })
          setForm({
            month: ""
          })
          setEmpName("")
          setSelectedId("")
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error.response.data.error_message, "error")
        setTimeout(function () {
          Swal.close();
        }, 2000);
        setFormData({
          employeeId: ""
        });
        setForm({
          month: ""
        });
        setEmpName("")
          setSelectedId("")
        console.log(error.response.data.error_message);
      });
  };


  const fetchData2 = async () => {
    try {
      const response = await getData(get_bank);
      const data = await response.json();
      console.log("edefef", data);
      setShow(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData2();
  }, []);

  function download(e) {
    e.preventDefault();
    if (data.month) {
      setPdf(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter All fields please",
      });
    }
  }

  function closePdf() {
    setPdf(false);
  }

  const [xyz, setXyz] = useState([]);

  const FetchData = () => {
    getData(Employeee)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "attt");
        setXyz(data);
      });
  };
  useEffect(() => {
    FetchData();
  }, []);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if(e.target.name === "employeeId")
    {
      setSelectedId(e.target.value);
    }
    if(e.target.name === "employeeName")
    {
      setEmpName(e.target.value);
    }
  };

  useEffect(() => {
    const myData = xyz?.filter((item) => item?.id == selectedId);
    console.log("my emp", myData[0]?.employeeName, selectedId);
    setEmpName(myData[0]?.employeeName);
    setSetup({
      employeeName: myData[0]?.employeeName,
      employeeId: myData[0]?.id,
    });
  }, [selectedId]);


  return (
    <>
      {pdf ? (
        <div id="pdf">
          <div className="innerPdf ">
            <div className="container">
              <div style={{ float: "left" }}>
                <img src={mg} alt="ahom" height="100px" />
              </div>
              <div className="headlogo  " style={{ textAlign: "center" }}>
                <h1>
                  {" "}
                  <b> AHOM TECHNOLOGIES PVT.LTD.</b>
                </h1>
                <h6>
                  401 Spaze Platinum tower ,Sohna Rd,Gurugram,Haryana 122001
                </h6>
              </div>
            </div>

            <table style={{ textAlign: "center" }}>
              <b>
                Regd Office ES-2/250, Ground Floor, Sector-F ,Jankipuram ,
                Lucknow UP-226021
              </b>
              <br />
              <div style={{ padding: "7px" }}>
                <span style={{ float: "left" }}>Website:www.ahomtech.com</span>
                <span style={{ float: "Right" }}>
                  Company PAN No:AAPCA6467P
                </span>
              </div>
            </table>
            <div className=" d-flex justify-content-center" > 
              <tr>
                <td><b>Salary Slip for {view.monthFor}</b></td>
              </tr>
            </div>
           

            <div className="tableemp">
              <table border="2">
                <tr>
                  <th>Employee Id:</th>
                  <td>{view.employeeId}</td>
                  <th>Name</th>
                  <td>{view.name}</td>
                </tr>
                {/* <!-----2 row---> */}
                <tr>
                  <th>Bank Name</th>
                  <td>{view.bankName}</td>

                  <th>Bank A/c No.</th>
                  <td>{view.bankAccountNumber}</td>
                </tr>
                {/* <!------3 row----> */}
                {/* <tr>
                  <th>DOB</th>
                  <td>{view.dob}</td>
                  <th>Email Id:</th>
                  <td>{view.emailId}</td>
                </tr> */}
                {/* <!------4 row----> */}
                <tr>
                  <th>UAN No.</th>
                  <td>{view.pfNumber}</td>
                  <th>Working days</th>
                  <td>{view.workingDays}</td>
                </tr>
                {/* <!------5 row----> */}
                <tr>
               
                 
                </tr>
                {/* <!------6 row----> */}
                <tr>
                  <th>Paid Days</th>
                  <td>{view.paidDays}</td>

                  <th>Pan</th>
                  <td>{view.panNumber}</td>
                </tr>
                {/* <!------7 row----> */}
                <tr>
                  <th>Department</th>
                  <td>{view.department}</td>
                  <th>Designation</th>
                  <td>{view.designation}</td>
                </tr>
                {/* <!------8 row----> */}
                <tr>
                  <th>Date of Joining</th>
                  <td>{view.dateOfJoining}</td>

                  <th>LOP</th>
                  <td>{view.lop}</td>
                </tr>
                {/* <!------9 row----> */}
                <tr>
                  

                 
                </tr>
                {/* <tr>
               <th>ctc</th>
                  <td>{ctc}</td>
               </tr> */}
              
              </table>
            </div>

           

            <tr></tr>
            <br />

            <table border="2">
              <tr>
                <th>Earnings</th>
                <th>Amount</th>
                <th> Deductions</th>
                <th>Amount</th>
              </tr>
              {/* will use for calculation */}
              <tr>
                <td>Basic</td>
                {/* <td>{((ctc/12)*0.6).toFixed(2)}</td> */}
                <td>{view.basicSalary} </td>

                <td>EPF</td>
                <td>{view.providentFund}</td>
              </tr>
              <tr>
                <td>House Rent Allowance</td>
                {/* <td>{(ctc-(ctc-(ctc*0.4))).toFixed(0)}</td> */}
                <td>{view.hra}</td>

                <td>LUF</td>
                {/* <td>{(ctc-(((ctc-((0.01*ctc).toFixed(2)))))).toFixed(2)}</td> */}
                <td>{view.luf}</td>
              </tr>
              <tr>
                <td>Conveyance Allowance</td>
                <td>{view.conveyance}</td>

                <td>LOP</td>
                <td>{view.lopPay}</td>
                
              </tr>
              <tr>
                <td>OverTime Pay</td>
                <td>{view.overTimePay}</td>
                <td>Advance Salary</td>
                <td>{view.advance}</td>
              </tr>
              <tr>
                <td>Other allowance</td>
                <td>{view.otherAllowances}</td>
                <td>Gratuity</td>
                <td>{view.gratuity}</td>
                
              </tr>
            

              <tr>
                <th>Gross Earnings</th>
                <td>{view.grossEarning}</td>

                <th>Gross Deductions</th>
                <td>{view.grossDeduction}</td>
              </tr>
              <tr>
                <td>
                  <strong>NET PAY </strong>
                </td>
                <td>{view.netPay}</td>
                {/* <tr>
                  <strong>AMOUNT IN WORDS </strong>
                </tr>
                <td>
                  {" "}
                  {(
                    grossSalary -
                    (grossSalary * 0.18 + grossSalary * 0.01) -
                    (basicsalary / workingdays) * lop
                  ).toFixed(2)}
                </td> */}
                {/* <td> {netSalaryInWords}</td> */}
              </tr>
            </table>
            <div style={{ textAlign: "center" }}>
              <span>
                *** This Payslip is computer generated , Hence no Signature is
                required ***
              </span>
            </div>
          </div>

          <div className="mt-2" id="footer">
            {/* <button className='btn btn-primary me-2 neeraj' onClick={print}>Print</button> */}
            <button className="btn btn-success me-2" onClick={handleDownload}>
              Download PDF
            </button>
            <button className="btn btn-danger ms-2 neeraj" onClick={closePdf}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form className="container-w">
          <div>
            <center className="mt-2">
              <h1>
                <b>Employee Salary</b>
              </h1>
            </center>

            <fieldset>
              {/* <legend>Employee Salary Slip</legend> <br /> */}

              <div className="labelContainer">
                <div className="all">
                  <label>Employee Id:</label>
                </div>

                <div className="all">
                  <label>Employee Name:</label>
                </div>

                <div className="all">
                  <label>Month:</label>
                </div>

                <div className="all"></div>
              </div>
              <div className="labelContainer">
                <div className="all">
                  <select
                    value={selectedId}
                    name="employeeId"
                    onChange={inputChangeHandler}
                  >
                    <option value="">Select Id</option>
                    {xyz.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="all">
                  <select
                    value={empName}
                    name="employeeName"
                    onChange={inputChangeHandler}
                  >
                    <option value="">Select Name</option>
                    {xyz.map((e) => (
                      <option key={e.id} value={e.employeeName}>
                        {e.employeeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="all">
                  <input
                    type="month"
                    value={form.month}
                    name="month"
                    onChange={inputChangeHandler1}
                    placeholder="Enter field ..."
                    required
                  />
                </div>

                <div className="all">
                  <button
                    type="submit"
                    // disabled={btnDisabled}
                    className="btn btn-success text-light"
                    onClick={handleSubmit}
                  >
                    Print / Download
                  </button>
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      )}
    </>
  );
};

export default SalarySetup;
