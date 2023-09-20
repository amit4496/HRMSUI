import React, { useState } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { getData, postData } from "../../Services/Api";
import { get_leaveDetails, post_addHoliday } from "../../Services/service";
import { useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const AddHoliday = () => {
  const [holidayDetails, setHolidayDetails] = useState([]);
  const initialState = {
    holidayName: "",
    holidayType: "",
    fromDate: "",
    toDate: "",
  };
  const [data, setData] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    name:""
  });
  const handleholiday = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed in a holiday type
    if (!/^[a-zA-Z\s]+$/.test(key)) {
      event.preventDefault();
    }
  };
  const handleholidayType = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed in a holiday type
    if (!/^[a-zA-Z\s]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_addHoliday);
      const res = await resp.json();

      if (res.Status === 201) {
        console.log("Event Name Added");
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${res.Message}`,
          showConfirmButton: true,
        });
        setData({
          holidayName: "",
          holidayType: "",
          fromDate: "",
          toDate: "",
        });
        leaveDetail();
        setErrors({
          holidayName: "",
          holidayType: "",
          fromDate: "",
          toDate: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          holidayName: res?.holidayName || "",
          holidayType: res?.holidayType || "",
          fromDate: res?.fromDate || "",
          toDate: res?.toDate || res?.response,
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const handleDelete = (id) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        // reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          fetch(`https://apihrms.atwpl.com/holiday/leaveDetail/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",

              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((result) => result.json())
            .then((response) => {
              console.log(response);
              if (response?.Status == 200) {
                leaveDetail();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      });
  };

  const leaveDetail = () => {
    getData(get_leaveDetails)
      .then((response) => response.json())
      .then((rsp) => {
        console.log(rsp, "ress");
        setHolidayDetails(rsp.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    leaveDetail();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
        const url = `https://apihrms.atwpl.com/holiday/edit/${selectedRow.id}`; // Replace with your updated API endpoint
        try {
          const response = await axios.put(url, editData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          console.log("ressssssssss",response);
          const updatedData = response.data;
          setData(updatedData);
          console.log("qqqqqqqqq", updatedData);
          setShowModal(false);
          swal("Success", "Data Updated Successfully", "success");
          leaveDetail()
    }catch (error) {
        console.error("Error:", error);
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
    <>
      <div className="container">
        <h4>Add Holiday</h4>
        {/* <button type="button" class="btn btn-primary sm-4 mt-2">Add Holiday Master</button>    */}
        <hr />
        <div>
          <div className="bg-light">
            <div className="row ">
              <div className="col-sm-6">
                <label class="form-label">Holiday Name:<span style={{ color: "red" }}> * </span></label>
                <br />
                <input
                  placeholder="Enter Holiday Name"
                  value={data.holidayName}
                  type="Text"
                  class="form-control"
                  id="formGroupExampleInput"
                  name="holidayName"
                  onChange={inputChangeHandler}
                  onKeyPress={handleholiday}
                  required
                />
                {errorShow && (
                  <span className="Errorsmessage">{errors.holidayName}</span>
                )}
              </div>

              <div className="col-sm-6">
                <label class="form-label">Holiday Type:<span style={{ color: "red" }}> * </span></label>
                <br />
                <input
                  placeholder="Enter Holiday Type"
                  value={data.holidayType}
                  type="Text"
                  class="form-control"
                  id="formGroupExampleInput"
                  name="holidayType"
                  onChange={inputChangeHandler}
                  onKeyPress={handleholidayType}
                  required
                />
                {errorShow && (
                  <span className="Errorsmessage">{errors.holidayType}</span>
                )}
              </div>

              <div className="col-sm-6">
                <label class="form-label">From Date:<span style={{ color: "red" }}> * </span></label>
                <br />
                <input
                  value={data.fromDate}
                  type="Date"
                  class="form-control"
                  id="formGroupExampleInput"
                  name="fromDate"
                  onChange={inputChangeHandler}
                  required
                />
                {errorShow && (
                  <span className="Errorsmessage">{errors.fromDate}</span>
                )}
              </div>

              <div className="col-sm-6">
                <label class="form-label">To Date:<span style={{ color: "red" }}> * </span></label>
                <br />
                <input
                  value={data.toDate}
                  type="Date"
                  class="form-control"
                  id="formGroupExampleInput"
                  name="toDate"
                  onChange={inputChangeHandler}
                  required
                />
                {errorShow && (
                  <span className="Errorsmessage">{errors.toDate}</span>
                )}
              </div>
            </div>
            <button
              type="submit"
              onClick={submitHandler}
              className="btn btn-primary mt-4"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <MaterialTable
        columns={[
          {
            title: "Holiday Name",
            field: "holidayName",
          },

          {
            title: "Holiday Type",
            field: "holidayType",
          },
          {
            title: "From Date",
            field: "fromDate",
          },
          {
            title: "To Date",
            field: "toDate",
          },
          {
            title: "Actions",
            field: "actions",
            render: (rowData) => (
              <Button
                className="btn btn-danger"
                onClick={() => handleDelete(rowData.id)}
              >
                Delete
                {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
              </Button>
            ),
          },
          {
            title: "Actions",
            field: "actions",
            render: (rowData) => (
                <i className="fa fa-pencil-square-o" aria-hidden="true" style={{fontSize:"25px"}} onClick={() => handleEdit(rowData)}  type="submit"></i> 
            ),
          }
        ]}
        data={holidayDetails}
        title="Holiday Record"
      />
      <div className="container">
    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form>
      <Modal.Header closeButton>
        <Modal.Title>Edit Branch Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {/* Render input fields for editing data */}
          <Form.Group controlId="id">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={editData.id}
              onChange={handleInputChange}
              disabled
            />
          </Form.Group>
          <Form.Group controlId="holidayName">
            <Form.Label>Holiday Name</Form.Label>
            <Form.Control
              type="text"
              name="holidayName"
              value={editData.holidayName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="holidayType">
            <Form.Label>Holiday Type</Form.Label>
            <Form.Control
              type="text"
              name="holidayType"
              value={editData.holidayType}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="fromDate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="fromDate"
              value={editData.fromDate}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="toDate">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="toDate"
              value={editData.toDate}
              onChange={handleInputChange}
            />
          </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
        </Form>
    </Modal>
  </div>
    </>
  );
};

export default AddHoliday;
