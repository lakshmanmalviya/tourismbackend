import React from "react";
import HeroSection from "./HeroSection";
import PortalDescription from "./PortalDescription";
import TopPlaceSlider from "./TopPlaceSlider";
import ContactForm from "./ContactForm";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <PortalDescription />
      <TopPlaceSlider />
      <ContactForm />
    </div>
  );
};

export default App;
