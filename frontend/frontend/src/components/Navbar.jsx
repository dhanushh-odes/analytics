import { useLocation } from "react-router-dom";
import { Menu, Search, Bell } from "lucide-react";

const TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/sales": "Sales",
  "/dashboard/products": "Products",
  "/dashboard/categories": "Categories",
  "/dashboard/customers": "Customers",
  
};

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const title = TITLES[location.pathname] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        

        <button className="relative text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors">
          <Bell size={19} strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            A
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
