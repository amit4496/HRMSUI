import { useState,useEffect } from "react";
import swal from 'sweetalert';
import { getData } from "../../../Services/Api";
import { User, get_jobtitle } from "../../../Services/service";
import { BASE_URL } from "../../helper";

const AddJobVacancy = () => {
  const [data,setData]=useState({
    jobTitle:'',
    vacancyName:'',
    hiringManager:'',
    numberOfPosition:'',
    jobLocation:'',
    jobDescription:'',
    active:'',

  });
const[show,setShow]=useState([]);
const[itemshow,setItemshow]=useState([])
const[active,setActive]=useState([]);
 const inputChangeHandler=(e)=>{
    let newData={...data};
    newData[e.target.name]=e.target.value;
    setData(newData)
    
 }
 const submitHandler=(e)=>{
  // console.log(JSON.stringify(data))
  fetch(`${BASE_URL}/vancancies/vacancy`, {
      method: "POST",
      headers:{ "Content-Type": "application/json",
      Accept: "*/*" ,
   Authorization: "Bearer " + localStorage.getItem("token")
  },
      body: JSON.stringify(data)
    }).then((res) => res.json())
      .then((dataa)=>{
console.log("data", dataa)
    })
}



const fetchData = () =>{
getData(get_jobtitle)
  .then((response) =>{
    return response.json();
  })
  .then((data) =>{
    console.log(data , 'dataataa')
    setShow(data?.Data)
  })
}


 const fetchData1 = () =>{
 
  getData(User)
  .then((response) =>{
    return response.json();
  })
  .then((data) =>{
    setItemshow(data.Data)
  })
}
useEffect(()=>
{
  fetchData1();
  fetchData()
},[])


  return (
    <div className="container">
      <h4>Add Job Vacancy</h4>
      <hr />
      <div className="bg-light">
        <div className="row ">


          <div className="col-sm-6 mt-2">
            <label for="cars" id='label'>Job Title:</label>
            <br />
            {/* <select class="form-select" aria-label="Default select example"> */}
            <select valueType={data.jobTitle} class="form-select" aria-label="Default select example"name="jobTitle" onChange={inputChangeHandler}>
              <option selected disabled>Select Job Title</option>
              {show.map(e=>(<option value={e.jobTitles}>{e.jobTitles}</option>))}
            </select>
          </div>

          <div className="col-sm-6">
            <label class="form-label">Vacancy Name</label><br />
            {/* <input type="text" class="form-control" id="formGroupExampleInput" /> */}
            <input placeholder="Enter Vacancy Name" value={data.vacancyName} type="text" className="form-control" id="formGroupExampleInput" name="vacancyName" onChange={inputChangeHandler}/>
          </div>

          <div className="col-sm-6 mt-2">
            <label for="cars" id='label'>Hiring Manager:</label>
            <br />
            {/* <select class="form-select" aria-label="Default select example"> */}
            <select valueType={data.hiringManager}class="form-select" aria-label="Default select example" name="hiringManager" onChange={inputChangeHandler}>
              <option selected disabled>Select Hiring Manager</option>
              {itemshow.map(e=>(<option value={e.employeeName}>{e.employeeName}</option>))}
            </select>
          </div>

          <div className="col-sm-6">
            <label class="form-label">Number Of Postion:</label><br />
            {/* <input type="text" class="form-control" id="formGroupExampleInput" /> */}
            <input placeholder="Enter Number of position" value={data.numberOfPosition} type="text" className="form-control" id="formGroupExampleInput" name="numberOfPosition" onChange={inputChangeHandler} />
          </div>
          <div className="col-sm-6">
            <label class="form-label">Job Location:</label><br />
            {/* <input type="text" class="form-control" id="formGroupExampleInput" /> */}
            <input placeholder="Enter Job Location" value={data.jobLocation} type="text" className="form-control" id="formGroupExampleInput" name="jobLocation" onChange={inputChangeHandler} />
          </div>
          <div className="col-sm-6">
            <label class="form-label">Job Description:</label><br />
            <input placeholder="Enter job Description" value={data.jobDescription} type="text" className="form-control" id="formGroupExampleInput" name="jobDescription" onChange={inputChangeHandler}/>
          </div>
        </div>
        {/* <div>
          <label class="form-label">Active:</label><br />
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="active" id="inlineRadio1" value="1" onChange={(e)=> setActive(e.target.value)}/>
            <label class="form-check-label" htmlFor="inlineRadio1">Yes</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="active" id="inlineRadio2" value="0" onChange={(e)=> setActive(e.target.value)} />
            <label class="form-check-label" htmlFor="inlineRadio2">No</label>
          </div>
        </div> */}
        <div> 
          <button onClick={submitHandler} className="btn btn-primary mt-4">Save</button>
          </div>
      </div>
    </div>

  )
}

export default AddJobVacancy