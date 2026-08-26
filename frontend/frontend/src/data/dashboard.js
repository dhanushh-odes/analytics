const dashboardData = {
  cards: [
    {
      title: "Revenue",
      value: "₹2,45,000",
      change: "+12%",
      route: "/dashboard/sales",
    },
    {
      title: "Sales",
      value: 158,
      change: "+8%",
      route: "/dashboard/sales",
    },
    {
      title: "Products",
      value: 125,
      change: "+5%",
      route: "/dashboard/products",
    },
    {
      title: "Customers",
      value: 240,
      change: "+18%",
      route: "/dashboard/customers",
    },
  ],

  salesTrend: [
    { month: "Jan", sales: 40 },
    { month: "Feb", sales: 55 },
    { month: "Mar", sales: 70 },
    { month: "Apr", sales: 65 },
    { month: "May", sales: 85 },
    { month: "Jun", sales: 100 },
  ],
};

export default dashboardData;