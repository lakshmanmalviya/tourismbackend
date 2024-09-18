import React, { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";

import { searchRequest } from "../Redux/slices/searchSlice";
import {  SearchEntityType, SearchResponseItem } from "@/types/search/searchPayload";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "../Redux/store";
import { useRouter } from "next/router";


const SearchAll: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(
    (state: RootState) => state.search.ALL.results
  );
const router = useRouter()
  const [value, setValues] = useState<SearchResponseItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { searchTerm } = router.query;

  const handleSearch = useCallback(
    (searchTerm: string, entityType: SearchEntityType, page = 1) => {
      dispatch(
        searchRequest({
          keyword: searchTerm,
          entityType,
          page,
          limit: 5,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(searchRequest({keyword: "j",entityType: SearchEntityType.ALL,page: 1,limit:5}))
  },[])

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm as string, SearchEntityType.ALL);
    }
  }, [searchTerm, handleSearch]);
  useEffect(() => {
    if (searchResults?.data) {
      setValues(searchResults.data);
      console.log("Updated search results", searchResults.data);
    }
  }, [searchResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch("", SearchEntityType.ALL, page);
  }; 

  return (
    <div>
      <SearchBar searchType={SearchEntityType.ALL} onSearch={(term) => handleSearch(term, SearchEntityType.ALL)} />
    </div>
  );
};

export default SearchAll;
