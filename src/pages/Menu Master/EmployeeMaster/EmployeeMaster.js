import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { getData } from "../../../Services/Api";
import { Basic_Employee } from "../../../Services/service";
import { BASE_URL } from "../../helper";
// import MaterialTable from 'material-table';
// import { SaveAlt } from '@material-ui/icons';

const EmployeeMaster = () => {
  const [ticketDetails, setTicketDetails] = useState([]);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const handleDelete = (employeeId) => {
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
          fetch(`${BASE_URL}/basic/delete/${employeeId}`, {
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
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your file is safe 🙂",
            "error"
          );
        }
      });
  };

  const fetchData = () => {
    getData(Basic_Employee)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res1");
        setTicketDetails(res?.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container" style={{ width: "80vw" }}>
        <div className="d-flex">
          <h2>Employee Master Data</h2>
          <br />
          <br />
          <br />
          <br />
        </div>

        <MaterialTable
          style={{}}
          title="Employee Record"
          data={ticketDetails}
          columns={[
            {
              title: "Employee Id",
              field: "employeeId",
            },

            {
              title: "Employee Name",
              field: "employeeName",
            },
            {
              title: "Department Name",
              field: "selectDepartment",
            },
            {
              title: "Designation Name",
              field: "designation",
            },
            {
              title: "Email Id",
              field: "email",
            },
            {
              title: "Mobile Number",
              field: "mobile",
            },
            {
              title: "Joining Date",
              field: "joiningDate",
            },
            {
              title: "Reporting To",
              field: "reportingTo",
            },
            {
              title: "Date of Birth",
              field: "dob",
            },
            {
              title: "CTC",
              field: "ctc",
            },
            {
              title: "PF Number",
              field: "pfnumber",
            },
            {
              title: "PAN Number",
              field: "panNumber",
            },
            {
              title: "Aadhar Number",
              field: "aadhaarNumber",
            },

            {
              title: "Actions",
              field: "actions",
              render: (rowData) => (
                <Button
                  className="bg bg-danger"
                  onClick={() => handleDelete(rowData.employeeId)}
                >
                  Delete
                </Button>
              ),
            },
          ]}
          icons={
            {
              // Export: () => <SaveAlt />,
            }
          }
          options={{
            exportButton: true,
            exportCsv: (columns, data) => {
              alert(
                "You should develop a code to export " + data.length + " rows"
              );
            },
          }}
        />
      </div>
    </>
  );
};

export default EmployeeMaster;
