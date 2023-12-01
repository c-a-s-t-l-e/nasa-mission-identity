import Nav from './components/Nav';
import Overview from './components/Overview';
import NMTTool from './components/NMT';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/nasa-mission-tagger-tool" element={<NMTTool />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
