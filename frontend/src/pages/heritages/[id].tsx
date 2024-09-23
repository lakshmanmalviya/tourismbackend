import HeritageThumbnailAnimation from '@/components/Heritage/HeritageThumbnailAnimation'
import DescriptionMapSlider from "@/components/common/DescriptionMapslider"
import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

const HeritageDetails = () => {
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

      
const images = [
    'https://images.unsplash.com/photo-1682687220566-5599dbbebf11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1682687221248-3116ba6ab483?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1688362809005-e1d27bf427ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1688362892497-b2e0746eb5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1688362892512-01f4f9618199?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  ]
  return (
    <>
    <HeritageThumbnailAnimation name="Heritage" thumbnail=""/>
    <DescriptionMapSlider title={"heritage"}description="thi si sdescription" mapUrl={""}/>
    <div className='relative'>
      <Slider {...settings} className="group">
          {
           images?.map((img, index) => (
              <div key={index} className="relative">
                <div
                  className="absolute inset-0 -z-10 overflow-hidden"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(10px)",
                    transform: "scale(1.1)",
                  }}
                />
                <Image
                  src={img}
                  alt="place images"
                  width={700}
                  height={600}
                  className="relative w-full h-[90vh] object-contain"
                />
              </div>
            ))}
        </Slider>

      </div>
    </>
  )
}

export default HeritageDetails
