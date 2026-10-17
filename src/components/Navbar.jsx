import {Heart, LayoutDashboard, LogOut, Menu, Search, ShoppingBag, ShoppingCart, User, X} from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../slices/userSlice'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [isOpen ,setIsOpen] = useState(false)
    const {isAuthenticated , user} = useSelector(state => state.user)
    const [searchQuery ,setSearchQuery] = useState('')
    const navigate = useNavigate();
    const {loading , error , message} = useSelector(state => state.user)
    const dispatch = useDispatch()
    const {cartItems} = useSelector(state => state.cart)
    const {items: wishlistItems} = useSelector(state => state.wishlist)

    const [profileDropDown , setProfileDropDown] = useState(false)

    const handleSearchProducts = (e)=>{
        e.preventDefault();
        if(searchQuery.trim()){
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
        }
        else{
            navigate('/products')
        }
        setSearchQuery('')
    }

    const handleLogout = ()=>{
        dispatch(logoutUser())

        if(error){
            toast.error(error , {position:'top-center',duration : 3000})
        }
        if(message){
            toast.success(message , {position:'top-center',duration : 3000})
        }

        navigate('/')
    }
    
  return (
    <>
      <nav className='sticky top-0 shadow-md w-full bg-white z-50'>

        <div className='max-w-6xl mx-auto flex justify-between px-5 h-16 items-center'>

            {/* left */}
            <Link to='/' className="text-md lg:text-xl logo flex items-center gap-2 font-bold text-blue-600">
                <ShoppingBag />
                <span>Genz Trendz</span>
            </Link>


            {/* middle */}
            <div className="nav-links hidden md:flex items-center gap-5 lg:gap-8 font-medium">
                <Link to='/' className='text-gray-500 hover:text-blue-600 font-semibold'>Home</Link>
                <Link to='/about' className='text-gray-500 hover:text-blue-600 font-semibold'>About</Link>
                <Link to='/products' className='text-gray-500 hover:text-blue-600 font-semibold'>Products</Link>
                <Link to={'/contact'} className='text-gray-500 hover:text-blue-600 font-semibold'>Contact</Link>
            </div>


            {/* right */}
            <div className="right-side flex items-center gap-4 lg:gap-7">

                {/* search products */}
                <form action="" className='hidden sm:flex items:center border border-slate-300 rounded' onSubmit={handleSearchProducts}>
                    <input type="text" placeholder='search products' className='px-3 py-2 text-sm w-40 focus:outline-0'
                        value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
                    />
                    <button type='submit' className='px-3 text-gray-500 hover:text-blue-600 transition cursor-pointer'>
                        <Search size={18}/>
                    </button>
                </form>

                {/* wishlist icon */}
                {isAuthenticated && <div className="relative">
                    <Link to='/wishlist' aria-label='My wishlist'>
                        <Heart size={19} className='text-gray-500 transition hover:text-rose-500' />
                    </Link>
                    {wishlistItems.length > 0 && <span className='absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white'>{wishlistItems.length}</span>}
                </div>}

                {/* cart icon */}
                <div className="cart relative">
                    <Link to={'/cart'}>
                        <ShoppingCart size={18} className='text-gray-500 hover:text-blue-600 transition cursor-pointer'/>
                    </Link>

                    <span className={`absolute -top-2 -right-2 text-xs font-semibold bg-blue-600 h-4 w-4 rounded-full flex items-center justify-center text-white ${cartItems.length === 0 ? "hidden" : 'absolute'}`}>{cartItems.length}</span>
                </div>

                {/* register btn */}
                {!isAuthenticated ? ( 
                <div className="register-btn hidden md:flex items-center gap-5">
                    <Link to={'/login'} className='font-medium'>
                        Login
                    </Link>

                    <Link to='/signup' className='flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'>
                        <User size={18}/>
                        Register
                    </Link>
                </div> ) : (

                
                // profile
                <div className='relative'
                    onMouseEnter={()=>setProfileDropDown(true)}
                     onMouseLeave={()=> setProfileDropDown(false)}>
                    <button className='cursor-pointer'>
                        <img src={user?.avatar?.url} alt={user?.username} className='h-10 w-10 rounded-full object-cover' />
                    </button>

                    {profileDropDown && 

                        <div className='absolute right-0 z-50 bg-gray-50 shadow-md pt-4 rounded'>
                            <div>
                                <p className='font-medium px-5 text-blue-600 text-lg'>{user?.username || "User"}</p>
                                <p className='text-gray-600 px-5 text-sm mb-3'>{user?.email || "useremail"}</p>
                                
                                <div className='flex flex-col gap-2 text-sm mb-3 font-medium text-gray-600'>
                                    <Link to={'/profile'} className='hover:bg-gray-200 transition px-5 py-2' onClick={()=>setProfileDropDown(false)}>
                                        My Profile
                                    </Link>
                                    <Link to={'/myorders'} className='hover:bg-gray-200 transition px-5 py-2' onClick={()=>setProfileDropDown(false)}>
                                        My Orders
                                    </Link>
                                    <Link to={'/wishlist'} className='flex items-center gap-2 hover:bg-gray-200 transition px-5 py-2' onClick={()=>setProfileDropDown(false)}>
                                        <Heart size={15} /> My Wishlist
                                    </Link>

                                    {/* Admin Panel */} 
                                    {user?.role === "admin" && ( 
                                        <Link to={'/admin'} className='flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition px-5 py-2' onClick={() => setProfileDropDown(false)} > <LayoutDashboard size={16} />         
                                            Admin Panel
                                        </Link> 
                                    )}
                                </div>

                                <div className='flex border-t border-slate-100'>
                                    <button className='hover:bg-gray-200 text-red-400 font-medium transition px-5 py-3 flex items-center gap-3 w-full' onClick={()=>{
                                        handleLogout()
                                        setProfileDropDown(false)
                                    }}
                                    >
                                        Logout <LogOut size={18}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    }
                </div>
                )
                }


                {/* handBurg */}
                <button className='md:hidden text-gray-600 hover:text-blue-600 transition cursor-pointer'
                onClick={()=>setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={18}/> : <Menu size={18}/>}
                </button>
            </div>
        </div>

        <div className="mobile-menu">
            <div className={`md:hidden flex flex-col px-4 gap-4 transition-all ease-in-out duration-400 ${isOpen ? "max-h-96 translate-y-0 opacity-100 py-5" : "max-h-0 -translate-y-96 opacity-0"}`}>
                <Link onClick={()=>setIsOpen(false)} to='/' className='text-gray-500 hover:text-blue-600 font-semibold'>Home</Link>
                <Link onClick={()=>setIsOpen(false)} to='/about' className='text-gray-500 hover:text-blue-600 font-semibold'>About</Link>
                <Link onClick={()=>setIsOpen(false)} to='/products' className='text-gray-500 hover:text-blue-600 font-semibold'>Products</Link>
                <Link onClick={()=>setIsOpen(false)} to='/contact' className='text-gray-500 hover:text-blue-600 font-semibold'>Contact</Link>

                {!isAuthenticated && 
                <div className="register-btn">
                    <Link to='/signup' className='flex gap-2 items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition'>
                        <User size={18}/>
                        Register
                    </Link>
                </div>
                }
            </div>
        </div>  
      </nav>
    </>
  )
}

export default Navbar
