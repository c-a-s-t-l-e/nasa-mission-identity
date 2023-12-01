const AbstractOverview = ({ item, index }) => {
  return (
    <div key={index} className="result-item">
      {/* {console.log(item)} */}
      <h1>
        <strong>Abstract:</strong> {item.index + 1}
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
      {/* only render launch details if mission type is spacecraft */}
      {item.mission_type == 'spacecraft' && (
        <>
          <p>
            <strong>Location:</strong>{' '}
            {item.location !== null ? item.location : 'N/A'}
          </p>
          <p>
            <strong>Launch Date:</strong>{' '}
            {item.launch !== null ? item.launch : 'N/A'}
          </p>
        </>
      )}
    </div>
  );
};

export default AbstractOverview;
