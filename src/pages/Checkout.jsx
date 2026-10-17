import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  WalletCards,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewOrder, removeError, removeOrderMessage } from "../slices/orderSlice";
import toast from "react-hot-toast";
import { clearCartItems } from "../slices/cartSlice";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const InputField = ({
  label,
  name,
  placeholder,
  type = "text",
  icon: Icon,
  className = "",
  value,
  onChange,
  error,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? "pl-11" : "px-4"
          } pr-4 py-3.5 rounded-xl border ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
          } outline-none bg-white text-slate-800 placeholder:text-slate-400 focus:ring-4 transition`}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { cartItems = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const {orderMessage , orderLoading , orders , error} = useSelector(state => state.order)


  const [step, setStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({
    firstName: user?.username || "",
    lastName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0
    );
  }, [cartItems]);

  const shipping = subtotal > 500 ? 0 : 100;

  const gst = useMemo(() => {
    return (subtotal * 18) / 100;
  }, [subtotal]);

  const total = subtotal + shipping + gst;

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10 digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6 digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (!validateForm()) {
      return;
    }
    setStep(2);
  };


  const handlePlaceOrder = async () => {
    if (isProcessingPayment) return;

    const shippingAddress = {
      address: formData.address.trim(),
      pincode: formData.pincode,
      city: formData.city.trim(),
      phoneNo: formData.mobile,
      state: formData.state.trim(),
    };
    const orderItems = cartItems.map((item) => ({
      quantity: Number(item.quantity),
      product: item.product,
    }));

    setIsProcessingPayment(true);

    try {
      // Cash on Delivery stays on the existing order API.
      if (paymentMethod === "COD") {
        await dispatch(createNewOrder({ shippingAddress, orderItems })).unwrap();
        dispatch(clearCartItems());
        toast.success("Your COD order has been placed.");
        navigate("/myorders");
        return;
      }

      // The server calculates the amount from database product prices.
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout. Check your internet connection and try again.");
      }

      const { data } = await axios.post(
        "/api/payment/create-order",
        { shippingAddress, orderItems, paymentMethod },
        { withCredentials: true }
      );

      if (!data?.success || !data?.order?.id || !data?.key) {
        throw new Error(data?.message || "Unable to start payment.");
      }

      let checkoutReturned = false;
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "GenZ Trendz",
        description: "Secure order payment",
        order_id: data.order.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: user?.email || "",
          contact: formData.mobile,
        },
        notes: { localOrderId: String(data.localOrderId || "") },
        theme: { color: "#2563EB" },
        handler: async (paymentResponse) => {
          checkoutReturned = true;
          try {
            const verification = await axios.post(
              "/api/payment/verify",
              paymentResponse,
              { withCredentials: true }
            );

            if (!verification.data?.success) {
              throw new Error(verification.data?.message || "Payment verification failed.");
            }

            dispatch(clearCartItems());
            toast.success("Payment verified! Your order is confirmed.");
            navigate("/myorders");
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError);
            toast.error(
              verificationError.response?.data?.message ||
                verificationError.message ||
                "Payment was submitted, but verification is pending. Please check My Orders before retrying."
            );
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: async () => {
            if (!checkoutReturned) {
              try {
                await axios.post(
                  "/api/payment/cancel",
                  { razorpay_order_id: data.order.id },
                  { withCredentials: true }
                );
              } catch (cancelError) {
                console.warn("Could not update cancelled payment:", cancelError.message);
              }
            }
            setIsProcessingPayment(false);
          },
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", async (event) => {
        checkoutReturned = true;
        try {
          await axios.post(
            "/api/payment/failed",
            { razorpay_order_id: data.order.id },
            { withCredentials: true }
          );
        } catch (failedStatusError) {
          console.warn("Could not update failed payment:", failedStatusError.message);
        }
        toast.error(event?.error?.description || "Payment failed. You can try again.");
        setIsProcessingPayment(false);
      });
      checkout.open();
    } catch (error) {
      console.error("Order/payment start failed:", error);
      toast.error(
        error?.response?.data?.message || error?.response?.data?.msg || error.message || "Unable to place order. Please try again.",
        { position: "top-center", duration: 3000 }
      );
      dispatch(removeError());
      setIsProcessingPayment(false);
    }
  };

  // EMPTY CART
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <ShoppingBag className="w-9 h-9 text-slate-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h2>

          <p className="text-slate-500 mt-2 mb-6">
            Add some products to your cart before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // STEP HEADER
  const StepItem = ({ number, title }) => {
    const active = step >= number;
    const completed = step > number;

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            active
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {completed ? "✓" : number}
        </div>

        <span
          className={`hidden sm:block text-sm font-semibold ${
            active ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {title}
        </span>
      </div>
    );
  };

  // ORDER SUMMARY
  const OrderSummary = ({ showProducts = true }) => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            <ShoppingBag className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* PRODUCTS */}
        {showProducts && (
          <div className="p-5 sm:p-6 max-h-90 overflow-y-auto space-y-4">
            {cartItems.map((item, index) => {
              const img = item?.image || "/placeholder.png";
              const quantity = Number(item.quantity || 1);

              return (
                <div
                  key={item?.product}
                  className="flex gap-4"
                >
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Qty: {quantity}
                    </p>

                    <p className="font-bold text-slate-900 mt-2">
                      ₹
                      {formatPrice(
                        Number(item.price || 0) * quantity
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PRICE SUMMARY */}
        <div className="border-t border-slate-100 p-5 sm:p-6">
          <div className="space-y-4">
            {/* SUBTOTAL */}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-semibold text-slate-900">
                ₹{formatPrice(subtotal)}
              </span>
            </div>

            {/* SHIPPING */}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Shipping
              </span>

              <span
                className={`font-semibold ${
                  shipping === 0
                    ? "text-green-600"
                    : "text-slate-900"
                }`}
              >
                {shipping === 0
                  ? "FREE"
                  : `₹${formatPrice(shipping)}`}
              </span>
            </div>

            {/* GST */}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                GST <span className="text-xs">(18%)</span>
              </span>

              <span className="font-semibold text-slate-900">
                ₹{formatPrice(gst)}
              </span>
            </div>

            {/* FREE SHIPPING */}
            {shipping === 0 && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-3 py-2.5 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                You're getting free shipping!
              </div>
            )}

            {/* TOTAL */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Total
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Inclusive of GST
                  </p>
                </div>

                <div className="flex items-center text-xl font-bold text-slate-900">
                  <IndianRupee className="w-5 h-5" />
                  {formatPrice(total)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MAIN

  return (
    <div className="min-h-screen bg-slate-50">
        {/* header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">

            {/* BACK */}
            {step === 1 ? (
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </button>
            ) : step === 2 ? (
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Address
              </button>
            ) : (
              <div />
            )}

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>

              <span className="font-bold text-xl text-blue-600">
                Genzz Trendz
              </span>
            </div>

            {/* SECURE */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>


          {/* CHECKOUT STEPS */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-5">

            <div className="flex items-center">
              <StepItem
                number={1}
                title="Address"
              />

              <div
                className={`w-12 sm:w-24 h-px mx-3 transition-all ${
                  step >= 2
                    ? "bg-blue-600"
                    : "bg-slate-300"
                }`}
              />

              <StepItem
                number={2}
                title="Payment"
              />

              <div
                className={`w-12 sm:w-24 h-px mx-3 transition-all ${
                  step >= 3
                    ? "bg-blue-600"
                    : "bg-slate-300"
                }`}
              />

              <StepItem
                number={3}
                title="Confirmation"
              />
            </div>
          </div>
        </div>
      </div>

          {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

            {/* STEP 1 - ADDRESS */}
        {step === 1 && (
          <>
            {/* TITLE */}

            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Step 1 of 3
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mt-1">
                Delivery Address
              </h1>

              <p className="text-slate-500 mt-2">
                Enter your delivery details and review your order.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* LEFT */}
              <div className="lg:col-span-7 space-y-6">

                {/* DELIVERY ADDRESS */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="p-5 sm:p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          Delivery Address
                        </h2>

                        <p className="text-sm text-slate-500">
                          Where should we deliver your order?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <InputField
                        label="First Name"
                        name="firstName"
                        placeholder="Enter first name"
                        icon={User}
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                      />

                      <InputField
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                      />

                      <InputField
                        label="Phone Number"
                        name="mobile"
                        placeholder="10 digit mobile number"
                        type="tel"
                        icon={Phone}
                        value={formData.mobile}
                        onChange={handleChange}
                        error={errors.mobile}
                      />

                      <div className="hidden sm:block" />

                      <InputField
                        label="Address"
                        name="address"
                        placeholder="House no, street, area"
                        icon={MapPin}
                        className="sm:col-span-2"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                      />

                      <InputField
                        label="City"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                      />

                      <InputField
                        label="State"
                        name="state"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                      />

                      <InputField
                        label="Pincode"
                        name="pincode"
                        placeholder="6 digit pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={handleChange}
                        error={errors.pincode}
                      />

                    </div>
                  </div>
                </section>

                {/* DELIVERY INFO */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Standard Delivery
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Your order will be delivered within 3–7 business days.
                      </p>

                      <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Free delivery above ₹500
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECURITY */}

                <section className="bg-blue-600 rounded-2xl p-5 sm:p-6 text-white">
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>

                      <h3 className="font-semibold">
                        Your information is secure
                      </h3>

                      <p className="text-sm text-blue-100 mt-1">
                        Your personal information is protected and used only
                        for processing your order.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT */}

              <div className="lg:col-span-5">
                <OrderSummary />
                {/* CONTINUE BUTTON */}
                <div className="mt-4">
                  <button
                    onClick={handleContinueToPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.99]"
                  >
                    <CreditCard className="w-5 h-5" />
                    Continue to Payment
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-3">
                    Your address will be saved securely for this order.
                  </p>

                </div>

              </div>

            </div>
          </>
        )}

        {/* =====================================================
            STEP 2 - PAYMENT
        ====================================================== */}

        {step === 2 && (
          <>
            {/* TITLE */}

            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Step 2 of 3
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mt-1">
                Payment
              </h1>

              <p className="text-slate-500 mt-2">
                Choose your preferred payment method.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* LEFT PAYMENT */}

              <div className="lg:col-span-7 space-y-6">

                {/* PAYMENT CARD */}

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                  <div className="p-5 sm:p-6 border-b border-slate-100">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>

                      <div>

                        <h2 className="text-lg font-bold text-slate-900">
                          Payment Method
                        </h2>

                        <p className="text-sm text-slate-500">
                          Select how you want to pay.
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* COD */}
                    <label
                      className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${
                        paymentMethod === "COD"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >

                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="w-5 h-5 accent-blue-600"
                      />

                      <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>

                      <div className="flex-1">

                        <p className="font-bold text-slate-900">
                          Cash on Delivery
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          Pay when your order is delivered.
                        </p>

                      </div>
                    </label>

                    {/* Online payment: Razorpay Checkout controls available methods. */}
                    <label
                      className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${
                        paymentMethod === "ONLINE"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={paymentMethod === "ONLINE"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                        <WalletCards className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">Online Payment with Razorpay</p>
                        <p className="text-sm text-slate-500 mt-1">
                          UPI, cards and other methods available for your account.
                        </p>
                      </div>
                    </label>
                  </div>
                </section>

                {/* ADDRESS PREVIEW */}

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4">

                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-600" />
                      </div>

                      <div>

                        <p className="font-bold text-slate-900">
                          Delivering to
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {formData.firstName}{" "}
                          {formData.lastName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {formData.address}, {formData.city}
                        </p>

                        <p className="text-sm text-slate-500">
                          {formData.state} - {formData.pincode}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {formData.mobile}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>

                  </div>

                </section>

                {/* SECURITY */}

                <section className="bg-blue-600 rounded-2xl p-5 sm:p-6 text-white">

                  <div className="flex items-start gap-4">

                    <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />

                    <div>

                      <h3 className="font-semibold">
                        Secure Checkout
                      </h3>

                      <p className="text-sm text-blue-100 mt-1">
                        Your order and payment information are protected.
                      </p>

                    </div>

                  </div>

                </section>

              </div>

              {/* RIGHT */}

              <div className="lg:col-span-5">

                <OrderSummary showProducts={false} />

                {/* ACTIONS */}

                <div className="mt-4 space-y-3">

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessingPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-5 h-5" />

                    {isProcessingPayment
                      ? "Processing..."
                      : paymentMethod === "COD"
                      ? "Place Order"
                      : "Pay Securely with Razorpay"}
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full border border-slate-200 hover:bg-white bg-slate-50 text-slate-700 py-3.5 rounded-xl font-semibold transition"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Address
                    </span>
                  </button>

                </div>

                <p className="text-center text-xs text-slate-400 mt-3">
                  By placing your order, you agree to our terms and
                  conditions.
                </p>

              </div>

            </div>
          </>
        )}

        {/* =====================================================
            STEP 3 - CONFIRMATION
        ====================================================== */}

        {step === 3 && (
          <div className="max-w-2xl mx-auto">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">

              {/* SUCCESS ICON */}

              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-11 h-11 text-green-600" />
              </div>

              <p className="text-sm font-bold text-green-600 uppercase tracking-wider mt-6">
                Order Confirmed
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Thank you for your order!
              </h1>

              <p className="text-slate-500 mt-4 leading-relaxed">
                Your order has been successfully placed. We'll send you
                updates about your delivery.
              </p>

              {/* ORDER DETAILS */}

              <div className="bg-slate-50 rounded-2xl p-5 mt-8 text-left">

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Payment Method
                  </span>

                  <span className="font-semibold text-slate-900">
                    {paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Razorpay (Online Payment)"}
                  </span>
                </div>

                <div className="border-t border-slate-200 my-4" />

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Order Total
                  </span>

                  <span className="font-bold text-slate-900">
                    ₹{formatPrice(total)}
                  </span>
                </div>

                <div className="border-t border-slate-200 my-4" />

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-green-600">
                    3–7 Business Days
                  </span>
                </div>

              </div>

              {/* DELIVERY ADDRESS */}
              <div className="mt-4 bg-slate-50 rounded-2xl p-5 text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />

                  <div>

                    <p className="font-bold text-slate-900">
                      Delivery Address
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {formData.firstName}{" "}
                      {formData.lastName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {formData.address}, {formData.city}
                    </p>

                    <p className="text-sm text-slate-500">
                      {formData.state} - {formData.pincode}
                    </p>

                    <p className="text-sm text-slate-500">
                      {formData.mobile}
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">

                <button
                  onClick={() => navigate("/myorders")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition"
                >
                  View My Orders
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-semibold transition"
                >
                  Continue Shopping
                </button>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Checkout;