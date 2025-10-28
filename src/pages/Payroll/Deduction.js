import { useEffect, useState } from "react";
import swal from "sweetalert";
import {
  Basic_Employee,
  get_Deuction,
  post_Deduction,
} from "../../Services/service";
import { getData, postData } from "../../Services/Api";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../helper";

const Deduction = () => {
  const [data, setData] = useState({
    gratuity: "",
    luf: "",
    providentFund: "",
  });
  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    gratuity: "",
    luf: "",
    providentFund: "",
  });

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
  const handleKeytraining = (event) => {
    const { key, target } = event;
    const { value } = target;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed (only allow numbers and the point)
    if (!/^[0-9.]+$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Check if the value contains a decimal point
    const containsDecimalPoint = value.includes(".");

    // If it contains a decimal point and the key is a number
    if (containsDecimalPoint && /^[0-9]+$/.test(key)) {
      // Get the substring after the decimal point
      const decimalPart = value.split(".")[1];

      // Block input if the decimal part already has two numbers
      if (decimalPart && decimalPart.length >= 2) {
        event.preventDefault();
        return;
      }
    }

    // Convert the input value to a floating-point number
    const floatValue = parseFloat(value);

    // Limit the maximum value to 100
    if (!isNaN(floatValue) && floatValue > 100) {
      target.value = "100";
      event.preventDefault();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_Deduction);
      const res = await resp.json();
      if (!data.gratuity || !data.luf || !data.providentFund) {
        swal("Error", "PLease Enter data first", "error");
        setTimeout(function () {
          swal.close();
        }, 1000);
      } else if (res.Status === 200) {
        console.log("Event Name Added");
        swal("Success", "Event Added Successfully", "success");
        setTimeout(function() {
          swal.close();
      }, 1000);
        FetchData();
        setData({
          gratuity: "",
          luf: "",
          providentFund: "",
        });
        setErrors({
          gratuity: "",
          luf: "",
          providentFund: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          gratuity: res?.gratuity || res?.error_message,
          luf: res?.luf || "",
          providentFund: res?.providentFund || "",
        });
        setData({
          gratuity: "",
          luf: "",
          providentFund: "",
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
          console.log(id);
          fetch(`${BASE_URL}/deduction/delete/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((result) => result.json())
            .then((response) => {
              console.log(response);
              if (response?.Status === 200) {
                FetchData();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          // Handle cancel operation if needed
        }
      });
  };

  const FetchData = () => {
    getData(get_Deuction)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          console.log("ttttttt", res?.Data);
          setTicketDetails(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    FetchData();
  }, []);

  const handleEdit = (rowData) => {
    const handleKeytraining = (event) => {
      const { key } = event;

      // Block input that consists of spaces only
      if (/^\s+$/.test(key) && event.target.value.trim() === "") {
        event.preventDefault();
        return;
      }

      // Block characters that are not allowed (only allow numbers and the point)
      if (!/^[0-9.]+$/.test(key)) {
        event.preventDefault();
      }
    };
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
  const url = `${BASE_URL}/deduction/update/${selectedRow.id}`;
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const res = await response.json();

      if (res.Status == 200) {
        console.log("ressssssssss", response);
        const updatedData = response.data;
        setData(updatedData);
        console.log("qqqqqqqqq", updatedData);
        setShowModal(false);
        swal("Success", "Data Updated Successfully", "success");
        FetchData();
      } else {
        setErrors({
          gratuity: res?.gratuity || "",
          luf: res?.luf || "",
          providentFund: res?.providentFund || "",
        });
        setErrorShow(true);
      }
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
      <div className="container container-w">
        <div className="d-flex">
          <h3>Deduction Details</h3>
        </div>
        <hr />
        <form className="bg-light" onSubmit={submitHandler}>
          <div className="row">
            <div className="col-sm-4 my-3">
              <label htmlFor="formGroupExampleInput" id="label">
                Gratuity: <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.gratuity}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="gratuity"
                onChange={inputChangeHandler}
                // maxLength="3"
                placeholder="Please Enter Gratuity %age"
                onKeyPress={handleKeytraining}
              />
              {errorShow && (
                <span style={{ color: "red" }}>{errors.gratuity}</span>
              )}
            </div>

            <div className="col-sm-4 my-3">
              <label htmlFor="formGroupExampleInput" id="label">
              Leave Unpaid For: <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.luf}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="luf"
                onChange={inputChangeHandler}
                // maxLength="2"
                placeholder="Please Enter LUF %age"
                onKeyPress={handleKeytraining}
              />
              {errorShow && <span style={{ color: "red" }}>{errors.luf}</span>}
            </div>

            <div className="col-sm-4 my-3">
              <label htmlFor="formGroupExampleInput" id="label">
                Provident Fund: <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.providentFund}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="providentFund"
                onChange={inputChangeHandler}
                placeholder="Please Enter EPF %age"
                // maxLength="2"
                onKeyPress={handleKeytraining}
              />
              {errorShow && (
                <span style={{ color: "red" }}>{errors.providentFund}</span>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Save
          </button>
          <br></br>
          <br></br>
          <MaterialTable
            title="Deduction Record"
            data={ticketDetails}
            columns={[
              {
                title: "ID",
                field: "id",
              },
              {
                title: "Gratuity Rate",
                field: "gratuity",
              },

              {
                title: "LUF Rate",
                field: "luf",
              },
              {
                title: "EPF Rate",
                field: "providentFund",
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
          />
        </form>
      </div>
      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Edit Training Details</Modal.Title>
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
              <Form.Group controlId="gratuity">
                <Form.Label>Gratuity Rate</Form.Label>
                <Form.Control
                  type="text"
                  name="gratuity"
                  value={editData.gratuity}
                  onChange={handleInputChange}
                  onKeyPress={handleKeytraining}
                />
                {errorShow && (
                  <span style={{ color: "red" }}>{errors.gratuity}</span>
                )}
              </Form.Group>
              <Form.Group controlId="luf">
                <Form.Label>LUF Rate</Form.Label>
                <Form.Control
                  type="text"
                  name="luf"
                  value={editData.luf}
                  onChange={handleInputChange}
                  onKeyPress={handleKeytraining}
                />
                {errorShow && (
                  <span style={{ color: "red" }}>{errors.luf}</span>
                )}
              </Form.Group>
              <Form.Group controlId="providentFund">
                <Form.Label>EPF Rate</Form.Label>
                <Form.Control
                  type="text"
                  name="providentFund"
                  value={editData.providentFund}
                  onChange={handleInputChange}
                  onKeyPress={handleKeytraining}
                />
                {errorShow && (
                  <span style={{ color: "red" }}>{errors.providentFund}</span>
                )}
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

export default Deduction;
