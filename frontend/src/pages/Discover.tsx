import React, { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import SearchedCard from "@/components/common/SearchResultCard";
import { searchRequest } from "../Redux/slices/searchSlice";
import { EntityType, SearchResponseItem } from "@/types/search/searchPayload";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "../Redux/store";
import Pagination from "@/components/common/Pagination";

const SearchAll: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(
    (state: RootState) => state.search.ALL.results
  );

  const [value, setValues] = useState<SearchResponseItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearch = useCallback(
    (searchTerm: string, entityType: EntityType, page = 1) => {
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
    if (searchResults?.data) {
      setValues(searchResults.data);
      console.log("Updated search results", searchResults.data);
    }
  }, [searchResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch("", EntityType.ALL, page);
  };

  return (
    <div>
      <SearchBar entityType={EntityType.ALL} onSearch={(term) => handleSearch(term, EntityType.ALL)} />
      <div className="bg-gray-100 pt-10 px-10">
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
            <div>No search results found</div>
          )}
        </div>

        {searchResults && searchResults.total && searchResults.limit && currentPage ? (
          <Pagination
            total={searchResults.total}
            limit={searchResults.limit}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <div>No pagination available</div>
        )}
      </div>
    </div>
  );
};

export default SearchAll;
