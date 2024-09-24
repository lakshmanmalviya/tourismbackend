import Sidebar from "@/components/Dashboard/Sidebar";
import Router, { useRouter } from "next/router";
import Profile from "@/components/Dashboard/Profile";
import Hotel from "@/components/Dashboard/Hotel";
import Heritage from "@/components/Dashboard/Heritage";
import Place from "@/components/Dashboard/Place";
import {  useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/hook";
import { RootState } from "@/Redux/store";

const DashboardSection = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>("");
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (router.isReady) {
      const { section } = router.query;
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

  if (!isAuthenticated) {
    Router.push("/");
  }
  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>
      <div className="w-4/5 p-4">{renderComponent()}</div>
    </div>
  );
};

export default DashboardSection;
