import Nav from "./components/Nav";
import Overview from "./components/Overview";
import NMITool from "./components/NMI";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {


  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/nasa-mission-identifier-tool" element={<NMITool />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
