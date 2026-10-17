import React, { useEffect, useMemo } from "react";
import {
  ShoppingCart,
  IndianRupee,
  ArrowUpRight,
  Eye,
  Clock3,
  CheckCircle2,
  Truck,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../slices/orderSlice";

const AdminDashboard = () => {

  const dispatch = useDispatch()

  const {loading,error,message,orders,total} = useSelector((state) => state.order);
  useEffect(()=>{
    dispatch(getAllOrders())

    if(error){
      toast.error(error, {position : 'top-center' , duration : 2000})
    }
  } , [dispatch])

  const dashboardStats = useMemo(() => {

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum , order) =>
      sum + order.totalPrice , 0
    )

    return {
      totalOrders,
      totalRevenue,
    };

  }, [orders, total]);


  // RECENT ORDERS
  const recentOrders = orders.slice(0, 5);


  // STATUS STYLE
  const statusStyle = {
    Processing:
      "bg-amber-50 text-amber-600 border-amber-100",

    Delivered:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

    Pending:
      "bg-orange-50 text-orange-600 border-orange-100",

    Shipped:
      "bg-blue-50 text-blue-600 border-blue-100",

    Cancelled:
      "bg-red-50 text-red-600 border-red-100",
  };


  // STATUS ICON
  const getStatusIcon = (status) => {

    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={11} />;

      case "Shipped":
        return <Truck size={11} />;

      case "Processing":
        return <Clock3 size={11} />;

      case "Pending":
        return <Clock3 size={11} />;

      default:
        return null;
    }
  };


  // LOADING
  if (loading && !orders.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">

          {/* HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-7 lg:px-9 sticky top-0 z-30">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of your store performance
          </p>
        </div>

        <button
          type="button"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition"
        >

          <span>Today</span>

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </header>

          {/* CONTENT */}
      <div className="p-5 sm:p-7 lg:p-9 max-w-[1600px] mx-auto">
            {/* WELCOME */}
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Good evening, Admin 👋
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with Genzz Trendz today.
          </p>
        </div>


          {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Revenue
                </p>

                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">

                  ₹
                  {dashboardStats.totalRevenue.toLocaleString(
                    "en-IN"
                  )}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <IndianRupee size={23} />
              </div>
            </div>


            <div className="flex items-center gap-2 mt-5">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <ArrowUpRight size={14} />
                Revenue
              </span>

              <span className="text-xs text-slate-400">
                from all orders
              </span>
            </div>
          </div>


          {/* TOTAL ORDERS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Orders
                </p>

                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">

                  {dashboardStats.totalOrders.toLocaleString(
                    "en-IN"
                  )}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart size={23} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
                <ArrowUpRight size={14} />
                Orders
              </span>

              <span className="text-xs text-slate-400">
                all time orders
              </span>
            </div>
          </div>
        </div>


            {/* RECENT ORDERS */}
        <div className="mt-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-slate-900">
                  Recent Orders
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Latest orders from customers
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>


                {/* EMPTY STATE */}
            {recentOrders.length === 0 ? (
              <div className="py-14 text-center">
                <ShoppingCart
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-500 mt-3">
                  No orders found
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Orders will appear here once customers place them.
                </p>
              </div>
            ) : (

              <div className="overflow-x-auto">
                <table className="w-full min-w-162.5">
                  <thead>
                    <tr className="text-left border-b border-slate-100">

                      <th className="pb-3 px-2 text-[10px] uppercase tracking-wider text-slate-400">
                        Order
                      </th>

                      <th className="pb-3 px-2 text-[10px] uppercase tracking-wider text-slate-400">
                        Customer
                      </th>

                      <th className="pb-3 px-2 text-[10px] uppercase tracking-wider text-slate-400">
                        Amount
                      </th>

                      <th className="pb-3 px-2 text-[10px] uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="pb-3 px-2" />
                    </tr>
                  </thead>


                  <tbody>

                    {recentOrders.map((order) => {

                      const orderId =
                        order._id ||
                        order.id ||
                        "N/A";

                      const customerName =
                        order.user?.name ||
                        order.user?.username ||
                        order.customer?.name ||
                        order.customer ||
                        "Customer";

                      const amount =
                        Number(order.totalPrice) ||
                        Number(order.totalAmount) ||
                        Number(order.amount) ||
                        Number(order.total) ||
                        0;

                      const status =
                        order.status ||
                        order.orderStatus ||
                        "Pending";

                      const date = order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-";


                      return (

                        <tr
                          key={orderId}
                          className="border-b last:border-0 border-slate-100"
                        >

                          {/* ORDER */}

                          <td className="py-4 px-2">

                            <p className="text-xs font-bold text-slate-700">
                              #{String(orderId).slice(-8)}
                            </p>

                            <p className="text-[10px] text-slate-400 mt-1">
                              {date}
                            </p>

                          </td>


                          {/* CUSTOMER */}

                          <td className="py-4 px-2">

                            <p className="text-sm font-semibold text-slate-700">
                              {customerName}
                            </p>

                          </td>


                          {/* AMOUNT */}

                          <td className="py-4 px-2">

                            <p className="text-sm font-black text-slate-900">
                              ₹
                              {amount.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </td>


                          {/* STATUS */}

                          <td className="py-4 px-2">

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                                statusStyle[status] ||
                                "bg-slate-50 text-slate-600 border-slate-100"
                              }`}
                            >

                              {getStatusIcon(status)}

                              {status}

                            </span>

                          </td>


                          {/* VIEW */}

                          <td className="py-4 px-2">

                            <button
                              type="button"
                              className="w-8 h-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 flex items-center justify-center transition"
                            >

                              <Eye size={15} />

                            </button>

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>


      </div>

    </div>
  );
};

export default AdminDashboard;