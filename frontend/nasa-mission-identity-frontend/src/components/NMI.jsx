import React, { useState, useRef } from "react";
import Modal from './Modal'
import uploadIcon from "/src/images/icons8-upload-48.png";

const NMITool = () => {
  const [abstractText, setAbstractText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null)
  const [showModal, setShowModal] = useState(false); 

  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    console.log("in handleFileChange");
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("error uploadign file");
        }

        const data = await res.json();
        console.log(data);
        setResults(data);
        setShowModal(true)
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleTextChange = (e) => {
    setAbstractText(e.target.value);
  };

  return (
    <div className="nmi-container">
      <h1>NASA Mission Identifier</h1>
      <div className="instructions">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
          at rerum! Minima nisi quisquam odio perspiciatis quo repudiandae
          expedita placeat laboriosam assumenda explicabo similique libero,
          neque exercitationem consectetur voluptas ratione. Rerum reiciendis
          nulla quia in alias laborum aperiam blanditiis illo qui eius vero
          modi.
        </p>
      </div>
      <div className="card text-card">
        <div className="text-area-container">
          <textarea
            placeholder="Enter abstract to check for NASA related missions"
            value={abstractText}
            onChange={handleTextChange}
            className="text-input-area"
          />
        </div>
      </div>
      <div className="button-container">
        {isLoading ? (
          <div className="loading-animation">
            <p>Detecting Missions</p>
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <>
            <button className="mission-submission-btn">Detect Missions</button>
            <button className="upload-csv-btn" onClick={handleFileButtonClick}>
              <img src={uploadIcon} alt="" /> Upload CSV
            </button>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          // Hide the file input
          style={{ display: "none" }}
          // Accept only CSV files
          accept=".csv"
        />
      </div>
      {/* conditionally render modal to display once results are populated  */}
      {results && <Modal data={results} onClose={() =>{
         setShowModal(false) 
         setResults(null);
         }
         } />}
    </div>
  );
};

export default NMITool;
