import React, { useEffect, useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addtoCart, removeCartItem } from '../slices/cartSlice'
const CartItem = ({ item }) => {

    const product = item
    const dispatch = useDispatch()


    const handleIncreaseQuantity = ()=>{
        if(product.quantity > product.stock){
            toast.error("Quantity cannot be greater than stock" , {position : 'top-center' , duration : 2000})
            return;
        }
        dispatch(addtoCart({id:product.product , quantity : 1 , isCartPage : true}))
        
    }

    const handleDecreaseQuantity = ()=>{
        if(product.quantity == 1){
            toast.error("Quantity cannot be lesser than 1" , {position : 'top-center' , duration : 2000})
            return;
        }
        dispatch(addtoCart({id:product.product , quantity : -1 , isCartPage : true}))
    }

    const handleRemoveCartItem = (id)=>{
        dispatch(removeCartItem(id))
    }

    return (
        <div className='bg-white hover:bg-slate-50/50 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-100 transition-all duration-200'>

            {/* Product Info */}
            <div className='flex items-center gap-4 w-full sm:w-auto'>
                <Link to={`/products/${product.product}`} className='relative overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-sm shrink-0'>
                    <img
                        src={product?.image}
                        alt={product?.name}
                        className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover'
                    />
                </Link>

                <Link to={`/products/${product.product}`} className='flex flex-col justify-center min-w-0'>
                    <p className='font-semibold text-slate-800 text-sm sm:text-base line-clamp-1'>
                        {product?.name}
                    </p>
                    <p className='text-xs text-slate-400 font-medium mt-0.5'>
                        {product?.category}
                    </p>
                    <p className='text-blue-600 font-bold text-sm sm:text-base mt-1 sm:mt-2'>
                        ₹{product?.price}
                    </p>
                </Link>
            </div>


            {/* Quantity */}
            <div className='flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-dashed border-slate-100 sm:border-0 shrink-0'>
                <div className='flex items-center gap-2 bg-slate-100/80 border border-slate-200/40 px-2 py-1 rounded-full shadow-inner'>
                    <button onClick = {handleDecreaseQuantity} className='bg-white text-slate-600 p-1 rounded-full shadow-sm hover:text-blue-600 active:scale-95 transition-all cursor-pointer border border-slate-100'>
                        <Minus size={14} />
                    </button>
                    <span className='font-bold text-slate-700 text-xs sm:text-sm w-5 text-center'>
                        {product?.quantity || 1}
                    </span>
                    <button onClick={handleIncreaseQuantity} className='bg-white text-slate-600 p-1 rounded-full shadow-sm hover:text-blue-600 active:scale-95 transition-all cursor-pointer border border-slate-100'>
                        <Plus size={14} />
                    </button>
                </div>

                <button onClick={()=>handleRemoveCartItem(product?.product)} className='text-slate-400 cursor-pointer hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl'>
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}

export default CartItem