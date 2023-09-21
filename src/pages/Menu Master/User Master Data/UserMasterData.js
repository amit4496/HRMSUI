import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { getData } from "../../../Services/Api";
import { Employeee } from "../../../Services/service";
// import "./Table.css";
import { Button, Modal, Form } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";
import { Trash2 } from "lucide-react";

const UserMasterData = () => {
  const [data, setData] = useState({
    name: "",
  });
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    roles: "",
  });

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
        showConfirmButton: true,
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

          fetch(`https://apihrms.atwpl.com/employees/delete/${id}`, {
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
                fetchData();
              }
            });
        }
      });
  };

  const fetchData = () => {
    getData(Employeee)
      .then((response) => response.json())
      .then((resp) => {
        console.log(resp, "resss");
        setTicketDetails(resp);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `https://apihrms.atwpl.com/employees/update/${selectedRow.id}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // console.log("ressssssssss",response);
      const updatedData = response.data;
      setTicketDetails(updatedData);
      // console.log("qqqqqqqqq", updatedData);
      setShowModal(false);
      swal("Success", "Data Updated Successfully", "success");
      fetchData();
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
    <div className="container" id="user-master-data">
      <div>
        <h2>User Master Data</h2>
      </div>

      <MaterialTable
        style={{ width: "80vw" }}
        title="User Master Record"
        data={ticketDetails}
        columns={[
          {
            title: "Employee ID",
            field: "id",
          },
          {
            title: "Employee Name",
            field: "employeeName",
          },
          {
            title: "Department Name",
            field: "departmentName",
          },
          {
            title: "User Name",
            field: "username",
          },
          {
            title: "Role",
            field: "roles",
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
          // {
          //   title: "Actions",
          //   field: "actions",
          //   render: (rowData) => (
          //       <i className="fa fa-pencil-square-o" aria-hidden="true" style={{fontSize:"25px"}} onClick={() => handleEdit(rowData)}  type="submit"></i>
          //   ),
          // },
        ]}
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
              <Form.Group controlId="roles">
                <Form.Label>Branch Name</Form.Label>
                <Form.Control
                  type="text"
                  name="roles"
                  value={editData.roles}
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
    </div>
  );
};

export default UserMasterData;
