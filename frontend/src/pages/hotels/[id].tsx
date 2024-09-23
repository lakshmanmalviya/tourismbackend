import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Hotel } from "@/types/hotel/hotelPayload";
import { CiLocationOn } from "react-icons/ci";
import ParallaxComponent from "@/components/Hotel/ParallaxSection";
import { FaLaptop } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import HotelDetailsCard from '@/components/Hotel/HotelDetailsCard'
export default function HotelDetails() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  return (
    <>
      <ParallaxComponent title={"this is title"} place="this is place" />

      <HotelDetailsCard title={''} description={''} 
      price={"123"} starRating={1}  
      location={"htis"} 
      mapUrl={'ksd'}
      website={"hhtp"}
      contact={"43"}
      email={"this is email"}
      availableRooms={123}
      />

    </>
  );
}
