import NMIGif from "/src/images/IRonMac.png";
import { useNavigate } from "react-router-dom";

const Overview = () => {
    let navigateTo = useNavigate()

    const handleClick = () => {
        console.log('hey')
        navigateTo('/nasa-mission-identifier-tool')
    }

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque auctor aliquet diam, sed vestibulum nibh scelerisque
            fringilla. Maecenas dictum lectus sed tincidunt egestas. Orci varius
            natoque penatibus et magnis dis parturient montes, nascetur
            ridiculus mus.
          </p>

          <p>
            Donec egestas, justo ac faucibus bibendum, nulla magna mollis ante,
            in aliquam arcu ligula sit amet ipsum. Cras nunc metus, vehicula a
            sodales in, vehicula vitae felis. Morbi quis orci eget leo
            consectetur luctus.
          </p>

          <button onClick={handleClick}>Find Missions</button>
        </div>
      </div>
    </>
  );
};

export default Overview;
