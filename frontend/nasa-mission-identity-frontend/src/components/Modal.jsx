const Modal = ({ data, onClose }) => {
  const transformData = () => {
    console.log(data);
    let transformedData = [];
    if (data && data.NAME) {
      for (let index in data.NAME) {
        transformedData.push({
          index: index,
          name: data.NAME[index],
          pid: data['AUTO MISSION PID']?.[index],
          mission_type: data['MISSION TYPE']?.[index],
          location: data['LAUNCH LOCATION']?.[index],
          launch: data['LAUNCH DATE']?.[index],
        });
      }
    }
    return transformedData;
  };

  const processedData = transformData();

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>
          Results{' '}
          <span className={processedData.length > 0 ? 'modal-span' : 'error'}>
            ({processedData.length} missions detected in your file)
          </span>
        </h2>
        <div className="scroll-container">
          {' '}
          {/* Scroll container added here */}
          {processedData.map((item, index) => (
            <div key={index} className="result-item">
              <h1>
                <strong>Index:</strong> {item.index}
              </h1>
              <p>
                <strong>Mission Name:</strong> {item.name}
              </p>
              <p>
                <strong>PID:</strong> {item.pid}
              </p>
              <p>
                <strong>Mission Type:</strong> {item.mission_type}
              </p>
              <p>
                <strong>Location:</strong>{' '}
                {item.location !== null ? item.location : 'N/A'}
              </p>
              <p>
                <strong>Launch Date:</strong>{' '}
                {item.launch !== null ? item.launch : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
