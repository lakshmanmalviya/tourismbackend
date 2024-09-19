import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa6";
import { Modal, Box, IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "../../Redux/store";
import { fetchPlaceByIdRequest } from "@/Redux/slices/placeSlice";
import { searchRequest } from "@/Redux/slices/searchSlice";
import {
  HeritageResponse,
  HotelResponse,
  SearchEntityType,
} from "@/types/search/searchPayload";
import { Place } from "@/types/place/placePayload";
const PlaceDetails = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const placeResponse = useAppSelector((state: RootState) => state.place.place);
  const listOfHeritagesResponse = useAppSelector(
    (state: RootState) => state.search.HERITAGE.results
  );
  const listOfHotelsResponse = useAppSelector(
    (state: RootState) => state.search.HOTEL.results
  );

  const [place, setPlace] = useState<Place | null>(null);
  const [heritages, setHeritages] = useState<HeritageResponse[] | null>(null);
  const [hotels, setHotels] = useState<HotelResponse[] | null>(null);
  const [open, setOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [readMore, setReadMore] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFullscreen = (imgSrc: string) => {
    setFullscreenImage(imgSrc);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  useEffect(() => {
    const { id } = router.query;

    if (id) {
      dispatch(fetchPlaceByIdRequest(id as string));
      dispatch(
        searchRequest({
          placeId: id as string,
          entityType: SearchEntityType.HOTEL,
        })
      );
      dispatch(
        searchRequest({
          placeId: id as string,
          entityType: SearchEntityType.HERITAGE,
        })
      );
    }
  }, [dispatch, router.query]);

  useEffect(() => {
    if (placeResponse) {
      setPlace(placeResponse);
    }
    if (listOfHeritagesResponse?.data) {
      setHeritages(listOfHeritagesResponse.data);
    }
    if (listOfHotelsResponse?.data) {
      setHotels(listOfHotelsResponse.data);
    }
  }, [
    placeResponse,
    listOfHeritagesResponse?.data,
    listOfHotelsResponse?.data,
  ]);

  const getGridClass = (index: number, totalImages: number) => {
    if (totalImages === 1) {
      return "col-span-2";
    }
    const layoutVariants = [
      "col-span-2",
      "col-span-1 row-span-2",
      "col-span-1",
    ];

    return layoutVariants[index % layoutVariants.length];
  };
  const toggleReadMore = () => {
    setReadMore(!readMore);
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onClick}
      >
        <FaArrowLeft className="text-white text-4xl bg-black p-2 rounded-full cursor-pointer" />
      </div>
    );
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onClick}
      >
        <FaArrowRight className="text-white text-4xl bg-black p-2 rounded-full cursor-pointer" />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };
  const settingsForHeritage = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="p-6 md:p-12">
      <div className="relative">
        <Slider {...settings} className="group">
          {place &&
            place.images?.map((img, index) => (
              <div key={index} className="relative">
                <Image
                  src={img.link}
                  alt="place images"
                  width={700}
                  height={600}
                  className="w-full h-[80vh] md:h-[70vh] sm:h-[60vh] object-contain"
                />
              </div>
            ))}
        </Slider>

        <div
          className="absolute bottom-20 right-12 z-50 bg-black p-2 rounded-full shadow-md cursor-pointer"
          onClick={handleOpen}
        >
          <FaRegImages className="text-white inline" />
          <span className="text-white pl-1">Gallery</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="flex-1 md:pr-8">
          <h1 className="text-4xl font-bold mt-10 mb-4 text-center md:text-left">
            {place && place.name}, India
          </h1>

          <div className="text-base text-justify leading-relaxed mb-4">
            <p
              className={`overflow-hidden ${
                readMore ? "line-clamp-none" : "line-clamp-3"
              }`}
            >
              {place?.description}
            </p>

            <button
              className="text-green-600 font-semibold mt-2 hover:border-b-2 flex items-center space-x-2"
              onClick={toggleReadMore}
            >
              {readMore ? (
                <>
                  <span>Show Less</span>
                  <FaChevronUp />
                </>
              ) : (
                <>
                  <span>Read More</span>
                  <FaChevronDown />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="md:w-1/3 w-full flex justify-center mt-8 md:mt-0">
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-center w-full">
            <p className="text-gray-700 font-semibold mb-2">Location</p>
            <div className="flex justify-center items-start w-full h-0 pb-[56.25%] ">
              <iframe
                src={place?.mapUrl}
                width="350"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg overflow-y-scroll"
          sx={{
            width: { xs: "90%", md: 800 },
            height: { xs: "70%", md: 600 },
            maxHeight: "90vh",
          }}
        >
          <h2 className="text-lg font-bold mb-4">Photos Gallery</h2>
          <div className="grid grid-cols-2 gap-4 max-h-[50vh]">
            {place &&
              place.images?.map((img, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer px-10 ${getGridClass(
                    index,
                    place.images.length
                  )}`}
                  onClick={() => handleFullscreen(img.link)}
                >
                  <Image
                    src={img.link}
                    alt={`image-${index}`}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
          </div>
        </Box>
      </Modal>

      {fullscreenImage && (
        <Modal open={Boolean(fullscreenImage)} onClose={closeFullscreen}>
          <Box className="fixed inset-0 bg-black flex justify-center items-center">
            <IconButton
              className="absolute top-4 right-4 z-50 text-white"
              onClick={closeFullscreen}
            >
              <FaTimes className="text-2xl" />
            </IconButton>

            <div className="relative w-full h-full">
              <Image
                src={fullscreenImage}
                alt="fullscreen image"
                layout="fill"
                objectFit="contain"
                className="w-full h-full"
              />
            </div>
          </Box>
        </Modal>
      )}

      {heritages ? (
        <div>
          <div className="mt-20">
            <h1 className="text-2xl font-bold">Heritages sites </h1>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div>
        <Slider {...settingsForHeritage} className="group">
          {heritages?.map((heritage, index) => (
            <div key={index} className="relative mr-10 p-5">
              <div className="relative w-full h-[80vh] md:h-[70vh] sm:h-[60vh]">
                <Image
                  src={heritage?.thumbnailUrl}
                  alt="heritage thumbnail"
                  width={400}
                  height={600}
                  className="w-full h-[80vh] md:h-[70vh] sm:h-[60vh] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-50">
                  <h1 className="text-white text-2xl font-semibold transition-transform duration-300 transform hover:scale-125">
                    {heritage.name}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {hotels ? (
        <div>
          <div className="mt-20">
            <h1 className="text-2xl font-bold">Places to stay </h1>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div>
        <Slider {...settingsForHeritage} className="group">
          {hotels &&
            hotels?.map((hotel, index) => (
              <div key={index} className="relative p-10 mr-20">
                <Image
                  src={hotel?.thumbnailUrl}
                  alt="hotel thumbnail"
                  width={400}
                  height={600}
                  className="w-full h-[80vh] md:h-[70vh] sm:h-[60vh] object-cover"
                />
                <h1 className="text-lg font-bold">{hotel.name}</h1>
                <div className="flex text-green-600 gap-1 ">
                  {[...Array(5)].map((_, index) =>
                    index < hotel.hotelStarRating ? (
                      <FaCircle key={index} />
                    ) : (
                      <FaRegCircle key={index} />
                    )
                  )}
                  <span className="ml-2 text-xs text-black">
                    {hotel.hotelStarRating} rating
                  </span>{" "}
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default PlaceDetails;
