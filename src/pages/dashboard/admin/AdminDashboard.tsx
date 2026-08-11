import { useGetAllOrderQuery } from "@/redux/features/orders/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { Card, Skeleton } from "antd";
import { Users, Package, ShoppingBag, Clock, CheckCircle2, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const formatCurrency = (amount: number): string =>
  `৳${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const AdminDashboard = () => {
  const { data: users, isLoading: usersLoading } = useGetAllUserQuery(null);
  const { data: products, isLoading: productsLoading } = useGetAllProductsQuery({
    params: { limit: 10, page: 1 },
  });
  const { data: orders, isLoading: ordersLoading } = useGetAllOrderQuery(null);

  const orderList = orders?.data ?? [];
  const pendingOrders = orderList.filter((o: any) => !o.isDelivered).length;
  const completedOrders = orderList.filter((o: any) => o.isDelivered).length;
  const totalRevenue = orderList.reduce((acc: number, o: any) => acc + (o.amount ?? 0), 0);

  const isLoading = usersLoading || productsLoading || ordersLoading;

  const items = [
    {
      icon: <Users size={20} />,
      value: users?.data?.length ?? 0,
      bgColor: "#dbe0f9",
      title: "Total Users",
      path: "/admin/users",
    },
    {
      icon: <Package size={20} />,
      value: products?.meta?.total ?? products?.data?.length ?? 0,
      bgColor: "#ffd4e6",
      title: "Available Products",
      path: "/admin/products",
    },
    {
      icon: <ShoppingBag size={20} />,
      value: orderList.length,
      bgColor: "#d9effa",
      title: "Total Orders",
      path: "/admin/orders",
    },
    {
      icon: <Clock size={20} />,
      value: pendingOrders,
      bgColor: "#fff2cc",
      title: "Pending Orders",
      path: "/admin/orders?status=pending",
    },
    {
      icon: <CheckCircle2 size={20} />,
      value: completedOrders,
      bgColor: "#d7f5df",
      title: "Completed Orders",
      path: "/admin/orders?status=completed",
    },
    {
      icon: <Wallet size={20} />,
      value: formatCurrency(totalRevenue),
      bgColor: "#e6dcf9",
      title: "Total Revenue",
      path: "/admin/orders",
    },
  ];

  return (
    <>
      <div className="bg-teal-100 p-2 rounded-lg text-lg text-center mt-2">
        Welcome to Admin Dashboard
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
        {items.map((item) => (
          <Link key={item.title} to={item.path} className="block">
            <Card
              className="text-center h-32 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: item.bgColor }}
            >
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 1 }} title={false} />
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    {item.icon}
                    <p className="text-[16px] font-medium">{item.title}</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{item.value}</p>
                </>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AdminDashboard;