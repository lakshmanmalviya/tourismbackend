import HotelFilter from "@/components/Hotel/HotelFilter";
import SearchBar from "@/components/common/SearchBar";
import SearchedCard from "@/components/common/SearchResultCard";
import React from "react";

const Hotel = () => {
  return (
    <div>
      <SearchBar />
      <div className="bg-gray-100 flex flex-col md:flex-row justify-between pt-10 gap-6 px-10 ">
        <HotelFilter />
        <div className="flex-grow">
          <SearchedCard />
          <SearchedCard />
          <SearchedCard />
        </div>
      </div>
    </div>
  );
};

export default Hotel;
