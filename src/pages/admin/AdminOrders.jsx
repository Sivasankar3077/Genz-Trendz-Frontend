import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../slices/orderSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    orders = [],
  } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5;


  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);


  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Payment Pending"
  );

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  );

  const cancelledOrders = orders.filter(
    (order) => ["Cancelled", "Payment Cancelled", "Payment Failed"].includes(order.orderStatus)
  );


  const statusStyle = {
    Processing:
      "bg-amber-50 text-amber-600 border-amber-100",

    Delivered:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

    Pending:
      "bg-orange-50 text-orange-600 border-orange-100",
    "Payment Pending":
      "bg-orange-50 text-orange-600 border-orange-100",
    "Payment Failed":
      "bg-red-50 text-red-500 border-red-100",
    "Payment Cancelled":
      "bg-red-50 text-red-500 border-red-100",

    Shipped:
      "bg-blue-50 text-blue-600 border-blue-100",

    Cancelled:
      "bg-red-50 text-red-500 border-red-100",
  };


  const StatusIcon = ({ status }) => {
    if (status === "Delivered") {
      return <CheckCircle2 size={12} />;
    }

    if (status === "Shipped") {
      return <Truck size={12} />;
    }

    if (status === "Cancelled") {
      return <XCircle size={12} />;
    }

    return <Clock3 size={12} />;
  };


  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const getInitial = (username) => {
    if (!username) return "U";

    return username.charAt(0).toUpperCase();
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((order) => {
        const orderId = order?._id?.toLowerCase() || "";

        const username =
          order?.user?.username?.toLowerCase() || "";

        const email =
          order?.user?.email?.toLowerCase() || "";

        return (
          orderId.includes(searchValue) ||
          username.includes(searchValue) ||
          email.includes(searchValue)
        );
      });
    }

    // Status Filter
    if (statusFilter !== "All Status") {
      result = result.filter(
        (order) => order.orderStatus === statusFilter
      );
    }

    return result;
  }, [orders, search, statusFilter]);


  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);


  const totalOrders = filteredOrders.length;

  const totalPages = Math.ceil(
    totalOrders / ordersPerPage
  );

  const startIndex =
    (currentPage - 1) * ordersPerPage;

  const endIndex =
    startIndex + ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    endIndex
  );


  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };


  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-slate-50">

          {/* HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-7 lg:px-9 sticky top-0 z-30">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Orders
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and manage customer orders
          </p>
        </div>
      </header>


          {/* CONTENT */}
      <div className="p-5 sm:p-7 lg:p-9 max-w-[1600px] mx-auto">

            {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* TOTAL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </p>

            <p className="text-2xl font-black text-slate-900 mt-2">
              {orders.length}
            </p>
          </div>


          {/* PENDING */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending
            </p>

            <p className="text-2xl font-black text-amber-500 mt-2">
              {pendingOrders.length}
            </p>

          </div>


          {/* DELIVERED */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivered
            </p>

            <p className="text-2xl font-black text-emerald-600 mt-2">
              {deliveredOrders.length}
            </p>

          </div>


          {/* CANCELLED */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cancelled
            </p>

            <p className="text-2xl font-black text-red-500 mt-2">
              {cancelledOrders.length}
            </p>

          </div>

        </div>


        {/* =================================
            ORDER TABLE CONTAINER
        ================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {/* TOOLBAR */}
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full lg:w-80">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search order or customer..."
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {/* FILTER */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 h-11 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  <SlidersHorizontal size={16} />
                  Filter
                </button>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="h-11 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 outline-none bg-white cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Payment Pending</option>
                  <option>Payment Failed</option>
                  <option>Payment Cancelled</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>


              {/* LOADING */}
          {loading && (

            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 mt-4">
                Loading orders...
              </p>
            </div>
          )}


              {/* ERROR */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 px-5">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <XCircle size={24} />
              </div>

              <p className="text-sm font-bold text-red-500 mt-4">
                Failed to load orders
              </p>

              <p className="text-xs text-slate-400 mt-1 text-center">
                {error}
              </p>
            </div>
          )}

              {/* EMPTY */}
          {!loading &&
            !error &&
            currentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Package size={28} />
                </div>

                <p className="text-sm font-bold text-slate-700 mt-4">
                  No orders found
                </p>

                <p className="text-xs text-slate-400 mt-1 text-center">
                  Try changing your search or filter.
                </p>
              </div>
            )}


              {/* DESKTOP TABLE */}
          {!loading &&
            !error &&
            currentOrders.length > 0 && (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-275">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100">

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Order
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Customer
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Date
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Items
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Amount
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Status
                      </th>

                      <th className="text-right px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    {currentOrders.map((order) => (

                      <tr
                        key={order._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition"
                      >

                        {/* ORDER */}

                        <td className="px-5 py-4">
                          <p className="text-xs font-bold text-slate-700">
                            #{order?._id}
                          </p>
                        </td>


                        {/* CUSTOMER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black uppercase">
                              {getInitial(
                                order?.user?.username
                              )}
                            </div>
                            <div>

                              <p className="text-sm font-bold text-slate-700">
                                {order?.user?.username ||
                                  "Unknown User"}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                {order?.user?.email ||
                                  "No email"}
                              </p>
                            </div>
                          </div>
                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(order?.createdAt)}
                        </td>


                        {/* ITEMS */}
                        <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                          {order?.orderItems?.length || 0}{" "}
                          {order?.orderItems?.length === 1
                            ? "item"
                            : "items"}
                        </td>


                        {/* AMOUNT */}
                        <td className="px-5 py-4 text-sm font-black text-slate-900">
                          ₹
                          {Number(
                            order?.totalPrice || 0
                          ).toLocaleString("en-IN")}
                        </td>


                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold ${
                              statusStyle[
                                order?.orderStatus
                              ] ||
                              "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >

                            <StatusIcon
                              status={order?.orderStatus}
                            />

                            {order?.orderStatus || "Unknown"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="View Order"
                              className="w-9 h-9 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              title="More Options"
                              className="w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition"
                            >

                              <MoreHorizontal
                                size={17}
                              />

                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


              {/* MOBILE CARDS */}

          {!loading &&
            !error &&
            currentOrders.length > 0 && (
              <div className="md:hidden divide-y divide-slate-100">
                {currentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          #{order?._id}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(
                            order?.createdAt
                          )}
                        </p>
                      </div>


                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-bold ${
                          statusStyle[
                            order?.orderStatus
                          ] ||
                          "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                      >

                        <StatusIcon
                          status={order?.orderStatus}
                        />

                        {order?.orderStatus || "Unknown"}
                      </span>
                    </div>


                    {/* CUSTOMER */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black uppercase">
                        {getInitial(
                          order?.user?.username
                        )}
                      </div>


                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">
                          {order?.user?.username ||
                            "Unknown User"}
                        </p>

                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {order?.user?.email ||
                            "No email"}
                        </p>
                      </div>
                    </div>


                    {/* BOTTOM */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">

                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Amount
                        </p>

                        <p className="text-sm font-black text-slate-900 mt-1">

                          ₹
                          {Number(
                            order?.totalPrice || 0
                          ).toLocaleString("en-IN")}

                        </p>
                      </div>


                      {/* ITEMS */}
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Items
                        </p>

                        <p className="text-sm font-bold text-slate-700 mt-1">

                          {order?.orderItems?.length ||
                            0}
                        </p>
                      </div>

                      {/* VIEW */}
                      <button
                        type="button"
                        title="View Order"
                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"
                      >

                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}


              {/* PAGINATION */}

          {!loading &&
            !error &&
            totalOrders > 0 && (

              <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* SHOWING */}
                <p className="text-xs text-slate-400">

                  Showing{" "}

                  <span className="font-bold text-slate-600">

                    {startIndex + 1}–
                    {Math.min(
                      endIndex,
                      totalOrders
                    )}

                  </span>{" "}

                  of{" "}

                  <span className="font-bold text-slate-600">

                    {totalOrders}

                  </span>{" "}

                  orders

                </p>


                {/* PAGINATION */}

                {totalPages > 1 && (

                  <div className="flex items-center gap-1">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                        currentPage === 1
                          ? "border-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >

                      <ChevronLeft size={16} />

                    </button>


                    {/* PAGE NUMBERS */}

                    {pageNumbers.map((page) => (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          setCurrentPage(page)
                        }
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >

                        {page}

                      </button>

                    ))}


                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        currentPage === totalPages
                      }
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                        currentPage === totalPages
                          ? "border-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >

                      <ChevronRight size={16} />

                    </button>

                  </div>

                )}

              </div>

            )}

        </div>

      </div>

    </div>
  );
};

export default AdminOrders;
