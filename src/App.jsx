import {Routes,Route} from 'react-router-dom'
import Home from "./pages/Home.jsx"
import About from './pages/About.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadUser } from './slices/userSlice.js'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Cart from './pages/Cart.jsx'
import ProtectedRoute from './components/ProtectedRoutes.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminLayout from './Layout/AdminLayout.jsx'
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import EditProduct from './components/admin/EditProduct.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Loader from './components/Loader.jsx'
import Checkout from './pages/Checkout.jsx'
import MyOrders from './pages/Myorders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import Wishlist from './pages/Wishlist.jsx'
import { getWishlist, resetWishlist } from './slices/wishlistSlice.js'

const App = () => {

  const {isAuthenticated , user , loading} = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(loadUser())
  },[dispatch])

  useEffect(() => {
    if (isAuthenticated) dispatch(getWishlist())
    else dispatch(resetWishlist())
  }, [dispatch, isAuthenticated])

  if(loading){
    return(
      <><Loader/></>
    )
  }

  return (
    <>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/products/:id' element={<ProductDetails/>} />
        <Route path='/about' element ={<About/>} />
        <Route path='/products' element={<Products/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/login/forgotPassword' element={<ForgotPassword/>} />
        <Route path='/reset/:resetToken' element={<ResetPassword/>} />

        {/* protected routes */}
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path='/profile/edit' element={<ProtectedRoute><EditProfile/></ProtectedRoute>} />
        <Route path='/profile/changePass' element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />
        <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
        <Route path='/myorders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
        <Route path='/myorders/:id' element={<ProtectedRoute><OrderDetails/></ProtectedRoute>} />

        {/* admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>} >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path='edit/product/:id' element={<EditProduct/>} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}


export default App
