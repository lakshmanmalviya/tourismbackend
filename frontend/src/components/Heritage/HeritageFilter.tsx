import { useState } from "react";

const HeritageFilter = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tags = ["Historic", "Modern", "Cultural", "Architectural", "Religious"];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-2/4">
      <div className="mb-6">
        <p className="font-semibold text-gray-700 mb-2">Place</p>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none">
          <option value="1">Place 1</option>
          <option value="2">Place 2</option>
          <option value="3">Place 3</option>
          <option value="4">Place 4</option>
          <option value="5">Place 5</option>
        </select>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-700 mb-2">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer px-3 py-1 rounded-full border ${
                selectedTags.includes(tag)
                  ? "bg-green-500 text-white"
                  : "bg-white border-green-500 text-green-500"
              } transition`}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
        Apply Filters
      </button>
    </div>
  );
};

export default HeritageFilter;
