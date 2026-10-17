import Footer from "../components/Footer"
import ImageSlider from "../components/ImageSlider"
import Navbar from "../components/Navbar"
import LatestCollections from "../components/LatestCollections"
import Pagetitle from "../components/Pagetitle"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getProducts, removeErrors } from "../slices/productSlice"
import Loader from "../components/Loader"
import toast from "react-hot-toast"

const Home = () => {

  const { products , productCount , error , loading} = useSelector((state)=> state.product)
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getProducts({search : ''}))
  } , [dispatch])

  useEffect(()=>{
    if(error){
      toast.error(error , {position :'top-right' , duration:3000})
      dispatch(removeErrors())
    }
  } , [dispatch , error])

  return ( 
    loading ? ( <Loader/> ) : (
    <>
      <Pagetitle title={'Genz Trendz'}/>
      <Navbar/>
      <ImageSlider/>
      <LatestCollections products = {products}/>
      <Footer/>
    </>
  ))
}

export default Home
