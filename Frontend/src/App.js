import React from "react";
import { Route, Routes } from "react-router-dom";
import CryptoGraphs from "./Cryptographs";
import Services from "./services/Services";
// import cryptoData from './cryptoData/Cryptodata'
import "./broadcast/Broadcast";
import Broadcast from "./broadcast/Broadcast";
import Headsection from "./headSection/Headsection";
import Navbar from "./navbar/Navbar";
// import RealTimeData from './cryptoData/Cryptodata'
// import CryptoWidget from './cryptoData/CryptoWidget'
import Footer from "./Footer/Footer";
import RiskWarning from "./Risk/Risk";
import Help from "./help/Help";
import CryptoData from "./cryptoData/CryptoData";
import CryptoRest from "./CryptoRest";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";

const App = () => {
  return (
    <div className="App">
      {/* <Services/>
  <CryptoWidget/>
  <RealTimeData/> */}

      <Navbar />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {/* <CryptoGraphs/>  */}
      {/* <Broadcast/> */}
      {/* <Headsection/> */}
      {/* <CryptoData/> */}
      {/* <Services/> */}
      {/* <Help/> */}
      {/* <RiskWarning/> */}
      {/* <Footer/> */}
      <CryptoRest />
    </div>
  );
};

export default App;
