import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarProps {
  activeItem:string,
  setActiveItem:(activeItem:string) => void
}
const Sidebar:React.FC<SidebarProps> = ({activeItem, setActiveItem}) => {
  const router = useRouter();
  

  const sidebarItems = [
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Hotel", path: "/dashboard/hotel" },
    { name: "Heritage", path: "/dashboard/heritage" },
    { name: "Place", path: "/dashboard/place" },
  ];

  return (
      <>
      <div className="w-64 bg-green-950 text-white h-screen p-4">
      <div className="text-2xl font-bold mb-8">Dashboard</div>
      <nav>
        {sidebarItems.map((item) => {
          console.log(activeItem, item.name.toLowerCase());
          return (
            <Link href={item.path} key={item.name}>
              <button
                key={item.name}
                className={`w-full text-left py-2 px-4 rounded ${
                  activeItem == item.name.toLowerCase() ? 'bg-green-600' : 'hover:bg-green-800'
                }`}
                onClick={() => setActiveItem(item.name.toLowerCase())}
              >
                {item.name}
              </button>
            </Link>
  
          )
        })}
      </nav>
      </div>
      </>
  );
};

export default Sidebar;
