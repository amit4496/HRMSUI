import React, { useEffect, useState } from "react";

import Calender from "./Dashboard/Calender/Calender";
import DasNav from "./Dashboard/Navbar/DasNav";
import "./dashboard.css";
import nodataimg from "../components/img/nodata.png";

// Test component for 403 error handling
import TestApi403 from "../components/TestApi403/TestApi403";

import { getData } from "../Services/Api";
import { User, get_leaveDetails, work_data } from "../Services/service";
import { get_leave } from "../Services/service";
import { useNavigate } from "react-router";
import { get_attendence } from "../Services/service";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { PolarArea } from "react-chartjs-2";
// import Chart from 'chart.js';
import Chart from "chart.js/auto";

function Dashboard() {
  const [filteredData, setFilteredData] = useState([]);
  const [extractData, setExtractData] = useState([]);
  const [leaverequest, setLeavesRequest] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [upcomingbirthday, setUpcomingBirthday] = useState([]);
  const [todaysbirthday, setTodaysBirthday] = useState([]);
  const [joiningDate, setJoiningDate] = useState([]);
  const [willjoiningDate, setwillJoiningDate] = useState([]);
  const [willHoliday, setwillHoliday] = useState([]);
  const [todayHoliday, setTodayHoliday] = useState([]);
  const [pie, setPie] = useState([]);

  const workData = () => {
    getData(work_data)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        const permanent = data?.filter(
          (item) => item.employmentType === "PERMANENT"
        );
        setFilteredData(permanent);
        const probation = data?.filter(
          (item) => item.employmentType === "PROBATION"
        );
        setExtractData(probation);
      });
  };
  const handleClick = () => {
    navigate("/screening&Approval/PendingLeaveApproval");
  };

  const LeaveData = () => {
    getData(get_leave)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        const leave = res.Data?.filter((item) => item.status === "3");
        setLeavesRequest(leave);
      })
      .catch((err) => console.error(err));
  };
  const GetAttendence = () => {
    getData(get_attendence)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "attendance");
        const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"
        const attendance = res.Data?.filter(
          (item) => item.status === "Present" && item.date === currentDate
        );
        setAttendance(attendance);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    workData();
    LeaveData();
    GetAttendence();
    // upcomingEventsData();
  }, []);

  const fetchEventsData = () => {
    const getTodayEventsData = () => {
      getData(User) // Assuming User is a valid parameter or object
        .then((response) => response.json())
        .then((res) => {
          // Here, 'res' should contain the fetched data
          console.log(res, "attendance");

          // Get the current date and six months ago from today
          const currentDate = new Date();
          const sixMonthsAgo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 6,
            currentDate.getDate()
          )
            .toISOString()
            .split("T")[0];

          // Filter the events based on specific criteria
          const TodaysEvents = res.Data?.filter((item) => {
            // Check if six months have been completed since the joiningDate or dob
            const joiningDateSixMonthsAgo = new Date(item.joiningDate);
            joiningDateSixMonthsAgo.setMonth(
              joiningDateSixMonthsAgo.getMonth() + 6
            );

            return (
              // item.joiningDate === currentDate.toISOString().split("T")[0] || // Events that happened today
              joiningDateSixMonthsAgo <= currentDate &&
              item.joiningDate > sixMonthsAgo // Events within the last six months since date of birth
            );
          });

          setTodaysEvents(TodaysEvents);

          console.log(TodaysEvents, "Todays events");
        })
        .catch((err) => console.error(err));
    };
    const getTodayEventcompleted = () => {
      getData(User) // Assuming User is a valid parameter or object
        .then((response) => response.json())
        .then((res) => {
          // Here, 'res' should contain the fetched data
          console.log(res, "attendance");

          // Get the current date and six months ago from today
          const currentDate = new Date();
          const sixMonthsAgo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 6,
            currentDate.getDate()
          )
            .toISOString()
            .split("T")[0];

          // Filter the events based on specific criteria
          const TodaysEvents = res.Data?.filter((item) => {
            // Check if six months have been completed since the joiningDate or dob
            const joiningDateSixMonthsAgo = new Date(item.joiningDate);
            joiningDateSixMonthsAgo.setMonth(
              joiningDateSixMonthsAgo.getMonth() + 6
            );

            return item.joiningDate === currentDate.toISOString().split("T")[0];
          });

          // Assuming setTodaysEvents is a function to set the filtered events
          setJoiningDate(TodaysEvents);

          console.log(TodaysEvents, "Todays events");
        })
        .catch((err) => console.error(err));
    };
    const getTodayHoliday = () => {
      getData(get_leaveDetails) // Assuming User is a valid parameter or object
        .then((response) => response.json())
        .then((res) => {
          // Here, 'res' should contain the fetched data
          console.log(res, "attendance");

          // Get the current date and six months ago from today
          const currentDate = new Date();

          // Filter the events based on specific criteria
          const TodaysEvents = res.Data?.filter((item) => {
            // Check if six months have been completed since the joiningDate or dob

            return item.fromDate === currentDate.toISOString().split("T")[0];
          });

          // Assuming setTodaysEvents is a function to set the filtered events
          setTodayHoliday(TodaysEvents);

          console.log(TodaysEvents, "Todays events");
        })
        .catch((err) => console.error(err));
    };
    const getUpcomingEventcompleted = () => {
      getData(User) // Assuming User is a valid parameter or object
        .then((response) => response.json())
        .then((res) => {
          // Here, 'res' should contain the fetched data
          console.log(res, "attendance");

          // Get the current date
          const currentDate = new Date();

          // Calculate one week from today
          const oneWeekFromToday = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 7
          ).toISOString();

          // Calculate tomorrow's date
          const tomorrowDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          ).toISOString();

          // Filter the events based on specific criteria (from one week till tomorrow)
          const upcomingEvents = res.Data?.filter((item) => {
            // Check if the event date is within the specified range
            return (
              item.joiningDate >= tomorrowDate &&
              item.joiningDate <= oneWeekFromToday
            );
          });

          // Assuming setwillJoiningDate is a function to set the filtered events
          setwillJoiningDate(upcomingEvents);

          console.log(
            upcomingEvents,
            "Upcoming events from tomorrow till one week ahead"
          );
        })
        .catch((err) => console.error(err));
    };
    const getUpcomingHoliday = () => {
      getData(get_leaveDetails) // Assuming User is a valid parameter or object
        .then((response) => response.json())
        .then((res) => {
          // Here, 'res' should contain the fetched data
          console.log(res, "attendance");

          // Get the current date
          const currentDate = new Date();

          // Calculate one week from today
          const oneWeekFromToday = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 7
          ).toISOString();

          // Calculate tomorrow's date
          const tomorrowDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          ).toISOString();

          // Filter the events based on specific criteria (from one week till tomorrow)
          const upcomingholiday = res.Data?.filter((item) => {
            // Check if the event date is within the specified range
            return (
              item.fromDate >= tomorrowDate && item.fromDate <= oneWeekFromToday
            );
          });

          // Assuming setwillJoiningDate is a function to set the filtered events
          setwillHoliday(upcomingholiday);

          console.log(
            upcomingholiday,
            "Upcoming events from tomorrow till one week ahead"
          );
        })
        .catch((err) => console.error(err));
    };

    const getTodayBirthday = () => {
      getData(User)
        .then((response) => response.json())
        .then((res) => {
          console.log(res, "attendance");
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1 to get the current month (1-12).
          const currentDay = currentDate.getDate();

          const TodaysBirthday = res.Data?.filter((item) => {
            const dob = item.dob;
            if (!dob) return false; // If the dob is missing for the user, exclude them.

            const dobParts = dob.split("-");
            const birthMonth = parseInt(dobParts[1], 10);
            const birthDay = parseInt(dobParts[2], 10);

            return birthMonth === currentMonth && birthDay === currentDay;
          });

          setTodaysBirthday(TodaysBirthday);
          console.log(TodaysBirthday, "Todays events");
        })
        .catch((err) => console.error(err));
    };

    const getUpcomingEventsData = async () => {
      getData(User)
        .then((response) => response.json())
        .then((res) => {
          console.log(res, "attendance");
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();

          const upcomingEvents = res.Data?.filter((item) => {
            const eventDate = new Date(item.joiningDate);
            const eventDateSixMonths = new Date(
              eventDate.getFullYear(),
              eventDate.getMonth() + 6,
              eventDate.getDate()
            );

            // Calculate one week before the event (six months from the joining date)
            const oneWeekBeforeEvent = new Date(
              eventDateSixMonths.getFullYear(),
              eventDateSixMonths.getMonth(),
              eventDateSixMonths.getDate() - 7
            );

            // Check if the event date (ignoring the year) falls within the time range
            const isUpcomingEvent =
              item.joiningDate &&
              currentDate >= oneWeekBeforeEvent && // Start from one week before the event
              currentDate < eventDateSixMonths; // End before the exact six-month mark

            return isUpcomingEvent;
          });

          setUpcomingEvents(upcomingEvents);
          console.log(upcomingEvents, "upcoming events");
        })
        .catch((err) => console.error(err));
    };

    const getUpcomingBirthday = () => {
      getData(User)
        .then((response) => response.json())
        .then((res) => {
          console.log(res, "attendance");
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();

          const oneWeekFromTomorrow = new Date(
            currentYear,
            currentDate.getMonth(),
            currentDate.getDate() + 1 + 7 // Adding 1 day for tomorrow and 7 days for the week
          );

          const upcomingEvents = res.Data?.filter((item) => {
            const eventDate = new Date(item.dob);
            const eventDateThisYear = new Date(
              currentYear,
              eventDate.getMonth(),
              eventDate.getDate()
            );

            // Check if the event date (ignoring the year) is within the next one week starting from tomorrow
            const isUpcomingEvent =
              item.dob &&
              eventDateThisYear >= currentDate && // Start from tomorrow
              eventDateThisYear <= oneWeekFromTomorrow;

            return isUpcomingEvent;
          });

          setUpcomingBirthday(upcomingEvents);
          console.log(upcomingEvents, "upcoming events");
        })
        .catch((err) => console.error(err));
    };
    getTodayEventcompleted();
    getTodayBirthday();
    getUpcomingBirthday();
    getUpcomingEventsData();
    getTodayEventsData();
    getUpcomingHoliday();
    getUpcomingEventcompleted();
    getTodayHoliday();
  };

  useEffect(() => {
    workData();
    LeaveData();
    GetAttendence();
    fetchEventsData();
  }, []);

  const PieChart = () => {
    getData(User)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setPie(res.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    PieChart();
  }, []);

  const labels = [...new Set(pie?.map((item) => item.selectDepartment))];
  const counts = pie?.reduce((acc, item) => {
    if (item.selectDepartment in acc) {
      acc[item.selectDepartment]++;
    } else {
      acc[item.selectDepartment] = 1;
    }
    return acc;
  }, {}) ?? 0;
  const values = Object.values(counts);
  const colors = generateRandomColors(pie?.length);

  const setChartData = {
    datasets: [
      {
        data: values,
        backgroundColor: colors,
      },
    ],
    labels: labels,
    options: {
      legend: {
        position: "right",
        align: "end",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
    },
  };

  function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      colors.push(randomColor);
    }
    return colors;
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <DasNav />
      
      <div className="carddisplay">
        <div className="card card1">
          <h3>Permanent Employee</h3>
          <p>{filteredData?.length}</p>
        </div>
        <div className="card card2">
          <h3>Under Probation</h3>
          <p>{extractData?.length}</p>
        </div>
        <span className="card card3" onClick={handleClick}>
          <h3>Leave Request</h3>
          <p>{leaverequest?.length}</p>
        </span>

        <div className="card card4">
          <h3> Present Employee</h3>
          <p>{attendance?.length}</p>
        </div>
      </div>
      <div className="carddisplay11">
        <div className="card11 card5">
          <h4 className="upcoming">UPCOMING EVENTS</h4>
          {upcomingEvents?.length +
            willjoiningDate?.length +
            willHoliday?.length +
            upcomingbirthday?.length >
          4 ? (
            <marquee direction="up" scrollamount="5">
              <ul>
                {upcomingEvents?.map((e) => {
                  const joiningDate = new Date(e.joiningDate);
                  const endDate = new Date(
                    joiningDate.getFullYear(),
                    joiningDate.getMonth() + 6,
                    joiningDate.getDate()
                  );
                  const month = endDate.toLocaleString("default", {
                    month: "long",
                  });
                  const day = endDate.getDate();

                  return (
                    <li key={e.id}>
                      Probation of {e.employeeName} is Ending on {month} {day}
                    </li>
                  );
                })}
              </ul>

              <ul>
                {upcomingbirthday?.map((e) => {
                  const dobDate = new Date(e.dob);
                  const month = dobDate.toLocaleString("default", {
                    month: "long",
                  });
                  const day = dobDate.getDate();

                  return (
                    <li key={e.id}>
                      Birthday of {e.employeeName} is on {month} {day}
                    </li>
                  );
                })}
              </ul>
              <ul>
                {willjoiningDate?.map((e) => {
                  const joining = new Date(e.joiningDate);
                  const month = joining.toLocaleString("default", {
                    month: "long",
                  });
                  const day = joining.getDate();

                  return (
                    <li key={e.id}>
                      {e.employeeName} will join on {month} {day}
                    </li>
                  );
                })}
              </ul>
              <ul>
                {willHoliday?.map((e) => {
                  const holiday = new Date(e.fromDate);
                  const month = holiday.toLocaleString("default", {
                    month: "long",
                  });
                  const day = holiday.getDate();

                  return (
                    <li key={e.id}>
                      There will be Holiday due to {e.holidayName} on
                      {month} {day}
                    </li>
                  );
                })}
              </ul>
            </marquee>
          ) : (
            <div>
              {willjoiningDate?.length ||
              upcomingbirthday?.length ||
              willHoliday?.length ||
              upcomingEvents?.length ? (
                <>
                  <ul>
                    {upcomingEvents?.map((e) => {
                      const joiningDate = new Date(e.joiningDate);
                      const endDate = new Date(
                        joiningDate.getFullYear(),
                        joiningDate.getMonth() + 6,
                        joiningDate.getDate()
                      );
                      const month = endDate.toLocaleString("default", {
                        month: "long",
                      });
                      const day = endDate.getDate();

                      return (
                        <li key={e.id}>
                          Probation of {e.employeeName} is Ending on {month}{" "}
                          {day}
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {upcomingbirthday?.map((e) => {
                      const dobDate = new Date(e.dob);
                      const month = dobDate.toLocaleString("default", {
                        month: "long",
                      });
                      const day = dobDate.getDate();

                      return (
                        <li key={e.id}>
                          Birthday of {e.employeeName} is on {month} {day}
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {willjoiningDate?.map((e) => {
                      const joining = new Date(e.joiningDate);
                      const month = joining.toLocaleString("default", {
                        month: "long",
                      });
                      const day = joining.getDate();

                      return (
                        <li key={e.id}>
                          {e.employeeName} will join on {month} {day}
                        </li>
                      );
                    })}
                  </ul>
                  <ul>
                    {willHoliday?.map((e) => {
                      const holiday = new Date(e.fromDate);
                      const month = holiday.toLocaleString("default", {
                        month: "long",
                      });
                      const day = holiday.getDate();

                      return (
                        <li key={e.id}>
                          There will be Holiday due to {e.holidayName} on
                          {month} {day}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <img className="nodata" src={nodataimg} alt="No data" />
                  <span className="NOdataa">NO Upcoming events </span>
                </>
              )}
            </div>
          )}
        </div>
        <div
          style={{
            width: "30%",
            height: "auto%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PolarArea data={setChartData} />
        </div>

        {/* <Calender /> */}

        <div className="card11 card6">
          <h4 className="upcoming">TODAY'S EVENT</h4>
          {todaysbirthday?.length +
            joiningDate?.length +
            todayHoliday?.length +
            todaysEvents?.length >
          4 ? (
            <marquee direction="up" scrollamount="5">
              {todaysEvents?.length || todaysbirthday?.length ? (
                <>
                  {todaysEvents?.length > 0 && (
                    <ul>
                      {todaysEvents?.map((e) => (
                        <li key={e.id}>
                          Provision period of {e.employeeName} is completed
                        </li>
                      ))}
                    </ul>
                  )}
                  {joiningDate?.length > 0 && (
                    <ul>
                      {joiningDate?.map((e) => (
                        <li key={e.id}> {e.employeeName} Will Join Today</li>
                      ))}
                    </ul>
                  )}
                  {todayHoliday?.length > 0 && (
                    <ul>
                      {todayHoliday?.map((e) => (
                        <li key={e.id}>
                          {" "}
                          Today is holiday Due to {e.holidayName}{" "}
                        </li>
                      ))}
                    </ul>
                  )}
                  {todaysbirthday?.length > 0 && (
                    <ul>
                      {todaysbirthday?.map((e) => (
                        <li key={e.id}>Happy BirthDay {e.employeeName}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p>No data available for today's events and birthdays.</p>
              )}
            </marquee>
          ) : (
            <div>
              {todaysEvents?.length ||
              joiningDate?.length ||
              todaysbirthday?.length ? (
                <>
                  {todaysEvents?.length > 0 && (
                    <ul>
                      {todaysEvents?.map((e) => (
                        <li key={e.id}>
                          Provision period of {e.employeeName} is completed
                        </li>
                      ))}
                    </ul>
                  )}
                  {joiningDate?.length > 0 && (
                    <ul>
                      {joiningDate?.map((e) => (
                        <li key={e.id}>{e.employeeName} will Join Today</li>
                      ))}
                    </ul>
                  )}
                  {todaysbirthday?.length > 0 && (
                    <ul>
                      {todaysbirthday?.map((e) => (
                        <li key={e.id}>Happy BirthDay {e.employeeName}</li>
                      ))}
                    </ul>
                  )}
                  {todayHoliday?.length > 0 && (
                    <ul>
                      {todayHoliday?.map((e) => (
                        <li key={e.id}>
                          {" "}
                          Today is holiday Due to {e.holidayName}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  <img className="nodata" src={nodataimg} alt="No data" />
                  <span className="NOdataa"> No Events Today</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
