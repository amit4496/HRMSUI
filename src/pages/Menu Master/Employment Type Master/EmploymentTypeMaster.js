import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { deleteData, getData, postData } from "../../../Services/Api";
import { getAllEmp, post_Employement } from "../../../Services/service";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../../helper";

const EmploymentTypeMaster = () => {
  const [data, setData] = useState({ employmentType: "", description: "" });
  const [ticketDetails, setTicketDetails] = useState([]);
  const [errors, setError] = useState("");
  const [errorShow, setErrorShow] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    employmentType: "",
    description: "",
  });

  const handledEmployee = (event) => {
    const { key } = event;
    const targetValue = event.target.value;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && targetValue.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed in a holiday type
    if (!/^[a-zA-Z\s]+$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Capitalize the entire input
    event.target.value = targetValue.toUpperCase();
  };

  const handledEmployeedesc = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }
  };
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  console.log(data, "data1");
  const submitHandler = (e) => {
    e.preventDefault();

    postData(data, post_Employement)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "espppp");
        if (res.Status == 200) {
          setData({
            employmentType: "",
            description: "",
          });
          Swal.fire("Good job!", "Data Saved Successfully!", "success");
          // swal("Success", "Data Posted Successfully" ,"Success");
          GetData();
        } else {
          setError({
            employmentType: res?.employmentType || "",
            description: res?.description || "",
          });
          setErrorShow(true);
          // swal("", `${res.error_message}`)
          // setData({
          //   employmentType: "",
          //   description: "",
          // });
        }
      })
      .catch((err) => {
        console.log("Error ", err);
        console.log(" code Error", err);
      });
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
            timer: 1000, // Timer set to 1000 milliseconds (1 second)
            showConfirmButton: false,
          });
          fetch(`${BASE_URL}/employment/delete/${id}`, {
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
                GetData();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          // swalWithBootstrapButtons.fire(
          //   'Cancelled',
          //   'Your file is safe 🙂',
          //   'error'
          // )
        }
      });
  };

  const GetData = () => {
    getData(getAllEmp)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "getdata");
        if (data.Status == 200) {
          setTicketDetails(data.Data);
        }
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log(" code Error", err);
      });
  };

  useEffect(() => {
    GetData();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/employment/update/${selectedRow.id}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("ressssssssss", response);
      const updatedData = response.data;
      setData(updatedData);
      console.log("qqqqqqqqq", updatedData);
      setShowModal(false);
      swal("Success", "Data Updated Successfully", "success");
      GetData();
    } catch (error) {
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
      <form>
        <div className="container">
          <div className="d-flex">
            <h3>Employment Type Master</h3>
            {/* <button type="button" className="btn btn-primary sm-4 mt-2 mx-3">Add Employment Type</button> */}
          </div>
          <hr />
          <h5>Add Employment Type</h5>
          {/* <form onSubmit={submitHandler} className="bg-light"> */}
          <div>
            <div className="row ">
              <div className="col-sm-4 mt-2">
                <label for="cars" id="label">
                  Employment Type: <span style={{ color: "red" }}> * </span>
                </label>
                <br />
                <input
                  value={data?.employmentType}
                  type="text"
                  class="form-control"
                  id="formGroupExampleInput"
                  name="employmentType"
                  onChange={inputChangeHandler}
                  placeholder="Enter Employement Type"
                  onKeyPress={handledEmployee}
                  // pattern="[/^[a-zA-Z ]*$/]{1,10}"
                />
                {errorShow && (
                  <span className="Errorsmessage">{errors.employmentType}</span>
                )}
              </div>

              <div className="col-sm-6 mt-2">
                <label for="cars" id="label">
                  Description : <span style={{ color: "red" }}> * </span>
                </label>
                <br />
                <input
                  value={data?.description}
                  type="text"
                  class="form-control"
                  id="formGroupExampleInput"
                  name="description"
                  onChange={inputChangeHandler}
                  placeholder="Enter Description here"
                  onKeyPress={handledEmployeedesc}
                />
                {errorShow && (
                  <span className="Errorsmessage">{errors.description}</span>
                )}
              </div>
            </div>
            <button
              type="submit"
              onClick={submitHandler}
              class="btn btn-primary  mt-4 "
            >
              Save
            </button>
          </div>

          {/* </form> */}

          <br />

          <MaterialTable
            style={{ width: "80vw" }}
            columns={[
              {
                title: "Employment Type",
                field: "employmentType",
              },

              {
                title: "Description",
                field: "description",
              },
              {
                title: "Actions",
                field: "actions",
                render: (rowData) => (
                  <span className="push-button">
                    <Trash2
                      color="#c07c7c"
                      onClick={() => handleDelete(rowData.id)}
                    />
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
                    type="submit"
                  ></i>
                ),
              },
            ]}
            data={ticketDetails}
            title="Employment Record"
          />
        </div>
      </form>

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
              <Form.Group controlId="employmentType">
                <Form.Label>Employement Type</Form.Label>
                <Form.Control
                  type="text"
                  name="employmentType"
                  value={editData.employmentType}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={editData.description}
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

export default EmploymentTypeMaster;
