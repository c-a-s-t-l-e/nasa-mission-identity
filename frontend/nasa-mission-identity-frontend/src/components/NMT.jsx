import React, { useState, useRef } from 'react';
import Modal from './Modal';
import uploadIcon from '/src/images/icons8-upload-48.png';

const NMITool = () => {
  const [abstractText, setAbstractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isText, setIsText] = useState(false);
  const [results, setResults] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    console.log('in handleFileChange');
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('error uploadign file');
        }

        const { data, filename } = await res.json();
        const parsedData = JSON.parse(data);
        localStorage.setItem('csvFileName', filename);

        setResults(parsedData);
        setShowModal(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleTextChange = (e) => {
    setAbstractText(e.target.value);
  };

  const handleSubmitAbstract = async () => {
    console.log(abstractText);
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/submit-abstract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ abstractText: abstractText }),
      });

      if (!res.ok) {
        throw new Error('Error submitting abstract');
      }

      const data = await res.json();
      setResults(data);
      setIsText(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nmi-container">
      <h1>NASA Mission Tagger</h1>
      <div className="instructions">
        <p>
          The NASA Mission Tagger is designed for simplicity and ease of use. To
          get started, simply enter your abstract text into the provided text
          area and click the "Detect Missions" button. Alternatively, if you
          have a CSV file, you can upload it. Ensure your CSV file contains
          specific columns such as ABSTRACT_NUM and Abstract, for accurate
          processing. Once your abstract or file is submitted, the tool will
          analyze the content and detect any NASA-related missions, providing
          you with detailed information including the PID, mission name, type,
          launch date, and launch location.
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
            <button
              className="mission-submission-btn"
              onClick={handleSubmitAbstract}
            >
              Detect Missions
            </button>
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
          style={{ display: 'none' }}
          // Accept only CSV files
          accept=".csv"
        />
      </div>
      {/* conditionally render modal to display once results are populated  */}
      {results && (
        <Modal
          data={results}
          onClose={() => {
            setShowModal(false);
            setResults(null);
            setIsText(false);
          }}
          input={isText}
          s
        />
      )}
    </div>
  );
};

export default NMITool;
