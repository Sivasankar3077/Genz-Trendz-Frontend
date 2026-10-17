import Pagetitle from '../components/Pagetitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductDetail from '../components/ProductDetail'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getProductDetails} from '../slices/productSlice'
import Loader from '../components/Loader'
const ProductDetails = () => {

  const {id} = useParams();
  const {product , loading , error} = useSelector((state)=> state.product)
  const {loading:cartLoading , error:cartError , message:cartMessage , cartItems} = useSelector(state => state.cart)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getProductDetails(id))
  }, [dispatch])

  useEffect(()=>{
    if(error){
      toast.error(error.message)
      dispatch(removeErrors())
    }
  } , [dispatch , error])

  return (
    <>
        <Pagetitle title={`${product?.name} || product details`}/>
        <Navbar/>
        <ProductDetail product = {product} loading={loading} cartLoading={cartLoading} 
        cartMessage={cartMessage}
        cartError = {cartError}
        cartItems = {cartItems}
        />
        <Footer/>
    </>
  )
}

export default ProductDetails
