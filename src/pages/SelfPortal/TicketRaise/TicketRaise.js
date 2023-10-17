import React, { useState, useEffect } from 'react';
import MaterialTable from "@material-table/core";

function TicketRaise() {
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    name: localStorage.getItem("user"),
    startdate: "",
    enddate: "",
    userName: localStorage.getItem("email"),
    status: "",
  });

  const [form, setForm] = useState({
    ticket: "",
  });

  const [tableData, setTableData] = useState([]); // Initialize table data state

  const handleChange = (e) => {
    const { name, value } = e.target;

    const regex = /^[a-zA-Z\s]*$/;

    if (name === "name" && !regex.test(value)) {
      setFormData({ ...formData });
      setError(true);
      return;
    }

    setFormData({ ...formData, [name]: value });
    setError(false);
  };

  const inputChangeHandler1 = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTicket = {
      id: tableData.length + 1, // Generate a unique ID for the ticket
      selectEmployee: formData.name,
      ticket: form.ticket,
      status: "Open", // You can set the initial status here
    };

    setTableData([...tableData, newTicket]);
    setForm({ ticket: '' }); // Clear the ticket input field
  };

  useEffect(() => {
   
    setTableData([
      
    ]);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Create Ticket</h2>
        <hr></hr>
        <div className="row">
          <div className="col-sm-4">
            <label className="form-label">
              Employee Name:<span style={{ color: "red" }}> * </span>
            </label>
            <input
              value={formData.name}
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
              placeholder="Enter Your Name"
              list="employee"
              required
              disabled
            />
          </div>

          <div className="col-sm-4 mt-2">
            <label htmlFor="cars" id="label">
              User Id:<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <input
              value={formData.userName}
              className="form-control"
              aria-label="Default select example"
              name="userName"
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="col-sm-4">
            <label htmlFor="cars" id="label">
              Issue:<span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <textarea
              type="text"
              className="form-control"
              name="ticket"
              value={form.ticket}
              onChange={inputChangeHandler1}
              required
            ></textarea>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>

        <br />
        <br />
        <MaterialTable
          style={{ width: "80vw" }}
          title="Ticket Records"
          columns={[
            { title: "ID", field: "id" },
            { title: "Employee Name", field: "selectEmployee" },
            { title: "Issue", field: "ticket" },
            { title: "Status", field: "status" },
          ]}
          data={tableData}
        />
      </form>
    </>
  );
}

export default TicketRaise;
