import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { RootState } from "../Redux/store"
import { Name } from "@/types/place/placePayload";
import { fetchPlaceByIdRequest, fetchPlaceNameRequest } from "@/Redux/slices/placeSlice";

export default function Gallery() {
  const dispatch = useAppDispatch();
  const names = useAppSelector((state: RootState) => state.place.name);
  const images = useAppSelector((state: RootState) => state.place.place?.images)
  const [activeName, setActiveName] = useState<Name| null>(null);

  useEffect(() => {
    dispatch(fetchPlaceNameRequest({ name: 1 }));
  
  }, [dispatch]);

 
  useEffect(() => {
    if (activeName) dispatch(fetchPlaceByIdRequest(activeName.id));
  }, [activeName]);

  
  useEffect(()=> {
    if(names)
    setActiveName(names[0])
  }, [names])
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
  
      <div className="flex overflow-auto gap-4 m-4">
        {names?.map((name:Name,index) => (
          <button
            key={name.id}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors 
              ${
                activeName === name
                  ? "bg-green-900 text-white"
                  : "bg-gray-200 text-black"
              }`}
            onClick={() => setActiveName(name )}
          >
            {name.name}
          </button>
        ))}

      </div>
      
      <div className="mx-auto">
        <div className=" columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images?.map((image, index) => (
            <div key={index} className="break-inside-avoid">
              <Image
                src={image.link}
                alt={`image ${index}`}
                width={300}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
