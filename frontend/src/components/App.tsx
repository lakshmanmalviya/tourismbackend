import React from "react";
import HeroSection from "./HeroSection";
import PortalDescription from "./PortalDescription";
import TopPlaceSlider from "./TopPlaceSlider";
const App = () => {
  return <div className="flex flex-col min-h-screen">
    <HeroSection/>
    <PortalDescription/>
    <TopPlaceSlider/>
  </div>;
};

export default App;
