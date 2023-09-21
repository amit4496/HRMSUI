import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../Services/Api";
import {
  User,
  get_advance_Sal,
  post_advance_Sal,
} from "../../../Services/service";
import swal from "sweetalert";
import MaterialTable from "@material-table/core";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const AdvanceSalary = () => {
  const [data, setData] = useState({
    employeeId: "",
    employeeName: "",
    advance: "",
    amountToPayWithinMonth: "",
  });

  const [selectedId, setSelectedId] = useState("");
  const [itemshow, setItemshow] = useState([]);
  const [employee, setEmployee] = useState("");
  const [ticketDetails, setTicketDetails] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getData(User)
      .then((res) => res.json())
      .then((data) => {
        setItemshow(data?.Data);
      })
      .catch((err) => console.error(err));

    getData(get_advance_Sal)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status === 200) {
          setTicketDetails(res.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "employeeName") {
      setEmployee(value);
    }

    if (name === "employeeId") {
      setSelectedId(value);
    }
  };

  useEffect(() => {
    const myData = itemshow?.filter((item) => item?.employeeId == selectedId);

    console.log("my emp", myData[0]?.employeeName, selectedId);
    setEmployee(myData[0]?.employeeName);
    setData({
      employeeName: myData[0]?.employeeName,
      employeeId: myData[0]?.employeeId,
    });
  }, [selectedId]);

  const submitHandler = async (e) => {
    if (
      !data.employeeId ||
      !data.employeeName ||
      !data.advance ||
      !data.amountToPayWithinMonth
    ) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter Field first!",
      });
    } else {
      e.preventDefault();
      try {
        const resp = await postData(data, post_advance_Sal);
        const res = await resp.json();

        if (res.Status === 200) {
          swal("Success", "Event Added Successfully", "success");
          setTimeout(function() {
            swal.close();
        }, 1000);
          fetchData();
          setData({
            employeeId: "",
            employeeName: "",
            advance: "",
            amountToPayWithinMonth: "",
          });
          setSelectedId("");
          setEmployee("");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const [editData, setEditData] = useState({
    amountToPayPerMonth: "",
  });

  console.log(editData.amountToPayPerMonth);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleUpdate = async () => {
    const url = `https://apihrms.atwpl.com/advance/updatePerMonth/${selectedRow.employeeId}`;
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const updatedData = response.data;
      setData(updatedData);

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlekey = (e) => {
    const keyPressed = e.key;
    const isNumber = /^[0-9]+$/.test(keyPressed);

    if (!isNumber) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container-w container">
      <div className="container">
        <h3>Advance Salary</h3>
        <div className="bg-light">
          <div className="row">
            <div className="col-sm-6">
              <label className="form-label" htmlFor="cars" id="label">
                Employee Id:<span style={{ color: "red" }}> * </span>
              </label>
              <select
                value={selectedId}
                className="form-select"
                name="employeeId"
                onChange={inputChangeHandler}
              >
                <option value="">Select ID</option>
                {itemshow.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.employeeId}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label"> Employee Name:<span style={{ color: "red" }}> * </span></label>
              <br />
              <input
                value={employee}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="employeeName"
                onChange={inputChangeHandler}
                placeholder="Enter Your Name"
                required
              />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Advance Amount:<span style={{ color: "red" }}> * </span></label>
              <br />
              <input
                value={data.advance}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="advance"
                onChange={inputChangeHandler}
                placeholder="Add Advance Money"
                onKeyPress={handlekey}
                required
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Time Period:<span style={{ color: "red" }}> * </span></label>
              <br />
              <input
                value={data.amountToPayWithinMonth}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="amountToPayWithinMonth"
                onChange={inputChangeHandler}
                onKeyPress={handlekey}
                placeholder="Enter Time Period"
                required
              />
            </div>

            <div className="my-4">
              <button
                type="submit"
                className="btn btn-primary mx-2"
                onClick={submitHandler}
              >
                Save
              </button>
            </div>
          </div>

          <div className="container">
            <MaterialTable
              title="Advance Salary Record"
              data={ticketDetails}
              columns={[
                { title: "Employee ID", field: "employeeId" },
                { title: "Employee Name", field: "employeeName" },
                { title: "Advance Amount", field: "advance" },
                { title: "Time Period", field: "amountToPayWithinMonth" },
                { title: "Amount Per Month", field: "amountToPayPerMonth" },
                { title: "Remaining Balance", field: "remainingAdvance" },
                {
                  title: "Status",
                  field: "status",
                  render: (rowData) => (
                    <span
                      style={{
                        color: rowData.status ? "white" : "white",
                        backgroundColor: rowData.status
                          ? "lightgreen"
                          : "lightcoral",
                        padding: "0.5rem",
                        borderRadius: "10px",
                      }}
                    >
                      {rowData.status ? "Completed" : "Ongoing"}
                    </span>
                  ),
                },
                {
                  title: "Actions",
                  field: "actions",
                  render: (rowData) => (
                    <i
                      className="fa fa-pencil-square-o"
                      aria-hidden="true"
                      style={{ fontSize: "25px" }}
                      onClick={() => handleEdit(rowData)}
                    ></i>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Advance Salary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="amountToPayPerMonth">
                <Form.Label>Amount Per Month</Form.Label>
                <Form.Control
                  type="text"
                  name="amountToPayPerMonth"
                  value={editData.amountToPayPerMonth}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdvanceSalary;
