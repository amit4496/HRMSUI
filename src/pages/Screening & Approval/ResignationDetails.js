import MaterialTable from "@material-table/core";
import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { getData } from "../../Services/Api";
import { resignationDetails } from "../../Services/service";
import { useEffect } from "react";

const ResignationDetails = () => {
  const [ticketDetails, setTicketDetails] = useState([]);

  const FetchData = () => {
    getData(resignationDetails)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          setTicketDetails(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <div className="container">
        <h4>Resignation </h4>
        <hr />
        <MaterialTable
          title="Resignation Record"
          data={ticketDetails}
          columns={[
            {
              title: "Employee Id",
              field: "id",
            },

            {
              title: "regisnation Name",
              field: "employeeName",
            },
            {
              title: "Description",
              field: "description",
            },
            // {
            //   title: "Actions",
            //   field: "actions",
            //   render: (rowData) => (
            //     <Button
            //       className="btn btn-danger"
            //       onClick={() => handleDelete(rowData?.id)}
            //     >
            //       Delete
            //     </Button>
            //   ),
            // },
          ]}
        />
      </div>
    </>
  );
};

export default ResignationDetails;
