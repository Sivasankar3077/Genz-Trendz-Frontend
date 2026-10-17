import React, { useEffect, useState } from 'react'
import Pagetitle from '../components/Pagetitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../slices/productSlice'
import Loader from '../components/Loader'
import LatestProducts from '../components/LatestProducts'
import Pagination from '../components/Pagination'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {removeMessage , removeError, addtoCart} from '../slices/cartSlice'

const Products = () => {

    const {products,productCount,loading,error  ,resultPerPage} = useSelector((state)=> state.product)

    const { message : cartMessage , error :cartError } = useSelector(state => state.cart)
    const dispatch  = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (cartMessage) {
            toast.success(cartMessage, {
                position: 'top-center',
                duration: 2000
            })
            dispatch(removeMessage())
        }

        if (cartError) {
            toast.error(cartError, {
                position: 'top-center',
                duration: 2000
            })
            dispatch(removeError())
        }
    }, [cartMessage, cartError, dispatch])

    const [searchParams] = useSearchParams()
    const search = searchParams.get('search') || "";
    const category = searchParams.get('category') || '';
    const pageFromUrl = parseInt(searchParams.get('page') || 1 ,10)
    const[currentPage , setCurrentPage] = useState(pageFromUrl);
    const totalPages = Math.ceil((productCount || 0) /(resultPerPage || 10))

    const handleSetPage = (pageNo)=>{
        if(pageNo !== currentPage){
            setCurrentPage(pageNo)
            const newSearchParams = new URLSearchParams(window.location.search)
            if(pageNo == 1){
                newSearchParams.delete('page')
            }
            else{
                newSearchParams.set('page' , pageNo)
            }
            navigate(`?${newSearchParams.toString()}`)
        }
    }

    const handleCategory = (cat)=>{
        const newSearchParams = new URLSearchParams(window.location.search)
        console.log(newSearchParams.toString());
        newSearchParams.set('category' , cat)
        newSearchParams.delete('page')
        navigate(`?${newSearchParams.toString()}`)
    }

    useEffect(()=>{
        dispatch(getProducts({search , page : currentPage , category}))
    },[dispatch , search , currentPage , category])

    const handleAddtoCart = (id)=>{
        dispatch(addtoCart({id , quantity : 1 , isCartPage : false}))
    }

    const categories = ['All' , 'Footwear' , 'Electronics' , 'Clothing' , 'Stationary']

    return (
        <>
            <div className='min-h-screen flex flex-col bg-gray-50'>
                <Pagetitle title={'Products'}/>
                <Navbar/>
                <main className='grow w-full max-w-7xl mx-auto py-8 px-5 md:py-12'>
                    <div className='flex flex-col md:flex-row gap-12 items-start'>
                        {/* categories */}
                        <aside className='w-full md:w-1/4 md:sticky md:top-24 bg-white rounded-lg p-5 shadow-sm'>
                            <div>
                                <h3 className='font-semibold pb-3 text-lg border-b border-slate-100 text-blue-600'>Categories</h3>
                                <ul className='mt-3 space-y-2 text-sm text-gray-600 font-semibold'>
                                    {categories.map((cat,index)=>(
                                        <li key={index} className='cursor-pointer hover:text-blue-600 transition duration-200' onClick={()=>handleCategory(cat)}>{cat}</li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* products */}
                        <section className='w-full md:w-3/4 p-5 rounded-lg bg-white shadow-sm'>
                            {loading ? (<Loader/>) : (
                                error || products?.length ==0 || productCount == null ? <div className='flex items-center justify-center pt-5'>No such product found</div> : (
                                <div>   
                                    <div className='flex items-center justify-between mb-8'>
                                        <h3 className='text-lg text-blue-600 font-semibold '>Our products</h3>
                                        <span className='text-sm text-gray-600 font-semibold'>({products?.length} items found)</span>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                                        {products?.map((product,index)=>(
                                            <LatestProducts key={index} product={product} handleAddtoCart={handleAddtoCart}/>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className='flex mt-10 items-center justify-center'>
                                <Pagination
                                 totalPages={totalPages}
                                 currentPage = {currentPage} 
                                 handleSetPage ={handleSetPage}
                                />
                            </div>
                        </section>
                    </div>
                </main>
                <Footer/>   
            </div>
        </>
    )
    }

    export default Products
