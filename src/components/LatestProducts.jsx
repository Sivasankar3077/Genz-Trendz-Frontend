import StarRating from "./StarRating"
import { useState } from "react"
import { Link } from "react-router-dom"
import WishlistButton from './WishlistButton'

const LatestProducts = ({product , handleAddtoCart}) => {
  const [rating , setRating] = useState(product.rating || 0)

  return (
    <>
      <div className="product bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-slate-100 ">
        <div className="relative">
          <Link to={`/products/${product._id}`} className="product-image block">
              <img src={product?.image?.url} alt={product?.name} className="h-48 w-full md:h-40 overflow-hidden object-cover group-hover:scale-x-105" loading="lazy"/>
          </Link>
          <WishlistButton productId={product._id} className="absolute right-3 top-3" />
        </div>
        <div className="product-body px-4 pt-3 pb-5">
            <div className="product-name text-gray-900 font-bold line-clamp-1">{product.name}</div>
            <div className="rating flex items-center py-2">
                <StarRating value={rating} disabled = {true} onRatingChange={(r)=>setRating(r)}/>
                <span className="ms-2 text-gray-500 text-xs font-semibold">({product.reviews.length} reviews)</span>
            </div>

            <div className="price-addtoCart flex justify-between items-center mt-2">
                <span className="text-blue-600 font-semibold text-lg">₹{product.price}</span>
                
                <button onClick={()=>handleAddtoCart(product._id)} className="text-white bg-blue-600 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center hover:bg-blue-700 transition duration-200">Add to cart</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default LatestProducts
