import React, { useState } from "react";
import { NavLink, Outlet  ,  useNavigate } from "react-router-dom";
import {LayoutDashboard,Package,ShoppingCart,Users,Settings,Menu,X,Store,LogOut,ChevronLeft,ChevronRight} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logoutUser } from "../slices/userSlice";

const AdminLayout = () => {
  const { user, loading } = useSelector((state) => state.user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();


  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];
  const navigate = useNavigate()
  const handleLogout = async() => {
    dispatch(logoutUser());
    navigate("/login")
  };

  return (
    <div className="min-h-screen bg-slate-50">
          {/* MOBILE TOP BAR */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Store size={19} className="text-white" />
          </div>

          <div>
            <h1 className="text-sm font-black text-slate-900">
              Genzz <span className="text-blue-600">Trendz</span>
            </h1>

            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <Menu size={22} />
        </button>
      </header>


          {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        />
      )}


          {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0
          bg-white border-r border-slate-200
          z-50
          flex flex-col
          transition-all duration-300

          ${collapsed ? "w-20" : "w-64"}

          lg:translate-x-0

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

            {/* LOGO */}
        <div
          className={`
            h-20 border-b border-slate-100
            flex items-center
            ${collapsed ? "justify-center" : "px-5"}
          `}
        >

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Store size={21} className="text-white" />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  Genzz <span className="text-blue-600">Trendz</span>
                </h1>

                <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
        </div>


            {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">

          {!collapsed && (
            <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.18em] font-bold text-slate-400">
              Main Menu
            </p>
          )}

          <div className="space-y-1.5">
            {navItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.name : ""}
                  className={({ isActive }) =>
                    `
                    group
                    flex items-center
                    ${collapsed ? "justify-center" : "gap-3"}
                    px-3 py-3
                    rounded-xl
                    text-sm font-semibold
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }
                    `
                  }
                >
                  <Icon size={19} className="shrink-0" />
                  {!collapsed && (
                    <span>{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>


            {/* COLLAPSE BUTTON — DESKTOP */}
        <div className="hidden lg:block px-3 pb-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full h-10 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center transition"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs font-semibold ml-2">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>


            {/* LOGOUT */}
        <div className="p-3 border-t border-slate-100">
          <div
            className={`
              flex items-center
              ${collapsed ? "justify-center" : "justify-between"}
              gap-3
              p-2
              rounded-xl
              bg-slate-50
            `}
          >

            {!collapsed && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  <img src={user?.avatar?.url} alt="" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user?.username}
                  </p>

                  <p className="text-[10px] text-slate-400 truncate">
                    Administrator
                  </p>
                </div>
              </div>
            )}

            <button
              title="Logout"
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition shrink-0"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>


          {/* MAIN CONTENT */}
      <main
        className={`
          min-h-screen
          pt-16 lg:pt-0
          transition-all duration-300

          ${collapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;