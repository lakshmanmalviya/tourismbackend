import React, { useCallback, useEffect, useState } from "react";
import HotelFilter from "@/components/Hotel/HotelFilter";
import SearchBar from "@/components/common/SearchBar";
import SearchedCard from "@/components/common/SearchResultCard";
import Pagination from "@/components/common/Pagination";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { searchRequest } from "../Redux/slices/searchSlice";
import { EntityType, SearchResponseItem } from "@/types/search/searchPayload";
import { RootState } from "@/Redux/store";
import Image from "next/image";
import explore from '../assets/explore.jpeg'

const Hotel: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector((state: RootState) => state.search.HOTEL.results);

  const [value, setValues] = useState<SearchResponseItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    placeId: undefined,
    hotelStarRating: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
  });
  const [reset, setReset] = useState(false); 

  const resetFilters = () => {
    setFilters({
      placeId: undefined,
      hotelStarRating: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
    });
  };

  const handleSearch = useCallback((searchTerm: string, entityType: EntityType, page = 1) => {
    if (searchTerm) {
      resetFilters(); 
      setReset(!reset);  
    }

    dispatch(
      searchRequest({
        keyword: searchTerm,
        entityType,
        placeId: filters.placeId,
        hotelStarRating: filters.hotelStarRating,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
        page,
        limit: 5,
      })
    );
  }, [dispatch, filters]);

  useEffect(() => {
    if (searchResults?.data) {
      setValues(searchResults.data);
    }
  }, [searchResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch("", EntityType.HOTEL, page);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setReset(false); 
    handleSearch("", EntityType.HOTEL, currentPage);
  };

  return (
    <div>
      <SearchBar entityType={EntityType.HOTEL} onSearch={(term) => handleSearch(term, EntityType.HOTEL)} />
      <div className="bg-gray-100 flex flex-col md:flex-row justify-between pt-10 gap-6 px-10">
        <HotelFilter onFilterChange={handleFilterChange} reset={reset} /> 
        <div className="flex-grow">
          {value.length > 0 ? (
            value.map((result) => (
              <SearchedCard
                key={result.id}
                name={result.name}
                description={result.description}
                imageUrl={result.thumbnailUrl}
                onVisit={() => console.log(`Visiting ${result.id}`)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center"> 
              <Image src={explore} alt="explore"/>
              </div>
          )}

          {searchResults && searchResults.total && searchResults.limit && currentPage ? (
            <Pagination
              total={searchResults.total}
              limit={searchResults.limit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hotel;
