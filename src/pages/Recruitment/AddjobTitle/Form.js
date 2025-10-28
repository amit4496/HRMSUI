import { useEffect, useState } from "react";
import swal from 'sweetalert';
import MaterialTable from "@material-table/core";
import { getData } from "../../../Services/Api";
import { get_jobtitle } from "../../../Services/service";
import { BASE_URL } from "../../helper";
// import { json } from "react-router-dom";

const AddJobTitle = () => {
  const [data, setData] = useState({
    id:'',
    jobTitles: '',
    
  });
  const[jobDetails,setJobDetails]=useState([]);

  const inputChangeHandler = (e) => {
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData)

  }
  const submitHandler = () => {
    if(!data.jobTitles){
      alert("Please enter jobTitle")
    } else{

    fetch(`${BASE_URL}/addJobTitle/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 
      Accept: "*/*",
   Authorization: "Bearer " + localStorage.getItem("token"),

     },
      body: JSON.stringify(data)
    })
    .then((res)=> res.json())
    .then((data) => {
      console.log(data ,"datatta")
      if(data.Status == 201){
        swal("Success", "Job Title Added Successfully", "success");
        jobTitle()
        setData({
          jobTitles:""
        })
      } else{
        swal("", `${data.error_message}`);
    
      }
    }).catch((err)=>console.log(err))
  }
  }
  const jobTitle =()=>{
    getData(get_jobtitle)
    .then((response) => response.json())
    .then((data) =>{
      console.log(data , "data")
      setJobDetails(data.Data)
    }
)
    .catch((err) => console.error(err));
  }

useEffect(()=>{
  jobTitle()
},[])


    return (
      <>
      <div className='container ' >
        <h3>Add Job Titles</h3>
        <div className='form-control '>
          <div className="row mx-2">
            <div className="col-sm-6">
              <label class="form-label">Job Titles:</label><br />
              <input placeholder="Enter job title..." value={data.jobTitles} type="text" className="form-control" id="formGroupExampleInput" name="jobTitles" onChange={inputChangeHandler} />
            </div>
          </div>
          <button onClick={submitHandler} className="btn btn-primary btn-sm my-3 mx-5 ">Save</button>
        </div>

      </div>
      <MaterialTable
      columns={[
        {
          title: "Job Title",
          field: "jobTitles",
        }
      ]}
      data={jobDetails}
      title="Job Titles"
    />
    </>
    )
  }

  export default AddJobTitle