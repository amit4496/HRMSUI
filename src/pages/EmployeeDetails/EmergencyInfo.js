import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { getData } from "../../Services/Api";
import { get_emergencyInfo } from "../../Services/service";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import PrintIcon from "@material-ui/icons/Print";
import jsPDF from "jspdf";
import "./modal.css";
import "jspdf-autotable";
import swal from "sweetalert";

const EmergencyInfo = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    employeeName: "",
    emergencyContactName: "",
    emergencyContactMobile: "",
    emergencyContactEmail: "",
    emergencyContactAddress: "",
  });

  const fetchData = () => {
    getData(get_emergencyInfo)
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
    const url = `https://apihrms.atwpl.com/emergency/update/${selectedRow.id}`; // Replace with your updated API endpoint
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

  const columns = [
    { title: "ID", field: "id" },
    { title: "Employee Name", field: "employeeName" },
    { title: "Emergency Contact Name", field: "emergencyContactName" },
    { title: "Emergency Contact Mobile", field: "emergencyContactMobile" },
    { title: "Emergency Contact Email", field: "emergencyContactEmail" },
    { title: "Emergency Contact Address", field: "emergencyContactAddress" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Emergency Contact Details", 20, 10);
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: ticketDetails,
    });
    doc.save("table.pdf");
  };

  return (
    <div
      className="container-fluid"
      style={{ width: "100%", maxWidth: "80vw" }}
    >
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2>Emergency Contact Information Data</h2>
          </div>
          <hr></hr>
          <div className="table-responsive-sm">
            <div className="row">
              <div className="col-12">
                <MaterialTable
                  title="Emergency Contact Information Record"
                  data={ticketDetails}
                  columns={[
                    {
                      title: "ID",
                      field: "id",
                    },
                    {
                      title: "Employee Name",
                      field: "employeeName",
                    },
                    {
                      title: "Emergency Contact Name",
                      field: "emergencyContactName",
                    },
                    {
                      title: "Emergency Contact Mobile",
                      field: "emergencyContactMobile",
                    },
                    {
                      title: "Emergency Contact Email",
                      field: "emergencyContactEmail",
                    },
                    {
                      title: "Emergency Contact Address",
                      field: "emergencyContactAddress",
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
                  // actions={[
                  //   {
                  //     icon: () => <PrintIcon />, // you can pass icon too
                  //     tooltip: "Export to Pdf",
                  //     onClick: () => downloadPdf(),
                  //     isFreeAction: true,
                  //   },
                  // ]}
                />
              </div>
            </div>
          </div>
          <div className="modal">
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Emergency Information</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
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
                  <Form.Group controlId="emergencyContactName">
                    <Form.Label>Emergency Contact Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactName"
                      value={editData.emergencyContactName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="emergencyContactMobile">
                    <Form.Label>Emergency Contact Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactMobile"
                      value={editData.emergencyContactMobile}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="emergencyContactEmail">
                    <Form.Label>Emergency Contact Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactEmail"
                      value={editData.emergencyContactEmail}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="emergencyContactAddress">
                    <Form.Label>Emergency Contact Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactAddress"
                      value={editData.emergencyContactAddress}
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
      </div>
    </div>
  );
};

export default EmergencyInfo;
