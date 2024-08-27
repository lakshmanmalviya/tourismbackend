import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../Redux/store";
import { fetchAllPlacesStart } from "../Redux/slices/placeSlice";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import background from "../assets/topPlaceSliderBg.jpg";
import { PlaceWithImages } from "../types/placesApiResponse";

const TopPlaceSlider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { places, loading, error } = useSelector(
    (state: RootState) => state.place
  );

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

  useEffect(() => {
    dispatch(fetchAllPlacesStart());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !error) {
      console.log("Places data:", places);
      console.log("getting more data about place", places?.data?.data);
    }
  }, [places, loading, error]);

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
        {loading && (
          <div className="flex justify-center items-center h-32">
            <p className="text-white">Loading...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}
        {!loading && !error && places && places.data?.data.length > 0 ? (
          <Slider {...settings} className="w-full">
            {places.data.data.map((data: PlaceWithImages) => (
              <div key={data.place.id} className="px-2">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col items-center">
                  <div className="w-full h-[250px] relative">
                    {data.images.length > 0 ? (
                      <Image
                        src={data.images[0].imageLink}
                        alt={data.place.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-full text-gray-500">
                        No Image Available
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col items-center">
                    <p className="text-lg md:text-xl font-semibold">
                      {data.place.name}
                    </p>
                    <p className="text-center text-gray-700 mt-2">
                      {data.place.description}
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          !loading && (
            <p className="text-white text-center">No places available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default TopPlaceSlider;
