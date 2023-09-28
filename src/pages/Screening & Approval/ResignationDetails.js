import MaterialTable from "@material-table/core";

import React, { useState, useEffect } from "react";

import axios from "axios";

import { Button, Spinner } from "react-bootstrap";

import { getData } from "../../Services/Api";

import { resignationDetails } from "../../Services/service";

 

const ResignationDetails = () => {

  const [ticketDetails, setTicketDetails] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

 

  const FetchData = () => {

    getData(resignationDetails)

      .then((response) => response.json())

      .then((res) => {

        if (res.Status === 200) {

          setTicketDetails(res?.Data);

        }

      })

      .catch((err) => console.error(err));

  };

 

  useEffect(() => {

    FetchData();

  }, []);

 

  const handleAction = (id, status) => {

    // Disable the buttons and show a loading spinner

    setSelectedId(id);

    setIsLoading(true);

 

    // Make an API request to update the status

    axios

      .post(`https://apihrms.atwpl.com/updateResignationStatus`, { id, status })

      .then((response) => {

        if (response.data.Status === 200) {

          // Update the ticketDetails state to reflect the change

          const updatedTicketDetails = ticketDetails.map((item) => {

            if (item.id === id) {

              return {

                ...item,

                status: status.toString(), // Update the status

              };

            }

            return item;

          });

 

          setTicketDetails(updatedTicketDetails);

        } else {

          // Handle error scenario

          console.error("Failed to update status");

        }

      })

      .catch((error) => {

        // Handle error scenario

        console.error(error);

      })

      .finally(() => {

        // Re-enable buttons and hide the loading spinner

        setSelectedId(null);

        setIsLoading(false);

      });

  };

 

  return (

    <>

      <div className="container container-w">

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

              title: "Employee Name",

              field: "employeeName",

            },

            {

              title: "Description",

              field: "description",

            },

            {

              title: "Assests",

              field: "assests",

              render: (rowData) => (

                <div>

                  <input

                    type="checkbox"

                    id={`noc-checkbox-${rowData.id}`}

                    checked={rowData.assests && rowData.assests.includes("NOC")}

                   

                  />

                  <label htmlFor={`noc-checkbox-${rowData.id}`}>NOC</label>

             

                  <br />

             

                  <input

                    type="checkbox"

                    id={`laptop-checkbox-${rowData.id}`}

                    checked={rowData.assests && rowData.assests.includes("Laptop Submission")}

                   

                  />

                  <label htmlFor={`laptop-checkbox-${rowData.id}`}>Laptop Submission</label>

                </div>

              ),

             

            },

            {

              title: "Actions",

              field: "actions",

              render: (rowData) =>

              (

                <div

                  className="w-100 action-buttons"

                  style={{ display: "flex", justifyContent: "space-between" }}

                >

                  {rowData.status === "1" ? (

                    <Button

                      variant="success"

                      size="sm"

                      className="round-button"

                      disabled

                    >

                      Approved

                    </Button>

                  ) : rowData.status === "2" ? (

                    <Button

                      variant="danger"

                      size="sm"

                      className="round-button"

                      disabled

                    >

                      Disapproved

                    </Button>

                  ) : (

                    <>

                      {selectedId === rowData.id ? (

                        <Button

                          variant="outline-success"

                          size="sm"

                          className="round-button"

                          disabled

                        >

                          <div className="custom-spinner">

                            <Spinner

                              as="span"

                              animation="border"

                              size="sm"

                              role="status"

                              aria-hidden="true"

                            />

                            <span className="visually-hidden">Loading...</span>

                          </div>

                        </Button>

                      ) : (

                        <Button

                          variant="outline-success"

                          size="sm"

                          style={{ margin: "2%" }}

                          className="btn btn-sm btn-outline-success px-3 rounded-4"

                          onClick={() => handleAction(rowData.id, 1)}

                        >

                          Approve

                        </Button>

                      )}

 

                      {selectedId === rowData.id ? (

                        <Button

                          variant="outline-danger"

                          size="sm"

                          className="round-button"

                          disabled

                        >

                          <div className="custom-spinner">

                            <Spinner

                              as="span"

                              animation="border"

                              size="sm"

                              role="status"

                              aria-hidden="true"

                            />

                            <span className="visually-hidden">Loading...</span>

                          </div>

                        </Button>

                      ) : (

                        <Button

                          variant="outline-danger"

                          size="sm"

                          style={{ margin: "2%" }}

                          className="btn btn-sm btn-outline-danger px-3 rounded-4"

                          onClick={() => handleAction(rowData.id, 2)}

                        >

                          Disapprove

                        </Button>

                      )}

                    </>

                  )}

                </div>

              ),

            },

          ]}

        />

      </div>

    </>

  );

};

 

export default ResignationDetails;