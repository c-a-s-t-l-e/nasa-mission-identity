import { useEffect } from "react";

const Modal = ({ data, onClose }) => {
 
    const transformData = () => {
        let transformedData = [];
        if (data && data.NAME) {
          for (let index in data.NAME) {
            transformedData.push({
              index: index,
              name: data.NAME[index],
              pid: data["AUTO MISSION PID"][index],
              title: data.TITLE[index],
              citationSource: data["CITATION SOURCE"][index],
            });
          }
        }
        return transformedData;
      };
      
  const processedData = transformData();

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Results <span className="modal-span">({processedData.length} missions detected in your file)</span></h2>
        <div className="scroll-container"> {/* Scroll container added here */}
          {processedData.map((item, index) => (
            <div key={index} className="result-item">
              <h1><strong>Index:</strong> {item.index}</h1>
              <p><strong>Mission Name:</strong> {item.name}</p>
              <p><strong>PID:</strong> {item.pid}</p>
              <p><strong>Title:</strong> {item.title}</p>
              <p><strong>Citation Source:</strong> {item.citationSource}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
