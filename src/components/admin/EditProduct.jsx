import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    Save,
    Loader2,
    ImagePlus,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
    getProductDetails,
    updateProductByAdmin,
    removeErrors,
    removeMessage,
} from "../../slices/productSlice";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileInputRef = useRef(null);

    const {
        product,
        loading,
        error,
        message,
    } = useSelector((state) => state.product);


    const [formData, setFormData] = useState({
        name: "",
        price: "",
        mrp: "",
        stock: "",
        category: "",
        description: "",
    });


    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");


    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
    }, [dispatch, id]); 

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                price: product.price ?? "",
                mrp: product.mrp ?? "",
                stock: product.stock ?? "",
                category: product.category || "",
                description: product.description || "",
            });

            // Existing image
            const existingImage =
                product?.image?.url ||
                "";

            setImagePreview(existingImage);
        }
    }, [product]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // File type validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // File size validation - 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setImage(file);

        // Preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };


    const removeSelectedImage = () => {
        setImage(null);

        // Go back to existing product image
        const existingImage =
            product?.image?.url ||
            "";

        setImagePreview(existingImage);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Product name is required");
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            toast.error("Enter a valid selling price");
            return;
        }

        if (
            formData.mrp === "" ||
            Number(formData.mrp) < 0
        ) {
            toast.error("Enter a valid MRP");
            return;
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {
            toast.error("Enter a valid stock");
            return;
        }

        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Product description is required");
            return;
        }

        const productData = new FormData();

        productData.append(
            "name",
            formData.name.trim()
        );

        productData.append(
            "price",
            Number(formData.price)
        );

        productData.append(
            "mrp",
            Number(formData.mrp)
        );

        productData.append(
            "stock",
            Number(formData.stock)
        );

        productData.append(
            "category",
            formData.category
        );

        productData.append(
            "description",
            formData.description.trim()
        );

        // Only send image if user selected a new one
        if (image) {
            productData.append("productImage", image);
        }

        dispatch(
            updateProductByAdmin({
                id,
                productData,
            })
        );
    };

    useEffect(() => {
        if (message) {
            toast.success(message);

            dispatch(removeMessage());

            setTimeout(() => {
                navigate("/admin/products");
            }, 500);
        }

        if (error) {
            toast.error(error);

            dispatch(removeErrors());
        }
    }, [
        message,
        error,
        dispatch,
        navigate,
    ]);

    // LOADING
    if (loading && !product) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">

                    <Loader2
                        className="w-8 h-8 animate-spin text-blue-600"
                    />

                    <p className="text-sm text-slate-500">
                        Loading product...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* ==============================
                HEADER
            ============================== */}
            <div className="max-w-6xl mx-auto mb-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition mb-5"
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </button>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                        Admin Panel
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Edit Product
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Update your product information and image.
                    </p>
                </div>

            </div>

            {/* ==============================
                MAIN
            ============================== */}
            <div className="max-w-6xl mx-auto">

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* ==============================
                            LEFT SIDE
                        ============================== */}
                        <div className="lg:col-span-2">

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                                {/* FORM HEADER */}
                                <div className="px-6 py-5 border-b border-slate-100">

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Product Information
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Change the details of your product.
                                    </p>

                                </div>

                                {/* FORM BODY */}
                                <div className="p-6 space-y-6">

                                    {/* PRODUCT NAME */}
                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Product Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter product name"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                    </div>

                                    {/* CATEGORY */}
                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        >
                                            <option value="">
                                                Select Category
                                            </option>

                                            <option value="Men">
                                                Men
                                            </option>

                                            <option value="Women">
                                                Women
                                            </option>

                                            <option value="Kids">
                                                Kids
                                            </option>

                                            <option value="Electronics">
                                                Electronics
                                            </option>

                                            <option value="Fashion">
                                                Fashion
                                            </option>

                                            <option value="Footwear">
                                                Footwear
                                            </option>

                                            <option value="Accessories">
                                                Accessories
                                            </option>

                                        </select>

                                    </div>

                                    {/* PRICE + MRP */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                        {/* PRICE */}
                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Selling Price
                                            </label>

                                            <div className="relative">

                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder="0"
                                                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                                />

                                            </div>

                                        </div>

                                        {/* MRP */}
                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                MRP
                                            </label>

                                            <div className="relative">

                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    name="mrp"
                                                    value={formData.mrp}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder="0"
                                                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                                />

                                            </div>

                                        </div>

                                    </div>

                                    {/* STOCK */}
                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="Enter stock quantity"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="6"
                                            placeholder="Enter product description..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                    </div>

                                </div>

                                {/* FOOTER */}
                                <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/admin/products")
                                        }
                                        className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
                                    >

                                        {loading ? (
                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />

                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />

                                                Update Product
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* ==============================
                            RIGHT SIDE
                        ============================== */}
                        <div className="space-y-6">

                            {/* ==============================
                                IMAGE UPLOAD
                            ============================== */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                                <div className="mb-4">

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Product Image
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Upload a new image if you want to
                                        replace the current one.
                                    </p>

                                </div>

                                {/* IMAGE PREVIEW */}
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">

                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={formData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">

                                            <ImagePlus
                                                size={42}
                                                strokeWidth={1.5}
                                            />

                                            <p className="text-sm mt-2">
                                                No image available
                                            </p>

                                        </div>
                                    )}

                                    {/* REMOVE NEW IMAGE */}
                                    {image && (
                                        <button
                                            type="button"
                                            onClick={removeSelectedImage}
                                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
                                            title="Remove selected image"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}

                                </div>

                                {/* IMAGE INPUT */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-400 transition"
                                >
                                    <ImagePlus size={19} />

                                    {image
                                        ? "Change Image"
                                        : "Choose New Image"}
                                </button>

                                <p className="text-xs text-slate-400 text-center mt-3">
                                    JPG, JPEG, PNG • Maximum 5MB
                                </p>

                            </div>

                            {/* ==============================
                                EDITING PRODUCT
                            ============================== */}
                            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-sm">

                                <p className="text-xs uppercase tracking-wider font-bold text-blue-100">
                                    Editing Product
                                </p>

                                <h3 className="text-xl font-bold mt-2 break-words">
                                    {formData.name || "Product"}
                                </h3>

                                <p className="text-sm text-blue-100 mt-3 leading-6">
                                    Update the product details and optionally
                                    replace the existing image.
                                </p>

                            </div>

                            {/* ==============================
                                CURRENT DETAILS
                            ============================== */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                                <h3 className="font-bold text-slate-900 mb-5">
                                    Current Details
                                </h3>

                                <div className="space-y-4">

                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-slate-500">
                                            Category
                                        </span>

                                        <span className="text-sm font-semibold text-slate-900">
                                            {formData.category || "-"}
                                        </span>
                                    </div>

                                    <div className="h-px bg-slate-100" />

                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-slate-500">
                                            Selling Price
                                        </span>

                                        <span className="text-sm font-semibold text-slate-900">
                                            ₹{formData.price || 0}
                                        </span>
                                    </div>

                                    <div className="h-px bg-slate-100" />

                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-slate-500">
                                            MRP
                                        </span>

                                        <span className="text-sm font-semibold text-slate-900">
                                            ₹{formData.mrp || 0}
                                        </span>
                                    </div>

                                    <div className="h-px bg-slate-100" />

                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-slate-500">
                                            Stock
                                        </span>

                                        <span className="text-sm font-semibold text-slate-900">
                                            {formData.stock || 0}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditProduct;