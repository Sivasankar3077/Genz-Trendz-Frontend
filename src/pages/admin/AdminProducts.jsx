import React, { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Edit3,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import { getProducts, removeErrors , deleteProductByAdmin, removeMessage } from "../../slices/productSlice";
import {toast} from 'react-hot-toast'
import { useEffect } from "react";
import Loader from '../../components/Loader'

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [category , setCategory ] = useState('All')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {loading , message , error , products  , productCount , currentPage ,resultPerPage , totalPages} = useSelector(state => state.product)

  useEffect(()=>{
    dispatch(getProducts({
      search : searchQuery,
      page : page,
      category : category
    }))
  } , [dispatch , searchQuery , page , category])

  useEffect(()=>{
    if(error){
      toast.error(error , {position : 'top-center' , duration : 2000})
      dispatch(removeErrors())
    }
    if(message){
      toast.success(message , {position : 'top-center' , duration : 2000})
      dispatch(removeMessage())
    }
  } , [dispatch , error , message])

  const getStockStyle = (status) => {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }

    if (status === "Low Stock") {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }

    return "bg-red-50 text-red-500 border-red-100";
  };

  //count stock 
  const stockCount = products.reduce((acc , product) => acc + product.stock , 0);

  //low stock
  const lowStock = products.filter(product=> product.stock <=5 ).length;

  //outofstock
  const outOFStock = products.filter(product => product.stock === 0).length;

  //pagination 
  const paginationCount = Array.from({length:totalPages} , (_,i)=> i+1)
  if(loading){
    return <><Loader/></>
  }

  return (
    <div className="min-h-screen bg-slate-50">
          {/* HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-7 lg:px-9 sticky top-0 z-30">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Products
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your store products and inventory
          </p>
        </div>

        <Link to={'/admin/products/new'} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-blue-600/20 transition">
          <Plus size={18} />
          <span className="hidden sm:inline">
            Add Product
          </span>
        </Link>

      </header>

      {/* CONTENT*/}
      <div className="p-5 sm:p-7 lg:p-9 max-w-[1600px] mx-auto">
        {/* SUMMARY CARD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Products
            </p>

            <p className="text-2xl font-black text-slate-900 mt-2">
              {productCount}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Stock
            </p>

            <p className="text-2xl font-black text-emerald-600 mt-2">
              {stockCount}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Low Stock
            </p>

            <p className="text-2xl font-black text-amber-500 mt-2">
              {lowStock}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Out of Stock
            </p>

            <p className="text-2xl font-black text-red-500 mt-2">
              {outOFStock}
            </p>
          </div>
        </div>


        {/* PRODUCT TABLE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-80 flex gap-2">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 flex-1"
                />

                <button
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-8 font-medium rounded-lg"

                  onClick={()=>{
                    setSearchQuery(search)
                    setPage(1)
                  }}
                >search</button>

              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select className="h-11 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 outline-none bg-white"
                  onChange={(e)=>setCategory(e.target.value)}
                >
                  <option>All</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                </select>
              </div>
            </div>
          </div>


              {/* DESKTOP TABLE */}

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">

                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Product
                  </th>

                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Category
                  </th>

                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Price
                  </th>

                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Stock
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
                {products?.map((product) => (
                  <tr
                    key={product?._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <img
                          src={product?.image?.url}
                          alt={product?.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                        />

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {product?.name}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-1">
                            ID #{product?._id}
                          </p>
                        </div>
                      </div>
                    </td>


                    {/* Category */}
                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                      {product?.category}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-sm font-black text-slate-900">
                      ₹{product?.price.toLocaleString("en-IN")}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                      {product?.stock}
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStockStyle(
                          product?.status
                        )}`}
                      >
                        {product?.status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">

                        <button className="w-9 h-9 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition"
                        onClick={()=>navigate(`/admin/edit/product/${product?._id}`)}
                        >
                          <Edit3 size={16} />
                        </button>

                        <button className="w-9 h-9 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition"

                        onClick={()=> dispatch(deleteProductByAdmin({ id : product._id}))}
                        >
                          <Trash2 size={16} />
                        </button>

                        <button className="w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition">
                          <MoreHorizontal size={17} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


              {/* MOBILE PRODUCT CARDS */}

          <div className="md:hidden divide-y divide-slate-100">
            {products?.map((product) => (

              <div
                key={product?._id}
                className="p-4"
              >

                <div className="flex gap-3">

                  <img
                    src={product?.image?.url}
                    alt={product?.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 truncate">
                          {product?.name}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1">
                          {product?.category}
                        </p>
                      </div>

                      <button className="text-slate-400 shrink-0">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>


                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-black text-blue-600">
                        ₹{product?.price.toLocaleString("en-IN")}
                      </p>

                      <span
                        className={`px-2 py-1 rounded-full border text-[9px] font-bold ${getStockStyle(
                          product?.status
                        )}`}
                      >
                        {product?.status}
                      </span>
                    </div>
                  </div>
                </div>


                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Stock:{" "}
                    <span className="font-bold text-slate-700">
                      {product?.stock}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"
                    
                    onClick={()=>navigate(`/admin/edit/product/${product?._id}`)}>
                      <Edit3 size={14} />
                    </button>

                    <button onClick={()=> dispatch(deleteProductByAdmin({id:product?._id}))} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>


              {/* PAGINATION */}
          <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">
                {totalPages}
              </span>{" "}
              Pages
            </p>

            <div className="flex items-center gap-1">

              <button
              disabled = {page === 1}
              className="w-9 h-9 cursor-pointer rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
              
              onClick={()=>setPage(prev => prev - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              {paginationCount.map((pageNumber)=>(
                  <button key={pageNumber} 
                  
                  className={`w-9 h-9 rounded-lg border text-xs font-semibold cursor-pointer ${
                    page === pageNumber
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                  
                  onClick={()=>setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
              ))}

              <button
              className="w-9 h-9 cursor-pointer rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
              disabled = {page == totalPages}
              onClick={()=> setPage(prev => prev + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;