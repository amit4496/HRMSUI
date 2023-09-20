import React, { useRef, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import Swal from "sweetalert2";

function App() {
  const fileInputRef = useRef(null); // Reference to the file input element
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", selectedFile);
    // Make an HTTP POST request to the server
    axios
      .post("https://apihrms.atwpl.com/attendance/upload", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        swal("Success", "File Uploaded Successfully", "success");
        setSelectedFile(null); // Reset the selectedFile state to null
        console.log("selectedFile after reset:", selectedFile); // Debugging
        fileInputRef.current.value = ""; // Reset the file input value
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.error_message}`,
        });
        setSelectedFile(null); // Reset the selectedFile state to null
        console.log("selectedFile after reset:", selectedFile); // Debugging
        fileInputRef.current.value = ""; // Reset the file input value
      });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  console.log("selectedFile:", selectedFile); // Debugging

  return (
    <div className="container">
      <h4>Bulk Attendance</h4>
      <hr />
      <div className="bg-light">
        <div className="row "></div>
        <form onSubmit={handleSubmit}>
          <h1>Add Attendance</h1>
          <input
            className="form-control mt-4 "
            type="file"
            ref={fileInputRef} // Set the ref to access the file input element
            onChange={handleFileChange}
          />
          <button type="submit" className="btn btn-primary mt-4">
            Upload File
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
