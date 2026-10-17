import React, { useEffect } from "react";
import {
  Package,
  ShoppingBag,
  CalendarDays,
  IndianRupee,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../slices/orderSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {orders , loading ,error} = useSelector((state) => state.order);

  console.log(orders)
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {

    const normalizedStatus = status?.toLowerCase();

    if (
      normalizedStatus === "delivered"
    ) {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: CheckCircle2,
      };
    }

    if (
      normalizedStatus === "shipped"
    ) {
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: Truck,
      };
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "payment cancelled" ||
      normalizedStatus === "payment failed"
    ) {
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: XCircle,
      };
    }

    return {
      bg: "bg-orange-50",
      text: "text-orange-700",
      icon: Clock3,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />

          <p className="text-slate-500 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  My Orders
                </h1>

                <p className="text-slate-500 mt-1">
                  Track and manage your recent orders
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* CONTENT */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {orders.length === 0 && !error ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-slate-400" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-6">
              No orders yet
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping and your
              orders will appear here.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold transition"
            >
              Start Shopping
            </button>
          </div>

        ) : (

          <div className="space-y-6">
            {orders.map((order) => {

              const statusStyle = getStatusStyle(order.orderStatus);
              const StatusIcon = statusStyle.icon;
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >

                  {/* ORDER HEADER */}
                  <div className="p-5 sm:p-6 border-b border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                            Order ID
                          </p>

                          <p className="font-bold text-slate-900 mt-1">
                            #{order._id?.slice(-8).toUpperCase()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                            Ordered On
                          </p>

                          <div className="flex items-center gap-1.5 mt-1">
                            <CalendarDays className="w-4 h-4 text-slate-400" />

                            <p className="font-semibold text-slate-700">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>


                      {/* STATUS */}
                      <div
                        className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-3.5 py-2 rounded-full text-sm font-bold w-fit`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {order.orderStatus || "Processing"}
                      </div>
                    </div>
                  </div>


                  {/* PRODUCTS */}
                  <div className="p-5 sm:p-6">
                    <div className="space-y-4">
                      {order.orderItems?.map((item, index) => (
                        <div
                          key={`${order._id}-${item.product}-${index}`}
                          className="flex items-center gap-4"
                        >
                          {/* IMAGE */}
                          <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                            <img src={ item.image || "/placeholder.png" }
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>


                          {/* INFO */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 line-clamp-2">
                              {item.name}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              Quantity: {item.quantity}
                            </p>

                            <p className="text-sm font-bold text-slate-900 mt-1">
                              ₹{formatPrice(item.price)}
                            </p>
                          </div>


                          {/* ITEM TOTAL */}
                          <div className="hidden sm:block text-right">
                            <p className="text-xs text-slate-400">
                              Item Total
                            </p>

                            <p className="font-bold text-slate-900 mt-1">
                              ₹
                              {formatPrice(
                                Number(item.price || 0) *
                                Number(item.quantity || 1)
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* FOOTER */}
                  <div className="bg-slate-50 border-t border-slate-100 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex flex-wrap items-center gap-5">
                        {/* PAYMENT */}
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase">
                            Payment
                          </p>

                          <p className="font-semibold text-slate-700 mt-1">
                            {order.paymentInfo?.paymentType === "COD"
                              ? "Cash on Delivery"
                              : order.paymentInfo?.paymentType || "N/A"}
                          </p>
                        </div>


                        {/* TOTAL */}
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase">
                            Total Amount
                          </p>

                          <div className="flex items-center font-bold text-lg text-slate-900 mt-1">
                            <IndianRupee className="w-4 h-4" />
                            {formatPrice(order.totalPrice)}
                          </div>
                        </div>
                      </div>

                      {/* VIEW */}
                      <button
                        onClick={() =>
                          navigate(`/myorders/${order._id}`)
                        }
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold transition"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;