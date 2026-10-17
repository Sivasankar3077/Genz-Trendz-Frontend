import React, { useEffect, useState } from "react";
import {User,Store,Bell,ShieldCheck,Mail,Lock,Save,Camera,Eye,EyeOff,Check,Loader2,X,} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {updateProfile,updatePassword,removeErrors,removeMessage,} from "../../slices/userSlice";

const AdminSettings = () => {
  const dispatch = useDispatch();

  const {user,loading,error,message} = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState("");

  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newCustomers: true,
    orderUpdates: false,
  });

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "store",
      label: "Store",
      icon: Store,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    if (user) {
      setUserData({
        username: user?.username || "",
        email: user?.email || "",
      });

      setAvatarPreview(user?.avatar?.url || "");
    }
  }, [user]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(removeMessage());
        dispatch(removeErrors());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    // 2MB validation
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!userData.username.trim() || !userData.email.trim()) {
      return;
    }
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    const fileInput = document.getElementById("avatarInput");
    if (fileInput?.files?.[0]) {
      formData.append("avatar", fileInput.files[0]);
    }
    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const {oldPassword,newPassword,confirmPassword} = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword.length < 8) {
      return;
    }

    await dispatch(updatePassword(passwordData));

    // Clear password fields after request
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationToggle = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const passwordLength = passwordData.newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
  const hasLowercase = /[a-z]/.test(passwordData.newPassword);
  const hasNumber = /[0-9]/.test(passwordData.newPassword);
  const passwordsMatch =
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  return (
    <div className="min-h-screen bg-slate-50">

          {/* HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-5 sm:px-7 lg:px-9 sticky top-0 z-30">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Settings
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your account and store preferences
          </p>
        </div>
      </header>

      {(message || error) && (
        <div className="fixed top-24 right-5 z-50 max-w-sm">
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl border ${
              error
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {error || message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                dispatch(removeMessage());
                dispatch(removeErrors());
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

          {/* CONTENT */}

      <div className="p-5 sm:p-7 lg:p-9 max-w-325 mx-auto">

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">

              {/* SETTINGS NAVIGATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 h-fit">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">

              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}

            </div>
          </div>

              {/* SETTINGS CONTENT */}
          <div className="space-y-6">

                {/* PROFILE */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile}>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-100">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Profile Information
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      Update your administrator account details
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-6">
                    {/* Profile Image */}
                    <div className="flex items-center gap-4 mb-7">
                      <div className="relative">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Profile"
                            className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black">
                            {userData.username
                              ?.charAt(0)
                              ?.toUpperCase() || "A"}
                          </div>
                        )}

                        <label
                          htmlFor="avatarInput"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          <Camera size={15} />
                        </label>

                        <input
                          id="avatarInput"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {userData.username || "Administrator"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          JPG or PNG. Maximum 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Form */}

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Username */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="username"
                          value={userData.username}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          Email Address
                        </label>

                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          Role
                        </label>

                        <div className="h-11 px-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-sm font-semibold text-slate-500">
                          <ShieldCheck size={16} />

                          {user?.role === "admin"
                            ? "Administrator"
                            : user?.role || "User"}
                        </div>
                      </div>

                      {/* Account Status */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          Account Status
                        </label>

                        <div className="h-11 px-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                          <Check size={16} />
                          Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm shadow-blue-600/20 transition"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}

                    </button>
                  </div>
                </div>
              </form>
            )}

                {/* STORE SETTINGS */}

            {activeTab === "store" && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Store Information
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Configure your Genzz Trendz store details
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">
                      Store Name
                    </label>

                    <div className="relative">

                      <Store
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        defaultValue="Genzz Trendz"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">
                      Store Description
                    </label>

                    <textarea
                      rows="4"
                      defaultValue="Trendy fashion for the modern generation."
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">
                        Currency
                      </label>

                      <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm">
                        <option>Indian Rupee (₹)</option>
                        <option>US Dollar ($)</option>
                        <option>Euro (€)</option>
                      </select>
                    </div>
                    <div>

                      <label className="block text-xs font-bold text-slate-600 mb-2">
                        Country
                      </label>

                      <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm">
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>

                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

                {/* NOTIFICATIONS */}

            {activeTab === "notifications" && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Notifications
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Choose which notifications you want to receive
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    {
                      key: "newOrders",
                      title: "New Orders",
                      description:
                        "Get notified when a new order is placed",
                    },
                    {
                      key: "lowStock",
                      title: "Low Stock Alerts",
                      description:
                        "Receive alerts when products are running low",
                    },
                    {
                      key: "newCustomers",
                      title: "New Customers",
                      description:
                        "Get notified when a new customer registers",
                    },
                    {
                      key: "orderUpdates",
                      title: "Order Updates",
                      description:
                        "Receive notifications about order status changes",
                    },
                  ].map((item) => {

                    const enabled = notifications[item.key];

                    return (
                      <div
                        key={item.key}
                        className="p-5 sm:p-6 flex items-center justify-between gap-5"
                      >

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {item.title}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleNotificationToggle(item.key)
                          }
                          className={`w-11 h-6 rounded-full shrink-0 p-1 transition ${
                            enabled
                              ? "bg-blue-600"
                              : "bg-slate-200"
                          }`}
                        >

                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition ${
                              enabled
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />

                        </button>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}

                {/* SECURITY */}

            {activeTab === "security" && (
              <form onSubmit={handleUpdatePassword}>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-slate-100">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Security
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      Keep your administrator account secure
                    </p>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="max-w-xl space-y-5">
                      {/* OLD PASSWORD */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          Current Password
                        </label>

                        <div className="relative">
                          <Lock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type={
                              showOldPassword
                                ? "text"
                                : "password"
                            }
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            className="w-full h-11 pl-10 pr-11 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowOldPassword(
                                !showOldPassword
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                          >
                            {showOldPassword ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* NEW PASSWORD */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          New Password
                        </label>

                        <div className="relative">
                          <input
                            type={
                              showNewPassword
                                ? "text"
                                : "password"
                            }
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            className="w-full h-11 px-4 pr-11 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowNewPassword(
                                !showNewPassword
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                          >
                            {showNewPassword ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* CONFIRM PASSWORD */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                          Confirm New Password
                        </label>

                        <div className="relative">
                          <input
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            name="confirmPassword"
                            value={
                              passwordData.confirmPassword
                            }
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            className="w-full h-11 px-4 pr-11 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* PASSWORD REQUIREMENTS */}

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-700">
                          Password requirements
                        </p>

                        <div className="mt-2 space-y-1.5">
                          <p
                            className={`flex items-center gap-2 text-[11px] ${
                              passwordLength
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            <Check size={13} />
                            At least 8 characters
                          </p>

                          <p
                            className={`flex items-center gap-2 text-[11px] ${
                              hasUppercase && hasLowercase
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            <Check size={13} />
                            Include uppercase and lowercase letters
                          </p>

                          <p
                            className={`flex items-center gap-2 text-[11px] ${
                              hasNumber
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            <Check size={13} />
                            Include at least one number
                          </p>

                          <p
                            className={`flex items-center gap-2 text-[11px] ${
                              passwordsMatch
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            <Check size={13} />
                            Passwords must match
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Update Password
                        </>
                      )}

                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;