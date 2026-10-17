import { Eye, EyeOff , Lock, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, removeErrors, removeSuccess } from '../slices/userSlice'


const Login = () => {

  const [showpass , setShowpass] = useState(false)
  const {loading , error , success} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [user , setUser] = useState({
     email : '',
     password : ''
  })

  const {email , password} = user;

  useEffect(()=>{
    if(error){
      toast.error(error , {position : "top-center" , duration:3000})
      dispatch(removeErrors())
    }
  } , [dispatch , error])


  useEffect(()=>{
    if(success){
      toast.success(success , {position : "top-center" , duration:3000})
      dispatch(removeSuccess())
      navigate('/')
    }
  } , [dispatch , success])


  const handleChange = (e)=>{
    setUser({...user, [e.target.name] : e.target.value})
  }

  const handleLogin = (e)=>{
    e.preventDefault()
    const myForm = new FormData()
    myForm.set('email' , email)
    myForm.set('password' , password)
    dispatch(loginUser(myForm))
  }

  return (
    <div className='flex min-h-screen justify-center items-center'>
        <div className='px-12 py-8 border-gray-300 shadow-md'>
          <div className='flex flex-col justify-center items-center mb-8'>
            <h3 className='text-4xl text-blue-600 font-semibold px-25'>Login</h3>
            <span className='text-xs text-gray-400 mt-2'>Login to explore</span>
          </div>

          <form encType='multipart/form-data' onSubmit={handleLogin}>

            {/* username */}
            <div className='flex flex-col gap-2'>
              <label htmlFor="email" className='font-medium text-lg'>Email</label>
              <div className='relative'>
                <input type="email" placeholder='hello@example.com'
                  className='w-full border border-gray-400 ps-10 pe-5 py-2 rounded focus:outline-blue-500'
                  name='email' value={email} onChange={handleChange}
                />
                <Mail size={18} className='absolute top-3 left-3.5 text-gray-500'/>
              </div>
            </div>

            {/* pass */}
            <div className='flex flex-col gap-2 mt-5'>
              <label htmlFor="password" className='font-medium'>Password</label>
              <div className='relative'>
                <input type={showpass ? 'text' : "password"} placeholder='abc@#/s123'
                  className='w-full border border-gray-400 ps-10 pe-5 py-2 rounded focus:outline-blue-500'
                  name='password' value={password} onChange={handleChange}
                />
                <Lock size={18} className='absolute top-3 left-3.5 text-gray-500'/>
                <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={()=>setShowpass(!showpass)}>
                    {showpass ? <Eye size={18}/> : <EyeOff size={18}/>}
                </div>
              </div>
            </div>

            <div className='mt-3 flex justify-end text-sm text-blue-600 font-medium'>
              <Link to={'/login/forgotpassword'}>forgot password?</Link>
            </div>

            <div className='flex flex-col gap-2'>
              <button className='mt-5 bg-indigo-600 py-2 rounded-lg text-white hover:bg-indigo-700 transition duration-200 cursor-pointer'>Login</button>
              <span className='text-sm text-center text-slate-700 font-medium'>
                New here? 
                <Link to={'/signup'} className='ms-1 text-blue-600 underline'>Signup</Link>
              </span>
            </div>
          </form>
        </div>
    </div>
  )
}

export default Login
