import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import { createProductByAdmin, removeErrors, removeMessage } from "../../slices/productSlice";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ImagePlus,
  X,
  Package,
  IndianRupee,
  Save,
} from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {loading , error , message , product} = useSelector(state => state.product)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    stock: "",
    category: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = new FormData()

    productData.append("name", formData.name);
    productData.append("price", formData.price);
    productData.append("mrp", formData.mrp);
    productData.append("stock", formData.stock);
    productData.append("category", formData.category);
    productData.append("description", formData.description);

    if (image) {
        productData.append("productImage", image);
    }

    dispatch(createProductByAdmin(productData))
  };


  useEffect(()=>{
    if(error){
        toast.error(error , {position:'top-center' , duration:2000})
        dispatch(removeErrors())
    }
    if(message){
        toast.success(message , {position:'top-center' , duration:2000})
        setFormData({name : '' , price : '' , stock : '' , category:'' , description : '' , mrp:''})
        removeImage()
        dispatch(removeMessage())
    }
  } , [message, error , dispatch])


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-5 sm:px-7 lg:px-9 h-20 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="w-10 h-10 rounded-xl border border-slate-200
              flex items-center justify-center text-slate-600
              hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Add Product
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Create a new product for your store
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="hidden sm:flex items-center gap-2 bg-blue-600
            text-white px-5 py-2.5 rounded-xl font-semibold
            hover:bg-blue-700 transition shadow-sm"
          >
            { loading ? "Saving..." : <><Save size={18} />
            Save Product</>}
          </button>

        </div>
      </header>


      {/* Main */}
      <main className="p-5 sm:p-7 lg:p-9 max-w-300 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT - Product Information */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic Information */}
              <div className="bg-white rounded-2xl border border-slate-200
              shadow-sm p-5 sm:p-6">

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50
                  flex items-center justify-center text-blue-600">
                    <Package size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Basic Information
                    </h2>

                    <p className="text-xs text-slate-400">
                      Enter product details
                    </p>
                  </div>
                </div>


                {/* Product Name */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold
                  text-slate-700 mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Eg. Oversized Cotton T-Shirt"
                    className="w-full px-4 py-3 rounded-xl border
                    border-slate-200 outline-none text-sm
                    focus:border-blue-500 focus:ring-4
                    focus:ring-blue-500/10 transition"
                    required
                  />
                </div>


                {/* Category */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold
                  text-slate-700 mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border
                    border-slate-200 outline-none text-sm bg-white
                    focus:border-blue-500 focus:ring-4
                    focus:ring-blue-500/10 transition"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>


                {/* Price + MRP + Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold
                    text-slate-700 mb-2">
                      Selling Price
                    </label>

                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="absolute left-3 top-1/2
                        -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="999"
                        min="0"
                        className="w-full pl-9 pr-3 py-3 rounded-xl
                        border border-slate-200 outline-none text-sm
                        focus:border-blue-500 focus:ring-4
                        focus:ring-blue-500/10 transition"
                        required
                      />
                    </div>
                  </div>


                  {/* MRP */}
                  <div>
                    <label className="block text-sm font-semibold
                    text-slate-700 mb-2">
                      MRP
                    </label>

                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="absolute left-3 top-1/2
                        -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleChange}
                        placeholder="1499"
                        min="0"
                        className="w-full pl-9 pr-3 py-3 rounded-xl
                        border border-slate-200 outline-none text-sm
                        focus:border-blue-500 focus:ring-4
                        focus:ring-blue-500/10 transition"
                        required
                      />
                    </div>
                  </div>


                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold
                    text-slate-700 mb-2">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="50"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl
                      border border-slate-200 outline-none text-sm
                      focus:border-blue-500 focus:ring-4
                      focus:ring-blue-500/10 transition"
                      required
                    />
                  </div>

                </div>

              </div>


              {/* Description */}
              <div className="bg-white rounded-2xl border
              border-slate-200 shadow-sm p-5 sm:p-6">

                <h2 className="font-bold text-slate-900 mb-1">
                  Product Description
                </h2>

                <p className="text-xs text-slate-400 mb-5">
                  Describe your product clearly
                </p>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Write a detailed description of your product..."
                  className="w-full px-4 py-3 rounded-xl border
                  border-slate-200 outline-none text-sm resize-none
                  focus:border-blue-500 focus:ring-4
                  focus:ring-blue-500/10 transition"
                  required
                />

              </div>


              {/* Mobile Save Button */}
              <button
                type="submit"
                className="sm:hidden w-full flex items-center
                justify-center gap-2 bg-blue-600 text-white
                px-5 py-3.5 rounded-xl font-semibold
                hover:bg-blue-700 transition shadow-sm"
              >
                <Save size={18} />
                Save Product
              </button>

            </div>


            {/* RIGHT - Images */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border
              border-slate-200 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Product Images
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      Upload product images
                    </p>
                  </div>

                  <ImagePlus
                    size={20}
                    className="text-blue-600"
                  />
                </div>


                {/* Upload Box */}
                <label
                  className="border-2 border-dashed
                  border-slate-200 rounded-2xl min-h-45
                  flex flex-col items-center justify-center
                  cursor-pointer hover:border-blue-400
                  hover:bg-blue-50/30 transition"
                >

                  <div className="w-12 h-12 rounded-xl bg-blue-50
                  flex items-center justify-center text-blue-600 mb-3">
                    <ImagePlus size={23} />
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Click to upload
                  </p>

                  <p className="text-xs text-slate-400 mt-1 text-center">
                    PNG, JPG or WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    name="productImage"
                  />

                </label>


                {/* Preview */}
                {image && (
                    <div className="mt-4">
                        <div
                        className="relative aspect-square rounded-xl
                        overflow-hidden border border-slate-200"
                        >
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Product preview"
                                className="w-full h-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 w-8 h-8
                                rounded-full bg-white/90 shadow
                                flex items-center justify-center
                                text-red-500 hover:bg-red-50 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

              </div>


              {/* Product Preview Info */}
              <div className="bg-blue-600 rounded-2xl p-5 text-white">

                <p className="text-xs uppercase tracking-wider
                font-bold text-blue-100">
                  Product Setup
                </p>

                <h3 className="text-lg font-bold mt-2">
                  Almost there!
                </h3>

                <p className="text-sm text-blue-100 mt-2 leading-6">
                  Add product details, pricing, stock and images
                  before publishing it to your store.
                </p>

              </div>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
};

export default AddProduct;