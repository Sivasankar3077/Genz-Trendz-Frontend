import StarRating from './StarRating'
import { Calendar, MessageCircle, Minus, PackageCheck, Plus, ShoppingCart } from 'lucide-react'
import Loader from './Loader'
import { discountCalculator } from '../utils/discountCalculator'
import { dateFormatter } from '../utils/dateFormatter'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addtoCart, removeError, removeMessage } from '../slices/cartSlice'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import WishlistButton from './WishlistButton'

const ProductDetail = ({product , loading , cartLoading , cartMessage , cartError , cartItems}) => {

  const [quantity , setQuantity] = useState(1)
  const dispatch = useDispatch()

  const {id} = useParams()

  const handleIncreaseQuantity = (e)=>{
    setQuantity(prev => prev + 1)
  }

  const handleDecreaseQuantity = (e)=>{
    setQuantity((prev)=> prev == 1 ? prev : prev-1)
  }

  const hanleAddtoCart = ()=>{
    dispatch(addtoCart({id , quantity , isCartPage : false}))
  }

  useEffect(()=>{
    if(cartError){
      toast.error(cartError , {position : 'top-center' , duration :3000})
      dispatch(removeError())
    }

    if(cartMessage){
      toast.success(cartMessage , {position : 'top-center ' , duration :3000})
      dispatch(removeMessage())
    }
  }, [dispatch , cartError , cartMessage])

  return (
    loading ? ( <Loader/>) : (
    <>
      <main className='bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4 py-8 md:py-12 '>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-xl'>
            {/* image container */}
            <div>
              <img src={product?.image?.url} alt={product?.name}
              className='aspect-square overflow-hidden rounded-xl object-cover h-90 w-90 md:mx-auto'
              />
            </div>


            {/* product details */}
            <div className='flex flex-col'>
                <div className='mb-3 flex items-start justify-between gap-4'>
                  <h3 className='text-3xl font-semibold text-blue-900'>{product?.name}</h3>
                  {product?._id && <WishlistButton productId={product._id} showLabel className='shrink-0' />}
                </div>

                <div className='flex gap-2 items-center mb-4'>
                  <StarRating value={product?.rating} disabled={true}/>
                  <span className='text-xs font-semibold text-gray-500 '>({product?.noOfReviews} reviews)</span>
                </div>

                <div className='flex gap-3 items-baseline'>
                  <p className='text-blue-900 font-semibold text-3xl'>₹{product?.price}</p>
                  <p className='text-gray-400 font-medium line-through'>₹{product?.mrp}</p>
                  <span className='text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded'>{discountCalculator(product?.price , product?.mrp)}% OFF</span>
                </div>

                <div className='mt-5 text-md text-gray-700 leading-relaxed'>
                  {product?.description}
                </div>

                <div className='mt-3'>
                  {product?.stock > 0 ? (
                      <div className='flex gap-3 items-center text-sm font-medium text-green-700 pt-2'>
                        <PackageCheck size={18}/>
                        <span>IN STOCK ({product?.stock} Available)</span>
                      </div>
                    ): (
                      <div className='flex gap-3 items-center text-sm font-medium text-red-700 pt-2'>
                        <PackageCheck size={18}/>
                        <span>Currently out of stock</span>
                      </div>
                    )
                  }
                  
                </div>

                <div className='flex gap-4 mt-6'>
                  <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                    <button className='px-4 py-2 cursor-pointer hover:bg-gray-50 hover:text-amber-500 font-semibold transition-colors duration-200' onClick={() => handleDecreaseQuantity()}>
                      <Minus size={18}/>
                    </button>
                    <span className='w-10 text-center font-bold text-gray-700'>{quantity}</span>
                    <button className='px-4 py-2 cursor-pointer hover:bg-gray-50 hover:text-amber-700 font-semibold transition-colors duration-200' onClick={() => handleIncreaseQuantity()}>
                      <Plus size={18}/>
                    </button>
                  </div>

                  <button 
                  
                  onClick={hanleAddtoCart}

                  disabled ={!product?.stock || product?.stock <= 0} 
                  
                  className={`flex-1 flex items-center justify-center gap-2 text-white font-bold py-3 rounded transition duration-200 
                    ${!product?.stock || product?.stock<=0 ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'cursor-pointer bg-blue-600 hover:bg-blue-700'}
                  `}>

                    {cartLoading ? "Adding..." : <><ShoppingCart size={18}/> Add to cart</>}
                  </button>
                </div>

                
                  <form className='bg-slate-50 p-6 mt-8 rounded-xl shadow-sm'>
                    <div>
                      <div>
                        <h3 className='flex items-center gap-2 mb-3 font-semibold uppercase text-gray-800'>
                          <MessageCircle  size={18} />
                          Share your feedback
                        </h3>
                      </div>

                      <div>
                        <StarRating value={0} disabled= {false} />
                      </div>

                      <textarea className='border border-slate-50 my-5 w-full rounded-xl p-6 outline-none focus:border-amber-300 shadow-sm text-sm transition-all duration-200' placeholder='Share your thoughts about product...'></textarea>

                      <div>
                        <button className='bg-slate-800 text-white w-full py-2 rounded-2xl shadow-md font-semibold cursor-pointer hover:bg-slate-900 transition-all '>Post Review</button>
                      </div>
                    </div>
                  </form>
            </div>
          </div>
        </div>


        {/* reviews section */}
        <section className='my-8 max-w-6xl mx-auto px-5'>
          
          <div>
            <h3 className='border-l-4 border-amber-500 ps-3 font-medium text-lg mb-5'>Customer Reviews</h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-2'>
            {product?.reviews.map((review,index) => (
              <div className=' p-4 rounded-2xl border border-amber-300 shadow-md  shadow-amber-50' key={index}>
                
                <div className='flex  gap-5 justify-between'>

                  <div className='flex gap-3 md:gap-4'>
                    <div className='h-15 w-15 rounded-full object-cover overflow-hidden border border-amber-400 shadow-md shadow-amber-50'>
                      <img src={review.avatar} alt={review.username}
                      />
                    </div>

                    <div className=''>
                      <h3 className='text-amber-600 font-medium mb-1'>{review.username}</h3>
                      <StarRating value ={review.rating} disabled={true} />
                    </div>
                  </div>


                  <div>
                    <p className='flex gap-2 text-xs items-center font-semibold text-gray-700 bg-gray-50 px-2 py-1.5 rounded-full shadow-xs'>
                      <Calendar size={12}/>
                      {dateFormatter(review.createdAt)}
                    </p>
                  </div>

                </div>

                <div className='mt-3'>
                  <p className='italic text-gray-600 font-medium text-sm  leading-relaxed'>"{review.comment}"</p>
                </div>

              </div>
            ))}

          </div>

        </section>
      </main>
    </>
  ))
}

export default ProductDetail
