import React from "react";
import HeroSection from "./HeroSection";
import PortalDescription from "./PortalDescription";
const App = () => {
  return <div className="flex flex-col min-h-screen">
    <HeroSection/>
    <PortalDescription/>
  </div>;
};

export default App;
