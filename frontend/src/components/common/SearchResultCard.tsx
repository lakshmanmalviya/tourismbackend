import Image from "next/image";
import React from "react";

interface SearchResultCardProps {
  name: string;
  description: string;
  imageUrl: string;
  onVisit: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  name,
  description,
  imageUrl,
  onVisit,
}) => {
  return (
    <div className="rounded-lg bg-white flex flex-col md:flex-row gap-6 p-6 shadow-lg mb-8">
      <Image src={imageUrl} alt={name} width={300} height={200} className="w-full md:w-auto rounded-lg" />
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <div className="text-base text-gray-700 mb-6 line-clamp-5">
            {description}
          </div>
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded px-4 py-2 self-start"
          onClick={onVisit}
        >
          VISIT
        </button>
      </div>
    </div>
  );
};

export default SearchResultCard;
