import AbstractOverview from './AbstractOverview';
const Modal = ({ data, onClose, input }) => {
  // transform objects from the backend to an array of objects
  const transformData = () => {
    console.log(data);
    let transformedData = [];
    if (data && data.NAME) {
      for (let index in data.NAME) {
        // console.log(data["ABSTRACT_NUM"][index]);
        transformedData.push({
          index: input ? 0 : data['ABSTRACT_NUM'][index],
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

  const handleDownload = async () => {
    const filename = localStorage.getItem('csvFileName');
    console.log(filename);
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/file-download/${filename}`,
        {
          credentials: 'include',
        }
      );
      console.log(res);
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'missions_output.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  const processedData = transformData();

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-header">
          <h2>
            Results{' '}
            <span className={processedData.length > 0 ? 'modal-span' : 'error'}>
              ({processedData.length} missions detected in your file)
            </span>
          </h2>
          <span className="download-link" onClick={handleDownload}>
            Download missions output
          </span>
        </div>
        <div className="scroll-container">
          {' '}
          {/* Scroll container added here css, map over each item in the array and display details */}
          {processedData.map((item, index) => (
            <AbstractOverview item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
