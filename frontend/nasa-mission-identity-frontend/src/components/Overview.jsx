import NMIGif from '/src/images/IRonMac.png';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  let navigateTo = useNavigate();

  const handleClick = () => {
    console.log('inside handle click, overview.jsx');
    navigateTo('/nasa-mission-identifier-tool');
  };

  return (
    <>
      <div className="nmi-overview">
        <div className="demo">
          <img className="mac-gif" src={NMIGif} alt="" />
        </div>
        <div className="description">
          <h1>
            NASA MISSION <br /> IDENTIFIER (<span>NMI</span>)
          </h1>
          <p>
            The NASA Mission Identifier is a cutting-edge tool designed for the
            cosmically curious. It provides a unique platform for users to
            upload either an abstract or a CSV file, then scans the content for
            references to NASA missions. Upon detecting a mission, the tool
            provides comprehensive information, including the PID, mission name,
            type, launch date, and launch location.
          </p>

          <p>
            This tool is invaluable for researchers, students, and space
            enthusiasts alike, who are seeking to connect their studies or
            interests with specific NASA missions.
          </p>

          <button onClick={handleClick}>Find Missions</button>
        </div>
      </div>
    </>
  );
};

export default Overview;
