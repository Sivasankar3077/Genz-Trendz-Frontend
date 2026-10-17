import React, { useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  Phone,
  CreditCard,
  IndianRupee,
  ShoppingBag,
  CalendarDays,
  ShieldCheck,
  Loader2,
  User,
  Home,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyOrderById } from "../slices/orderSlice";
import { dateFormatter } from "../utils/dateFormatter";

const OrderDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {loading , order , error} = useSelector((state) => state.order);

  useEffect(() => {

    dispatch(getMyOrderById(id));

  }, [dispatch, id]);

  useEffect(() => {

    if (error) {
      toast.error(error, {position: "top-center",duration: 2000,});
    }
  }, [error]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const getStatusData = (status) => {

    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "delivered") {
      return { label: "Delivered", color: "green", icon: CheckCircle2,};
    }

    if (normalizedStatus === "shipped") {
      return {
        label: "Shipped",
        color: "blue",
        icon: Truck,
      };
    }

    if (normalizedStatus === "payment pending") {
      return { label: "Payment Pending", color: "orange", icon: Clock3 };
    }

    if (normalizedStatus === "payment failed" || normalizedStatus === "payment cancelled" || normalizedStatus === "cancelled") {
      return {
        label: "Cancelled",
        color: "red",
        icon: XCircle,
      };
    }

    return {
      label: "Processing",
      color: "orange",
      icon: Clock3,
    };
  };

  //loading
  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  //no orderdetail
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 text-center max-w-md w-full">

          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
            <Package className="w-9 h-9 text-slate-400" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-6">
            Order not found
          </h2>

          <p className="text-slate-500 mt-2">
            We couldn't find the order you're looking for.
          </p>

          <button
            onClick={() => navigate("/myorders")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Back to My Orders
          </button>

        </div>
      </div>
    );
  }


  const statusData = getStatusData(order.orderStatus);
  const StatusIcon = statusData.icon;
  const status = order.orderStatus?.toLowerCase();
  const isCancelled = status === "cancelled";
  const isShipped = status === "shipped" || status === "delivered";
  const isDelivered = status === "delivered";

  return (
    <div className="min-h-screen bg-slate-50">

          {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>
                Back to My Orders
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>

              <span className="font-bold text-xl text-blue-600">
                Genzz Trendz
              </span>

            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure Order
            </div>
          </div>
        </div>
      </div>


          {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Order Details
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-1">
            <div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <CalendarDays className="w-4 h-4" />
                Ordered on {dateFormatter(order.createdAt)}

              </div>
            </div>

            {/* STATUS */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold w-fit ${
                isCancelled
                  ? "bg-red-50 text-red-700"
                  : isDelivered
                  ? "bg-green-50 text-green-700"
                  : isShipped
                  ? "bg-blue-50 text-blue-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >

              <StatusIcon className="w-4 h-4" />

              {statusData.label}

            </div>

          </div>

        </div>


        {/* =====================================================
            STATUS TIMELINE
        ====================================================== */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

              <Truck className="w-5 h-5 text-blue-600" />

            </div>

            <div>

              <h2 className="font-bold text-lg text-slate-900">
                Order Status
              </h2>

              <p className="text-sm text-slate-500">
                Track your order progress
              </p>

            </div>

          </div>


          {isCancelled ? (

            <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-2xl p-5">

              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">

                <XCircle className="w-6 h-6 text-red-600" />

              </div>

              <div>

                <p className="font-bold text-red-800">
                  Order Cancelled
                </p>

                <p className="text-sm text-red-600 mt-1">
                  This order has been cancelled.
                </p>

              </div>

            </div>

          ) : (

            <div className="grid grid-cols-3 gap-4">

              {/* PROCESSING */}

              <div className="relative">

                <div className="flex flex-col items-center text-center">

                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">

                    <CheckCircle2 className="w-6 h-6" />

                  </div>

                  <p className="font-bold text-slate-900 mt-3">
                    Processing
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Order confirmed
                  </p>

                </div>

              </div>


              {/* SHIPPED */}

              <div className="relative">

                <div className="flex flex-col items-center text-center">

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isShipped
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >

                    <Truck className="w-6 h-6" />

                  </div>

                  <p
                    className={`font-bold mt-3 ${
                      isShipped
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    Shipped
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    On the way
                  </p>

                </div>

              </div>


              {/* DELIVERED */}

              <div className="relative">

                <div className="flex flex-col items-center text-center">

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDelivered
                        ? "bg-green-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >

                    <CheckCircle2 className="w-6 h-6" />

                  </div>

                  <p
                    className={`font-bold mt-3 ${
                      isDelivered
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    Delivered
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Successfully delivered
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* =====================================================
            CONTENT GRID
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="lg:col-span-8 space-y-8">


            {/* ORDER ITEMS */}

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 border-b border-slate-100">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Order Items
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {order.orderItems?.length || 0}{" "}
                      {order.orderItems?.length === 1
                        ? "item"
                        : "items"}
                    </p>

                  </div>

                  <Package className="w-5 h-5 text-slate-400" />

                </div>

              </div>


              <div className="p-6 space-y-5">

                {order.orderItems?.map((item, index) => (

                  <div
                    key={`${item.product}-${index}`}
                    className="flex gap-4"
                  >

                    {/* IMAGE */}

                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0">

                      <img
                        src={
                          item.image ||
                          "/placeholder.png"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />

                    </div>


                    {/* INFO */}

                    <div className="flex-1 min-w-0">

                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        Quantity:{" "}
                        <span className="font-semibold text-slate-700">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Price:{" "}
                        <span className="font-semibold text-slate-700">
                          ₹{formatPrice(item.price)}
                        </span>
                      </p>

                    </div>


                    {/* TOTAL */}

                    <div className="text-right">

                      <p className="text-xs text-slate-400">
                        Total
                      </p>

                      <p className="font-bold text-lg text-slate-900 mt-1">

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

            </section>


            {/* DELIVERY ADDRESS */}

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                    <MapPin className="w-5 h-5 text-blue-600" />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Delivery Address
                    </h2>

                    <p className="text-sm text-slate-500">
                      Your order will be delivered here
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-6">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">

                    <Home className="w-5 h-5 text-slate-600" />

                  </div>

                  <div className="space-y-1">

                    <p className="font-bold text-slate-900">

                      {order.shippingAddress?.address}

                    </p>

                    <p className="text-sm text-slate-500">

                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}

                    </p>

                    <p className="text-sm text-slate-500">

                      Pincode:{" "}
                      {order.shippingAddress?.pincode}

                    </p>

                    <div className="flex items-center gap-2 text-sm text-slate-600 pt-2">

                      <Phone className="w-4 h-4" />

                      {order.shippingAddress?.phoneNo}

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* PAYMENT */}

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-6 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">

                    <CreditCard className="w-5 h-5 text-purple-600" />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Payment Information
                    </h2>

                    <p className="text-sm text-slate-500">
                      Payment details for this order
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-xs text-slate-400 uppercase font-semibold">
                    Payment Method
                  </p>

                  <p className="font-bold text-slate-900 mt-2">

                    {order.paymentInfo?.paymentType === "COD"
                      ? "Cash on Delivery"
                      : order.paymentInfo?.paymentType || "N/A"}

                  </p>

                </div>


                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-xs text-slate-400 uppercase font-semibold">
                    Payment Status
                  </p>

                  <p className="font-bold text-green-600 mt-2">

                    {order.paymentInfo?.paymentStatus || "Pending"}

                  </p>

                </div>


                <div className="bg-slate-50 rounded-2xl p-4 sm:col-span-2">

                  <p className="text-xs text-slate-400 uppercase font-semibold">
                    Payment ID
                  </p>

                  <p className="font-semibold text-slate-700 mt-2 break-all">

                    {order.paymentInfo?.id || "N/A"}

                  </p>

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="lg:col-span-4">

            <div className="lg:sticky lg:top-6 space-y-6">


              {/* PRICE SUMMARY */}

              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-100">

                  <h2 className="text-lg font-bold text-slate-900">
                    Price Details
                  </h2>

                </div>


                <div className="p-6 space-y-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Item Price
                    </span>

                    <span className="font-semibold text-slate-900">
                      ₹{formatPrice(order.itemPrice)}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      GST (18%)
                    </span>

                    <span className="font-semibold text-slate-900">
                      ₹{formatPrice(order.taxPrice)}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Shipping
                    </span>

                    <span
                      className={`font-semibold ${
                        Number(order.shippingPrice) === 0
                          ? "text-green-600"
                          : "text-slate-900"
                      }`}
                    >

                      {Number(order.shippingPrice) === 0
                        ? "FREE"
                        : `₹${formatPrice(
                            order.shippingPrice
                          )}`}

                    </span>

                  </div>


                  <div className="border-t border-slate-200 pt-4">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-bold text-slate-900">
                          Total Amount
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Inclusive of GST
                        </p>

                      </div>

                      <div className="flex items-center text-xl font-bold text-slate-900">

                        <IndianRupee className="w-5 h-5" />

                        {formatPrice(order.totalPrice)}

                      </div>

                    </div>

                  </div>

                </div>

              </section>


              {/* DELIVERY INFO */}

              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">

                    <Truck className="w-5 h-5 text-green-600" />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Estimated Delivery
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Your order will arrive within
                    </p>

                    <p className="font-bold text-green-600 mt-1">
                      3–7 Business Days
                    </p>

                  </div>

                </div>

              </section>


              {/* ACTIONS */}

              <div className="space-y-3">

                <button
                  onClick={() => navigate("/myorders")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition"
                >
                  Back to My Orders
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-semibold transition"
                >
                  Continue Shopping
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default OrderDetails;