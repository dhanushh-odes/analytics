import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  IndianRupee,
  Package,
  Tags,
  Users,
} from "lucide-react";
import DashboardCard from "../../components/DashboardCard";
import Badge from "../../components/ui/Badge";
import axios from "axios";


const STATUS_TONE = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
};

export default function DashboardHome() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
const [products, setProducts] = useState([]);
const [customers, setCustomers] = useState([]);
const [categories, setCategories] = useState([]);
  const fetchSales = async () => {
    console.log("fetchSales called");
  try {
    const response = await axios.get(
      "http://localhost:3000/api/sales/view",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setSales(response.data.sales);
   
  } catch (error) {
    console.log(error.response?.data);
  }
};
const fetchProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/products/products",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setProducts(response.data.products);
  } catch (error) {
    console.log(error.response?.data);
  }
};
const fetchCustomers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/customers/view",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setCustomers(response.data.customers);
  } catch (error) {
    console.log(error.response?.data);
  }
};
const fetchCategories = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/categories/view",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setCategories(response.data.categories);
  } catch (error) {
    console.log(error.response?.data);
  }
};
const recentSales = sales.slice(0, 5);
console.log(recentSales);

const totalRevenue = sales.reduce(
  (sum, s) => sum + Number(s.total_amount),
  0
);
  const cards = [
    {
      title: "Total Sales",
      value: sales.length,
      description: "Orders placed across all customers",
      icon: ShoppingCart,
      route: "/dashboard/sales",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      description: "Combined value of recorded sales",
      icon: IndianRupee,
      route: "/dashboard/sales",
    },
    {
      title: "Products",
      value: products.length,
      description: "Items currently in the catalog",
      icon: Package,
      route: "/dashboard/products",
    },
    {
      title: "Categories",
      value: categories.length,
      description: "Groups used to organize products",
      icon: Tags,
      route: "/dashboard/categories",
    },
    {
      title: "Customers",
      value: customers.length,
      description: "People who have placed an order",
      icon: Users,
      route: "/dashboard/customers",
    },
  ];
useEffect(() => {
  fetchSales();
  fetchProducts();
  fetchCustomers();
  fetchCategories();
}, []);


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your workspace at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            onClick={() => navigate(card.route)}
          />
        ))}
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl border border-gray-200 mt-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Sales
          </h2>
          <button
            onClick={() => navigate("/dashboard/sales")}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
                
                <th className="px-5 py-3">Customer</th>
                
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSales.map((sale) => (
                <tr key={sale.sale_id} className="hover:bg-gray-50 transition-colors">
                  
                  <td className="px-5 py-3.5 text-gray-700">{sale.customer_name}</td>
                  
                  <td className="px-5 py-3.5 text-gray-700">
                   ₹{sale.total_amount}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
