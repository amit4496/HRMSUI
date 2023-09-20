import React, { useState } from 'react'
import { Form } from 'react-router-dom';

function AddEmployees() {
  const [showBasic, setshowBasic] = useState(false);
  const [showWork, setshowWork] = useState(false);
  const [showbank, setshowbank] = useState(false);
  const [showEmergency, setshowEmergency] = useState(false);

  const basicHandler = () => {
      setshowBasic(!showBasic);
  }
  const workHandler = () => {
      setshowWork(!showWork);
  }
  const bankingHandler = () => {
      setshowbank(!showbank);
  }
  const emergencyHandler = () => {
      setshowEmergency(!showEmergency);
  }
  return (
      <div >
          <h2 className='mb-4'>Add Employee</h2>
      <div className=' shadow-lg p-2 mb-5 bg-body rounded'>

          <p onClick={basicHandler} style={{cursor:'pointer'}}>Basic Information <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg></p>
          {showBasic && <form>
              <div className="container2">
                  <div className="bg-light">
                      <div className="row ">
                          <div className=" col-sm-2">
                              <label className="form-label">Employee ID:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-4">
                              <label className="form-label">Employee Name:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className="col-sm-3 ">
                              <label for="cars" id='label'>Which Company:</label>
                              <br />
                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>---Select Company---</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label for="cars" id='label'>Select Department:</label>
                              <br />
                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>---Select Department---</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-4 ">
                              <label className="form-label" for="cars" id='label'>Designation:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>---Select Designation---</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className=" col-sm-4">
                              <label className="form-label">Email:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-4">
                              <label className="form-label">Mobile:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label" >Joining Date:</label>
                              <div ><Form.Control type="date" name="date" ></Form.Control></div>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Reporting To:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>---Reporting To---</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label" >DOB:</label>
                              <div ><Form.Control type="date" name="date" ></Form.Control></div>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Work Type:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>---Permanent---</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                      </div>
                  </div>
              </div>

          </form>}
          <hr style={{ width: '70vw' }} />
          <p onClick={workHandler} style={{cursor:'pointer'}}>Work Information <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg></p>
          {showWork && <form>
              <div className="container2">
                  <div className="bg-light">
                      <div className="row ">
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Employement type:</label>

                              <select className="form-select form-control" aria-label="Default select example">
                                  <option selected disabled>Select Employement type</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Office Branch:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Select Branch</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Employee Grade:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Select Employee Grade </option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Employee Group:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Choose Employee Group</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Insurance avil:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Select insurance</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Gender:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Gender</option>
                                  <option value="abcd">Male</option>
                                  <option value="defg">Female</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Blood Group:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Group</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Incentive:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Yes</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                              </select>
                          </div>
                          <div className="col-sm-3 ">
                              <label className="form-label" for="cars" id='label'>Employee type:</label>

                              <select className="form-select" aria-label="Default select example">
                                  <option selected disabled>Choice</option>
                                  <option value="abcd">abcd</option>
                                  <option value="defg">defg</option>
                                  <option value="hijk">hijk</option>
                                  <option value="slmno">lmno</option>
                              </select>
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label">Value:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label" >Effective Date:</label>
                              <div ><Form.Control type="date" name="date" ></Form.Control></div>
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label">PF Account No:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label">ESI No:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label">CIN No:</label><br />
                              <input type="text" className="form-control" id="formGroupExampleInput" />
                          </div>
                          <div className=" col-sm-3">
                              <label className="form-label" >Leaving Date:</label>
                              <div ><Form.Control type="date" name="date" ></Form.Control></div>
                          </div>
                          <div className="col-sm-14">
                              <label className="form-label">Address:</label><br />
                              <textarea className='form-control' id='my box' rows="3"></textarea>
                          </div>
                          <div className="col-sm-14 pb-4">
                              <label className="form-label"> Description:</label><br />
                              <textarea className='form-control' id='my box' rows="3"></textarea>
                          </div>
                      </div>
                  </div>
              </div>
          </form>}
          <hr style={{ width: '70vw' }} />
          <p onClick={bankingHandler} style={{cursor:'pointer'}}>Banking Information <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg></p>
          {showbank &&
              <form>
                  <div className="container2">
                      <div className="bg-light">
                          <div className="row ">
                              <div className=" col-sm-6">
                                  <label className="form-label">Bank Account No:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">Bank Name:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">Bank Branch:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">IFSC Code:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label" for="cars" id='label'>Payment type:</label>

                                  <select className="form-select" aria-label="Default select example">
                                      <option selected disabled>Choice Payment type</option>
                                      <option value="abcd">abcd</option>
                                      <option value="defg">defg</option>
                                      <option value="hijk">hijk</option>
                                      <option value="slmno">lmno</option>
                                  </select>
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">Pan:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                          </div>
                      </div>
                  </div>
              </form>

          }
          <hr style={{ width: '70vw' }} />
          <p onClick={emergencyHandler} style={{cursor:'pointer'}}>Emergency Contact Information <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg></p>
          {showEmergency &&
              <form>
                  <div className="container2">
                      <div className="bg-light">
                          <div className="row ">
                              <div className=" col-sm-6">
                                  <label className="form-label">Emergency Contact Name:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">Emergency Contact Mobile:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">Emergency Contact Email:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                              <div className=" col-sm-6">
                                  <label className="form-label">Emergency Contact Address:</label><br />
                                  <input type="text" className="form-control" id="formGroupExampleInput" />
                              </div>
                          </div>
                      </div>
                  </div>
              </form>
          }
          <div className=' my-4'>
          <button className='btn btn-primary mx-2'>Update</button>
          <button className='btn btn-info '>Back</button>
          </div>
</div>
      </div>
  )
}

export default AddEmployees