import { useEffect, useState } from "react";     //These are the hook fucntions in react
import axios from "axios";    //import axios it is used for routing
import { pdfjs } from "react-pdf";  //import pdfjs function from react-pdf
import './App.css';
import Pdfshow from "./pdfshow";

// Configure PDF.js worker

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


//Function to Get pdf from user and upload on database

function App() {

  const [file, setFile] = useState("");
  const [url, setUrl] = useState(null);
  const [pdf, setPdf] = useState("");

  // When the user submit their pdf below fucntion is executed

  const handleFormSubmit = async (e) => {
    try {

      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }
      e.preventDefault();

      // send data in the form data type to send any files

      const formData = new FormData();
      formData.append("file", file);

      // send request using axios in the post method to the server
      const result = await axios.post(
        "http://localhost:5000/pdf/uploadpdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(result.data);
      if (result.data.success === true) {

        // Get the response from the server and store on result variable and set specific data to setURl

        setUrl(result.data.result);
      }
      else {

        // If the result is not success then alert the user
        alert(result.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong, please try again later");
    }

  };


  // show the uploaded file in the browser

  const showPdf = (url) => {
    setPdf(`http://localhost:5000/files/${url}`)
  };


  // jsx code for browser frontend

  return (

    // below div has a form element and get pdf file form the user and submited
    <div className="App">
      <form className="formStyle" onSubmit={handleFormSubmit}>
        <h4>UPLOAD PDF</h4><br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        /><br /><br />
        <button class="btn btn-primary" type="submit"> Submit</button>
      </form>

      {/* below code is executed when the url varibale has some data */}
      {url &&
        <div className="uploaded-pdf">
          <h4>uploaded pdf</h4>
          <div className="inner-div">
            <h6>Title: {url?.pdfname}</h6>
            <button
              className="btn btn-primary"
              onClick={() => showPdf(url?.pdf)}
            >
              Show Pdf
            </button>
          </div>
        </div>
      }
      {/* This will render Pdhshow component and send props of pdffile and file datas */}
      {pdf &&
        <Pdfshow pdffile={pdf} file={file} />
      }
    </div>

  );
};

export default App;
