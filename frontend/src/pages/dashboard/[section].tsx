import Sidebar from "@/components/Dashboard/Sidebar";
import { useRouter } from "next/router";
import Profile from "@/components/Dashboard/Profile";
import Hotel from "@/components/Dashboard/Hotel";
import Heritage from "@/components/Dashboard/Heritage";
import Place from "@/components/Dashboard/Place";
import { SetStateAction, useEffect, useState } from "react";

const DashboardSection = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>("");

  useEffect(() => {
    if (router.isReady) {
      const { section } = router.query;
      console.log("This is section query:", section);
      if (section) {
        setActiveItem(section as string);
      }
    }
  }, [router.isReady, router.query]);

  const renderComponent = () => {
    switch (activeItem) {
      case "profile":
        return <Profile />;
      case "hotel":
        return <Hotel />;
      case "heritage":
        return <Heritage />;
      case "place":
        return <Place />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex">
     <div className="hidden md:block">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div> 
      <div className="w-4/5 p-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default DashboardSection;
