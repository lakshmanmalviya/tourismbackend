import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    
  };

  return (
    <div className="container mx-auto px-10 md:px-20 py-6">
      <div className="flex justify-center items-center max-w-md mx-auto border border-gray-300 rounded-md shadow-lg bg-white">
        <CiSearch className="text-gray-500 text-xl mx-3 " />
        <input
          type="text"
          placeholder="Search"
          className="flex-grow p-2 border-none outline-none text-gray-800 placeholder-gray-500"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
