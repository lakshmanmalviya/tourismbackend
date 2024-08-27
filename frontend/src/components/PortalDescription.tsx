import React from "react";
import logo from "../assets/logo.png";
import Image from "next/image";
import card1 from "../assets/tour-guide.png";
import card2 from "../assets/taj-mahal.png";
import card3 from "../assets/accomodation.png";

const PortalDescription = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-24">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="text-3xl font-light border-b-2 border-dashed mt-4">
          Tourism App
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 mt-12 mb-20 px-12">
        <div className="flex flex-col items-center p-8 shadow-lg">
          <Image src={card1} alt="Tourism Places of India" width={100} height={100} />
          <h2 className="text-xl font-semibold mt-4">Tourism Places of India</h2>
          <p className="text-center mt-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi
            eum placeat accusamus? Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Quos fuga nihil deleniti!
          </p>
        </div>
        <div className="flex flex-col items-center p-8 shadow-lg">
          <Image src={card2} alt="Heritage sites" width={100} height={100} />
          <h2 className="text-xl font-semibold mt-4">Heritage Sites</h2>
          <p className="text-center mt-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi
            eum placeat accusamus? Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Quos fuga nihil deleniti!
          </p>
        </div>
        <div className="flex flex-col items-center p-8 shadow-lg">
          <Image src={card3} alt="Accommodation details" width={100} height={100} />
          <h2 className="text-xl font-semibold mt-4">Accommodation Details</h2>
          <p className="text-center mt-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi
            eum placeat accusamus? Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Quos fuga nihil deleniti!
          </p>
        </div>
      </div>
    </>
  );
};

export default PortalDescription;
