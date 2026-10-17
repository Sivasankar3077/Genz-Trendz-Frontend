import { useEffect, useMemo, useState } from "react";
import {
Search,SlidersHorizontal, Eye,UserCheck,UserX, Users,ShieldCheck,UserRound,ChevronLeft,ChevronRight,XCircle,X, Mail,Phone,CalendarDays,ShoppingBag,} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersByAdmin } from "../../slices/userSlice";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const {usersLoading,error,users} = useSelector((state) => state.user);
  
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 5;


  useEffect(() => {
    dispatch(getAllUsersByAdmin());
  }, [dispatch]);


  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "Blocked") {
      return "bg-red-50 text-red-500 border-red-100";
    }

    return "bg-slate-50 text-slate-500 border-slate-200";
  };

  const getRoleStyle = (role) => {
    if (role === "Admin") {
      return "bg-blue-50 text-blue-600 border-blue-100";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = (name) => {
    if (!name) return "U";

    return String(name).charAt(0).toUpperCase();
  };

  const normalizedUsers = useMemo(() => {
    if (!Array.isArray(users)) {
      return [];
    }

    return users.map((user) => {
      const rawRole = String(user?.role || "customer").toLowerCase();

      const rawStatus = String(
        user?.status ||
          (user?.isBlocked ? "Blocked" : "Active")
      ).toLowerCase();

      return {
        ...user,
        name:user?.username ||"Unknown User",
        email : user?.email ||"No email",
        phone: user?.mobile || "+91 999999999",
        role: rawRole === "admin" ? "Admin" : "Customer",
        status: rawStatus === "blocked"? "Blocked" : "Active",
        orders: Number(user?.ordersCount ??user?.orderCount ??user?.orders?.length ?? 0),
        spent:Number(user?.totalSpent ?? user?.spent ?? 0),
      };
    });
  }, [users]);


  const filteredUsers = useMemo(() => {
    let result = [...normalizedUsers];

    // SEARCH
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((user) => {
        const name = user?.name?.toLowerCase() || "";
        const email = user?.email?.toLowerCase() || "";
        const phone = user?.phone?.toLowerCase() || "";

        return (
          name.includes(searchValue) ||
          email.includes(searchValue) ||
          phone.includes(searchValue)
        );
      });
    }

    // ROLE FILTER
    if (roleFilter !== "All Roles") {
      result = result.filter(
        (user) =>
          user?.role === roleFilter
      );
    }

    // STATUS FILTER
    if (statusFilter !== "All Status") {
      result = result.filter(
        (user) =>
          user?.status === statusFilter
      );
    }

    return result;
  }, [
    normalizedUsers,
    search,
    roleFilter,
    statusFilter,
  ]);


  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    roleFilter,
    statusFilter,
  ]);

  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalUsers =
    normalizedUsers.length;

  const activeUsers =
    normalizedUsers.filter(
      (user) =>
        user?.status === "Active"
    ).length;

  const blockedUsers =
    normalizedUsers.filter(
      (user) =>
        user?.status === "Blocked"
    ).length;

  const adminUsers =
    normalizedUsers.filter(
      (user) =>
        user?.role === "Admin"
    ).length;


  const startIndex =(currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex,endIndex);
  const pageNumbers = Array.from({ length: totalPages },(_, index) => index + 1);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (prev) => prev - 1
      );
    }
  };

  const handleNext = () => {
    if (
      currentPage < totalPages
    ) {
      setCurrentPage(
        (prev) => prev + 1
      );
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };


  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleRetry = () => {
    dispatch(getAllUsersByAdmin());
  };


  return (
    <div className="min-h-screen bg-slate-50">

          {/* HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-7 lg:px-9 sticky top-0 z-30">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Customers
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage customers and admin accounts
          </p>
        </div>
      </header>

          {/* CONTENT */}

      <div className="p-5 sm:p-7 lg:p-9 max-w-[1600px] mx-auto">
            {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* TOTAL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Total Users
                </p>

                <p className="text-2xl font-black text-slate-900 mt-2">
                  {totalUsers}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={19} />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold mt-3">
              Registered accounts
            </p>
          </div>

          {/* ACTIVE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Active Users
                </p>

                <p className="text-2xl font-black text-slate-900 mt-2">
                  {activeUsers}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck size={19} />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-3">
              {totalUsers > 0
                ? `${(
                    (activeUsers /
                      totalUsers) *
                    100
                  ).toFixed(1)}% of total users`
                : "0% of total users"}

            </p>
          </div>

          {/* BLOCKED */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Blocked
                </p>

                <p className="text-2xl font-black text-slate-900 mt-2">
                  {blockedUsers}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <UserX size={19} />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-3">
              Blocked accounts
            </p>

          </div>
          {/* ADMINS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Admins
                </p>

                <p className="text-2xl font-black text-slate-900 mt-2">
                  {adminUsers}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-3">
              Admin accounts
            </p>
          </div>
        </div>

            {/* USER MANAGEMENT */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {/* TOOLBAR */}

          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full lg:w-96">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search name, email or phone..."
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {/* FILTERS */}
              <div className="grid grid-cols-3 sm:flex gap-2">
                {/* RESET */}
                <button
                  type="button"
                  onClick={
                    handleResetFilters
                  }
                  className="flex items-center justify-center gap-2 h-11 px-3 sm:px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >

                  <SlidersHorizontal
                    size={16}
                  />

                  <span className="hidden sm:inline">
                    Reset
                  </span>
                </button>

                {/* ROLE */}
                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(
                      e.target.value
                    )
                  }
                  className="h-11 px-2 sm:px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 outline-none bg-white cursor-pointer"
                >

                  <option value="All Roles">
                    All Roles
                  </option>

                  <option value="Customer">
                    Customer
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>

                {/* STATUS */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="h-11 px-2 sm:px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 outline-none bg-white cursor-pointer"
                >

                  <option value="All Status">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Blocked">
                    Blocked
                  </option>
                </select>
              </div>
            </div>
          </div>

              {/* LOADING */}

          {usersLoading  && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 mt-4">
                Loading users...
              </p>
            </div>
          )}

              {/* ERROR */}

          {!usersLoading  && error && (

            <div className="flex flex-col items-center justify-center py-20 px-5">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <XCircle size={24} />
              </div>

              <p className="text-sm font-bold text-red-500 mt-4">
                Failed to load users
              </p>

              <p className="text-xs text-slate-400 mt-1 text-center">
                {typeof error === "string"
                  ? error
                  : error?.message ||
                    error?.msg ||
                    "Something went wrong"}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 px-4 h-9 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

              {/* EMPTY */}

          {!usersLoading  &&
            !error &&
            currentUsers.length === 0 && (

              <div className="flex flex-col items-center justify-center py-20 px-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Users size={28} />
                </div>

                <p className="text-sm font-bold text-slate-700 mt-4">
                  No users found
                </p>

                <p className="text-xs text-slate-400 mt-1 text-center">
                  Try another search or filter.
                </p>

                {(search ||
                  roleFilter !==
                    "All Roles" ||
                  statusFilter !==
                    "All Status") && (

                  <button
                    type="button"
                    onClick={
                      handleResetFilters
                    }
                    className="mt-4 px-4 h-9 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

              {/* DESKTOP TABLE */}
          {!usersLoading  &&
            !error &&
            currentUsers.length > 0 && (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-262.5">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100">

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Customer
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Phone
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Role
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Orders
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Total Spent
                      </th>

                      <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Joined
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
                    {currentUsers.map(
                      (user) => (

                        <tr
                          key={
                            user?._id ||
                            user?.id
                          }
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition"
                        >

                          {/* CUSTOMER */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">

                                {getInitial(
                                  user?.name
                                )}

                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-700">
                                  {user?.name}
                                </p>

                                <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* PHONE */}

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {user?.phone}
                          </td>

                          {/* ROLE */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold ${getRoleStyle(
                                user?.role
                              )}`}
                            >

                              {user?.role ===
                              "Admin" ? (
                                <ShieldCheck
                                  size={12}
                                />
                              ) : (
                                <UserRound
                                  size={12}
                                />
                              )}

                              {user?.role}
                            </span>
                          </td>

                          {/* ORDERS */}

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {user?.orders}
                            </p>
                          </td>

                          {/* SPENT */}

                          <td className="px-5 py-4">
                            <p className="text-sm font-black text-slate-900">
                              ₹
                              {Number(
                                user?.spent ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </td>

                          {/* JOINED */}

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {formatDate(
                              user?.createdAt
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1.5 rounded-full border text-[10px] font-bold ${getStatusStyle(
                                user?.status
                              )}`}
                            >
                              {user?.status}
                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end">

                              <button
                                type="button"
                                title="View User"
                                onClick={() =>
                                  handleViewUser(
                                    user
                                  )
                                }
                                className="w-9 h-9 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition"
                              >
                                <Eye
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}

                  </tbody>
                </table>
              </div>
            )}

              {/* MOBILE CARDS */}
          {!usersLoading  &&
            !error &&
            currentUsers.length > 0 && (

              <div className="md:hidden divide-y divide-slate-100">
                {currentUsers.map(
                  (user) => (

                    <div
                      key={
                        user?._id ||
                        user?.id
                      }
                      className="p-4"
                    >

                      {/* USER */}
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0">
                          {getInitial(
                            user?.name
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">
                                {user?.name}
                              </p>

                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {user?.email}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 px-2 py-1 rounded-full border text-[9px] font-bold ${getStatusStyle(
                                user?.status
                              )}`}
                            >
                              {user?.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                        {/* ROLE */}

                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            Role
                          </p>

                          <span
                            className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full border text-[9px] font-bold ${getRoleStyle(
                              user?.role
                            )}`}
                          >

                            {user?.role ===
                            "Admin" ? (
                              <ShieldCheck
                                size={10}
                              />
                            ) : (
                              <UserRound
                                size={10}
                              />
                            )}

                            {user?.role}
                          </span>
                        </div>

                        {/* PHONE */}
                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            Phone
                          </p>

                          <p className="text-xs font-semibold text-slate-600 mt-1">
                            {user?.phone}
                          </p>
                        </div>

                        {/* ORDERS */}

                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            Orders
                          </p>

                          <p className="text-sm font-black text-slate-800 mt-1">
                            {user?.orders}
                          </p>
                        </div>

                        {/* SPENT */}
                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            Total Spent
                          </p>

                          <p className="text-sm font-black text-slate-800 mt-1">
                            ₹
                            {Number(
                              user?.spent ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* VIEW */}
                      <button
                        type="button"
                        onClick={() =>
                          handleViewUser(
                            user
                          )
                        }
                        className="w-full mt-4 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Eye size={15} />
                        View Customer
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

              {/* PAGINATION */}

          {!usersLoading  &&
            !error &&
            filteredUsers.length > 0 && (

              <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* SHOWING */}
                <p className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-bold text-slate-600">

                    {startIndex + 1}–
                    {Math.min(
                      endIndex,
                      filteredUsers.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-600">
                    {filteredUsers.length}
                  </span>{" "}
                  users
                </p>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {/* PREVIOUS */}
                    <button
                      type="button"
                      onClick={
                        handlePrevious
                      }
                      disabled={
                        currentPage === 1
                      }
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                        currentPage === 1
                          ? "border-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >

                      <ChevronLeft
                        size={16}
                      />

                    </button>

                    {/* PAGE NUMBERS */}

                    {pageNumbers.map(
                      (page) => (

                        <button
                          key={page}
                          type="button"
                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                            currentPage ===
                            page
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>

                      )
                    )}

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                        currentPage ===
                        totalPages
                          ? "border-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >

                      <ChevronRight
                        size={16}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

          {/* VIEW USER MODAL */}
      {selectedUser && (

        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >

          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">
                  User Details
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Customer account information
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* PROFILE */}
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                  {getInitial(
                    selectedUser?.name
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-black text-slate-900 truncate">
                    {selectedUser?.name}
                  </h2>

                  <p className="text-xs text-slate-400 truncate">
                    {selectedUser?.email}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full border text-[9px] font-bold ${getRoleStyle(
                        selectedUser?.role
                      )}`}
                    >
                      {selectedUser?.role}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full border text-[9px] font-bold ${getStatusStyle(
                        selectedUser?.status
                      )}`}
                    >
                      {selectedUser?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* DETAILS */}

              <div className="mt-6 space-y-3">
                {/* EMAIL */}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-500">
                    <Mail size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      Email
                    </p>

                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {selectedUser?.email}
                    </p>

                  </div>
                </div>

                {/* PHONE */}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-500">
                    <Phone size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      Phone
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                      {selectedUser?.phone}
                    </p>
                  </div>
                </div>

                {/* JOINED */}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-500">
                    <CalendarDays size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      Joined
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                      {formatDate(
                        selectedUser?.createdAt
                      )}
                    </p>
                  </div>
                </div>

                {/* ORDERS */}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-500">
                    <ShoppingBag size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      Total Orders
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                      {selectedUser?.orders}
                    </p>
                  </div>
                </div>
              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="w-full mt-5 h-11 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;