import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "Sales", path: "/dashboard/sales", icon: ShoppingCart },
    { name: "Products", path: "/dashboard/products", icon: Package },
    { name: "Categories", path: "/dashboard/categories", icon: Tags },
    { name: "Customers", path: "/dashboard/customers", icon: Users },
    
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <BarChart3 size={17} className="text-white" strokeWidth={2.25} />
        </div>
        <span className="text-[15px] font-semibold text-gray-900 truncate">
          Sales Workspace
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
          Workspace
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon size={17} strokeWidth={2} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={17} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}
