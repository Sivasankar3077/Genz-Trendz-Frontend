import React, { useEffect } from 'react'
import Pagetitle from '../components/Pagetitle'
import Navbar from '../components/Navbar'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCartItems, removeError, removeMessage } from '../slices/cartSlice'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'

const Cart = () => {

    const {
        loading,
        error,
        message,
        cartItems
    } = useSelector(state => state.cart)
    console.log(cartItems)

    const dispatch = useDispatch()


    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-center',
                duration: 3000
            })
            dispatch(removeError())
        }

        if (message) {
            toast.success(message, {
                position: 'top-center',
                duration: 3000
            })
            dispatch(removeMessage())
        }
    }, [dispatch, error, message])

    // Loading
    if (loading) {
        return (
            <>
                <Pagetitle title="Cart" />
                <Navbar />
                <Loader />
            </>
        )
    }

    // Error
    if (error) {
        return (
            <>
                <Pagetitle title="Cart" />
                <Navbar />

                <div className='min-h-[60vh] flex items-center justify-center px-4'>
                    <div className='text-center'>
                        <h2 className='text-xl font-bold text-red-500'>
                            Something went wrong
                        </h2>

                        <p className='text-sm text-slate-500 mt-2'>
                            {error}
                        </p>
                    </div>
                </div>
            </>
        )
    }

    const subtotal = cartItems.reduce((acc,item) => acc + (item.price * item.quantity) ,0)
    const shipping = cartItems.length > 0 ? subtotal > 500 ? 0 : 100 : 0;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax; 

    return (
        <div className='min-h-screen bg-slate-50/50 pb-12'>
            <Pagetitle title="Cart" />
            <Navbar />

            <div className='max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 sm:mt-10 items-start'>

                <div className='lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full'>
                    <div className='p-4 sm:p-6'>
                        <div className='flex justify-between items-center pb-4 border-b border-slate-100 mb-6'>
                            <div>
                                <h3 className='text-slate-800 font-bold text-lg sm:text-xl'>
                                    Your Cart
                                </h3>

                                <p className='text-xs text-slate-400 font-medium mt-0.5'>
                                    You have {cartItems?.length || 0} items in your cart
                                </p>
                            </div>

                            {cartItems?.length > 0 && (
                                <button onClick={()=>dispatch(clearCartItems())} className='text-slate-400 cursor-pointer hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl'>
                                    <Trash2 size={19} />
                                </button>
                            )}

                        </div>

                        {cartItems?.length === 0 ? (
                            <div className='py-16 text-center'>
                                <div className='text-5xl mb-4'>
                                    🛒
                                </div>

                                <h3 className='text-lg font-bold text-slate-800'>
                                    Your cart is empty
                                </h3>

                                <p className='text-sm text-slate-400 mt-2'>
                                    Add some products to your cart.
                                </p>
                            </div>

                        ) : (

                            <div className='flex flex-col gap-4'>
                                {cartItems.map((item, index) => (
                                    <CartItem
                                        key={item?._id || index}
                                        item={item}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 w-full md:col-span-1 lg:sticky lg:top-24'>
                    <div className='pb-4 border-b border-slate-100 mb-5'>
                        <h3 className='font-bold text-slate-800 text-base sm:text-lg'>
                            Order Summary
                        </h3>
                    </div>

                    <div className='flex flex-col gap-3.5'>
                        <div className='flex justify-between items-center text-xs sm:text-sm font-medium'>
                            <p className='text-slate-400'>
                                Subtotal
                            </p>

                            <span className='text-slate-700 font-semibold'>
                                ₹{subtotal}
                            </span>
                        </div>

                        <div className='flex justify-between items-center text-xs sm:text-sm font-medium'>
                            <p className='text-slate-400'>
                                Shipping
                            </p>

                            <span className='text-emerald-500 font-semibold'>
                                {shipping == 0 ? "Free" : shipping}
                            </span>
                        </div>


                        <div className='flex justify-between items-center text-xs sm:text-sm font-medium pb-4 border-b border-slate-100'>
                            <p className='text-slate-400'>
                                Estimated Tax
                            </p>

                            <span className='text-slate-700 font-semibold'>
                                ₹{tax}
                            </span>
                        </div>


                        <div className='flex justify-between items-center py-2 mt-1'>
                            <h3 className='text-slate-800 font-bold text-sm sm:text-base'>
                                Total Amount
                            </h3>

                            <span className='font-bold text-xl text-amber-500'>
                                ₹{total.toFixed(2)}
                            </span>
                        </div>
                        <Link to={'/checkout'} className='mt-5 w-full text-center bg-blue-600 text-white cursor-pointer hover:bg-blue-700 py-1.5 font-bold rounded'>Proceed to checkout</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart