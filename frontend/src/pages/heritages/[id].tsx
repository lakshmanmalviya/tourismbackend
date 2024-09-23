import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "../../Redux/store";
import { fetchHeritageByIdRequest } from "@/Redux/slices/heritageSlice";
import { Heritage } from "@/types/heritage/heritagePayload";
import HeritageThumbnailAnimation from "@/components/Heritage/HeritageThumbnailAnimation";
import DescriptionMapSlider from "@/components/common/DescriptionMapslider";

const HeritageDetails = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const data = useAppSelector((state: RootState) => state.heritage.heritage);
  const [heritage, setHeritage] = useState<Heritage | null>(null);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      dispatch(fetchHeritageByIdRequest(id as string));
    }
  }, [dispatch, router.query]);

  useEffect(() => {
    if (data) {
      setHeritage(data);
    }
  }, [data]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    autoplay: true,
    fade: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <HeritageThumbnailAnimation
        name={heritage?.name}
        thumbnail={heritage?.thumbnailUrl}
      />

      <DescriptionMapSlider
        title={heritage?.name ?? ""}
        description={heritage?.description ?? ""}
        mapUrl={heritage?.mapUrl ?? ""}
      />

      {heritage && (
        <div className="relative">
          <Slider {...settings} className="group">
            {heritage.images?.map((img, index) => (
              <div key={index} className="relative">
                <div
                  className="absolute inset-0 -z-10 overflow-hidden"
                  style={{
                    backgroundImage: `url(${img.link})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(10px)",
                    transform: "scale(1.1)",
                  }}
                />
                <Image
                  src={img.link}
                  alt="place images"
                  width={700}
                  height={600}
                  className="relative w-full h-[90vh] object-contain"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

export default HeritageDetails;
