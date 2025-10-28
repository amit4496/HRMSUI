import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { get_bank } from "../../Services/service";
import { getData } from "../../Services/Api";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { BASE_URL } from "../helper";

const BankInfo = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    employeeName: "",
    ifscCode: "",
    bankBranch: "",
    bankAccountNo: "",
    bankName: "",
    basicSalary: "",
    grossSalary: "",
  });

  const fetchData = () => {
    getData(get_bank)
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
    const url = `${BASE_URL}/bank/update/${selectedRow.id}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const updatedData = response.data;
      setData(updatedData);
      console.log("qqqqqqqqq", updatedData);
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
    <div className="container" style={{ width: "80vw" }}>
      <div className="d-flex">
        <h1>Bank Information Data</h1>
      </div>
      <hr></hr>
      <div>
        <MaterialTable
          title="Bank Information Record"
          data={ticketDetails}
          columns={[
            {
              title: "Bank ID",
              field: "id",
            },
            {
              title: "Employee Name",
              field: "name",
            },
            {
              title: "Bank Name",
              field: "bankName",
            },
            {
              title: "Account Number",
              field: "bankAccountNo",
            },
            {
              title: "Bank Branch",
              field: "bankBranch",
            },
            {
              title: "IFSC Code",
              field: "ifscCode",
            },
            {
              title: "Basic Salary",
              field: "basicSalary",
            },
            {
              title: "Gross Salary",
              field: "grossSalary",
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
      </div>
      <div className="modal">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Bank Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Render input fields for editing data */}
              <Form.Group controlId="id">
                <Form.Label>Bank ID</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  value={editData.id}
                  onChange={handleInputChange}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="bankName">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  name="bankName"
                  value={editData.bankName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="bankAccountNo">
                <Form.Label>Bank Account Number</Form.Label>
                <Form.Control
                  type="text"
                  name="bankAccountNo"
                  value={editData.bankAccountNo}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="bankBranch">
                <Form.Label>Bank Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="bankBranch"
                  value={editData.bankBranch}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="ifscCode">
                <Form.Label>IFSC Code</Form.Label>
                <Form.Control
                  type="text"
                  name="ifscCode"
                  value={editData.ifscCode}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default BankInfo;
