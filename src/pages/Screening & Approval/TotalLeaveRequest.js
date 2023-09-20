import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { getData } from "../../Services/Api";
import { get_leave } from "../../Services/service";
import { RiRefreshLine } from "react-icons/ri";

const TotalLeaveRequest = () => {
  const [leave, setLeave] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIconMoving, setIsIconMoving] = useState(false);

  const fetchData = () => {
    getData(get_leave)
      .then((response) => response.json())

      .then((res) => {
        console.log(res, "res");

        const leave = res.Data?.filter(
          (item) => item.status === "2" || item.status === "1"
        );

        setLeave(leave);
      })

      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, status) => {
    const url = `https://apihrms.atwpl.com/CreateLeaveRequest/put/${id}`; // Replace with your API endpoint
    const payload = { status: status.toString() }; // Replace with your data object

    setSelectedId(id);
    setIsLoading(true);
    try {
      const response = await axios.put(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const updatedData = response.data;

      // Update the leave record with the updated status
      setLeave((prevLeave) => {
        return prevLeave.map((item) =>
          item.id === id ? { ...item, status: status.toString() } : item
        );
      });

      setSelectedId(id); // Set the clicked id as selected
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Disable loading state when the API call is completed (success or error)
    }
  };

  const handleRefresh = () => {
    setIsIconMoving(true); // Start the animation
    fetchData(); // Call fetchData to refresh the data
    setTimeout(() => {
      setIsIconMoving(false); // Stop the animation after a delay
    }, 1000);
  };

  return (
    <>
      <div className="container">
        <h4>Total Leave Approved</h4>
        <hr />
        <MaterialTable
          title={
            <div>
              <div style={{ textAlign: "center" }}>
                Leave Record
                <RiRefreshLine
                  size={25}
                  color="#007bff"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    animation: isIconMoving
                      ? "rotateIcon 1s linear infinite"
                      : "none",
                  }}
                  onClick={handleRefresh}
                />
              </div>
            </div>
          }
          data={leave}
          columns={[
            {
              title: "Employee Name",
              field: "selectEmployee",
            },
            {
              title: "Leave Approver",
              field: "leaveApprover",
            },
            {
              title: "Leave Type",
              field: "leaveType",
            },
            {
              title: "Date",
              field: "date",
            },
            {
              title: "Reason",
              field: "reasonForLeave",
            },
            {
              title: "Actions",
              field: "actions",
              render: (rowData) => (
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
      <style>
        {`
          @keyframes rotateIcon {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default TotalLeaveRequest;
