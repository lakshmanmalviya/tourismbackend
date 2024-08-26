import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cityImage from "../assets/topPlacesSlider.jpg";
import React from "react";
import background from "../assets/topPlaceSliderBg.jpg";

const TopPlaceSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const data = [
    { id: 0, image: cityImage, city: "Indore" },
    { id: 1, image: cityImage, city: "Indore" },
    { id: 2, image: cityImage, city: "Indore" },
    { id: 3, image: cityImage, city: "Indore" },
    { id: 4, image: cityImage, city: "Indore" },
  ];

  return (
    <div className="relative bg-cover bg-center h-[100vh] w-full">
      <Image
        src={background}
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-center text-white mt-10 md:mt-20 px-4">
        <p className="text-3xl md:text-4xl font-bold">Top Tourism Places</p>
      </div>

      <div className="relative mt-10 z-10 max-w-5xl mx-auto px-4">
        <Slider {...settings} className="w-full">
          {data.map((element, index) => (
            <div key={index} className="px-2">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="w-full">
                  <Image
                    src={element.image}
                    alt="city image"
                    layout="responsive"
                    objectFit="cover"
                    width={265}
                    height={250}
                    className="w-full"
                  />
                </div>
                <div className="p-4 flex flex-col items-center">
                  <p className="text-lg md:text-xl font-semibold">
                    {element.city}
                  </p>
                  <p className="text-center text-gray-700 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Odit perferendis, at ab harum repellendus, et quas accusamus
                    tenetur.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopPlaceSlider;
