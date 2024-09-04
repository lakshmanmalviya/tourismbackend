import Image from "next/image";
import img from "../../assets/topPlaceSliderBg.jpg";

const SearchResultCard = () => {
  return (
    <div className="rounded-lg bg-white flex flex-col md:flex-row gap-6 p-6 shadow-lg mb-8">
      <Image src={img} alt="image" width={300} height={200} className="w-full md:w-auto rounded-lg" />
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Jaipur</h3>
          <div className="text-sm text-gray-600 mb-4">Rajasthan, India</div>
          <div className="text-base text-gray-700 mb-6 line-clamp-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus cum asperiores cumque architecto tempora necessitatibus laboriosam magnam fuga. Debitis optio eveniet soluta accusantium aliquam? Exercitationem quis deserunt esse. Doloribus, temporibus!...
          </div>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded px-4 py-2 self-start">
          VISIT
        </button>
      </div>
    </div>
  );
};

export default SearchResultCard;
