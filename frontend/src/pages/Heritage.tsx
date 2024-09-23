import React, { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import HeritageFilter from "@/components/Heritage/HeritageFilter";
import SearchedCard from "@/components/common/SearchResultCard";
import { searchRequest } from "../Redux/slices/searchSlice";
import {
    HeritageResponse,
  SearchEntityType,
  SearchResponseItem,
} from "@/types/search/searchPayload";
import { EntityType } from "@/types/enum/entityType.enum";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "@/Redux/store";
import Pagination from "@/components/common/Pagination";
import Image from "next/image";
import DataNotFound from "../assets/data not found.jpeg"

const Heritage: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(
    (state: RootState) => state.search.HERITAGE.results
  );
  const [value, setValues] = useState<HeritageResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string>("");

  const handleSearch = useCallback(
    (
      searchTerm: string,
      entityType: SearchEntityType,
      page = 1,
      placeId?: string,
      tags?: string
    ) => {
      dispatch(
        searchRequest({
          keyword: searchTerm,
          entityType,
          page,
          limit: 5,
          placeId: selectedPlaceId,
          tagIds: selectedTags,
        })
      );
    },
    [dispatch, selectedPlaceId, selectedTags]
  );

  useEffect(() => {
    dispatch(
      searchRequest({
        keyword: "j",
        entityType: SearchEntityType.HERITAGE,
        page: 1,
        limit: 5,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (searchResults?.data) {
      setValues(searchResults.data);
    }
  }, [searchResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch("", SearchEntityType.HERITAGE, page);
  };

  const handleApplyFilters = (placeId: string, tags: string) => {
    setSelectedPlaceId(placeId);
    setSelectedTags(tags);
    handleSearch("", SearchEntityType.HERITAGE, 1, placeId, tags);
  };

  return (
    <div>
      <SearchBar
        searchType={SearchEntityType.HERITAGE}
        onSearch={(term) => handleSearch(term, SearchEntityType.HERITAGE)}
      />
      <div className="bg-gray-100 flex flex-col md:flex-row justify-between pt-10 gap-6 px-10">
        <HeritageFilter onApplyFilters={handleApplyFilters} />
        <div className="flex-grow">
          <div className="flex-grow">
            {value.length > 0 ? (
              value.map((result) => (
                <SearchedCard
                  key={result.id}
                  name={result.name}
                  description={result.description}
                  imageUrl={result.thumbnailUrl}
                  pageType={SearchEntityType.HERITAGE}
                  entityType={EntityType.HERITAGE}
                  id={result.id}
                  tags={result.tags}
                />
              ))
            ) : (
              <div><Image src={DataNotFound} alt="result not founnd"/></div>
            )}
          </div>

          {searchResults &&
          searchResults.total &&
          searchResults.limit &&
          currentPage ? (
            <Pagination
              total={searchResults.total}
              limit={searchResults.limit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          ) : (
            <div> none </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heritage;
