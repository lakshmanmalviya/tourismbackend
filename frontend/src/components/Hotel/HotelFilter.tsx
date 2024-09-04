import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const HotelFilter = () => {
  const [value, setValue] = useState<number[]>([500, 1000]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-2/4 mx-auto mb-8">
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
        <p className="font-semibold text-gray-700 mb-2">Rating</p>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none">
          <option value="1">1 star</option>
          <option value="2">2 star</option>
          <option value="3">3 star</option>
          <option value="4">4 star</option>
          <option value="5">5 star</option>
        </select>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-700 mb-2">Your budget (per night):</p>
        <Box sx={{ width: '100%' }}>
          <Slider
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={500}
            max={50000}
            sx={{
              color: '#22C55E', 
            }}
          />
        </Box>
        <div className="mt-2 text-sm text-gray-600">&#8377; {value[0]} - &#8377; {value[1]}</div>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-700 mb-2">Sort by</p>
        <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none">
          <option value="1">Name</option>
          <option value="2">Price</option>
          <option value="3">Rating</option>
        </select>
      </div>

      <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
        Apply Filters
      </button>
    </div>
  );
};

export default HotelFilter;
