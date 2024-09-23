import React, { useCallback, useEffect, useState } from "react";
import HotelFilter from "@/components/Hotel/HotelFilter";
import SearchBar from "@/components/common/SearchBar";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { searchRequest } from "../Redux/slices/searchSlice";
import {
  SearchEntityType,
  HotelResponse,
} from "@/types/search/searchPayload";
import { RootState } from "@/Redux/store";

const Hotel: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(
    (state: RootState) => state.search.HOTEL.results
  );

  const [value, setValues] = useState<HotelResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    placeId: undefined,
    hotelStarRating: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
  });
  const [reset, setReset] = useState(false);
  useEffect(() => {
    dispatch(
      searchRequest({
        entityType: SearchEntityType.HOTEL,
        page: 1,
        limit: 5,
        hotelStarRating: 5,
      })
    );
  }, []);
  const handleSearch = useCallback(
    (searchTerm: string, entityType: SearchEntityType, page = 1) => {
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
    },
    [dispatch, filters]
  );
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setReset(false);
    handleSearch("", SearchEntityType.HOTEL, currentPage);
  };

  useEffect(() => {
    if (searchResults?.data) {
      setValues(searchResults.data);
    }
  }, [searchResults]);

  return (
    <div>
      <SearchBar
        searchType={SearchEntityType.HOTEL}
        onSearch={(term) => handleSearch(term, SearchEntityType.HOTEL)}
      />
      <div className="bg-gray-100 flex flex-col md:flex-row justify-between pt-10 gap-6 px-10">
        <HotelFilter onFilterChange={handleFilterChange} reset={reset} />
      </div>
    </div>
  );
};

export default Hotel;
