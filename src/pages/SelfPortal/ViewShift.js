import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { BASE_URL } from "../helper";

const ViewShift = () => {
  const [data, setData] = useState([]);

  const inputChangeHandler = (e) => {
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const [ticketDetails, setTicketDetails] = useState([]);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  // const handleDelete = (id) => {
  //   swalWithBootstrapButtons.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       swalWithBootstrapButtons.fire(
  //         'Deleted!',
  //         'Your file has been deleted.',
  //         'success'
  //       )
  //       fetch(`http://localhost:8081/shiftManagement/addShift/${id}`,{
  //         method:'DELETE',
  //         headers: {
  //           "Content-Type": "application/json",

  //          Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //           })
  //           .then((result)=>result.json())
  //           .then((response)=>{
  //               console.log(response)
  //               if(response?.Status == 200){
  //                 fetchData()
  //               }

  //             })
  //     } else if (
  //       /* Read more about handling dismissals below */
  //       result.dismiss === Swal.DismissReason.cancel
  //     ) {

  //     }
  //   })
  // }

  const Id = localStorage.getItem("email");

  const fetchData = () => {
    // const idString = String(Id); // Convert Id to a string
    fetch(`${BASE_URL}/shiftManagement/viewEmployee/${Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "dataaaaaaaaaaa");
        setTicketDetails(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, [ticketDetails]);

  return (
    <div className="container" style={{ width: "80vw" }}>
      <div>
        <h2>View Shift Data</h2>
      </div>
      <hr></hr>
      <MaterialTable
        title="Shift Record 111"
        data={ticketDetails}
        columns={[
          {
            title: "Employee Name",
            field: "employee",
          },

          {
            title: "Country",
            field: "country",
          },
          {
            title: "Date",
            field: "date",
          },
          {
            title: "Start Time",
            field: "startTime",
          },
          {
            title: "End Time",
            field: "endTime",
          },
          // {
          //   title: "Actions",
          //   field: "actions",
          //   render: (rowData) => (
          //     <Button className="bg bg-danger" onClick={() => handleDelete(rowData.id)}>Delete</Button>
          //   ),
          // },
        ]}
      />
    </div>
  );
};

export default ViewShift;
