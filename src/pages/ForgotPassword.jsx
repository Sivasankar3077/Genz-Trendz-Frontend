import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { forgotPassword, removeErrors, removeMessage } from "../slices/userSlice"
import Navbar from "../components/Navbar"
import toast from "react-hot-toast"

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const {loading , error ,  message} = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(error){
            toast.error(error , {position : 'top-center' , duration : 2000})
            dispatch(removeErrors())
        }
        if(message){
            toast.success(message , {position : 'top-center' , duration : 2000})
            dispatch(removeMessage())
        }
    }, [dispatch , error , message])

    const handleForgotPass = () => {
        dispatch(forgotPassword({email}))
    }

  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar/>

        <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
            <div className="shadow-md rounded-lg border border-slate-100 bg-white w-full max-w-sm p-8">
                <div className="mb-8">
                    <h3 className="text-blue-600 text-xl font-medium text-center">Forgot Password</h3>
                </div>

                <div className="flex flex-col gap-5">
                    <input 
                        type="email" 
                        placeholder="Enter email"
                        className="border border-gray-200 rounded px-5 py-2 focus:outline-blue-600"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                        onClick={handleForgotPass} 
                        className="bg-blue-600 py-1.5 text-white rounded hover:bg-blue-700 cursor-pointer transition duration-200 font-semibold"
                    >
                        {loading ? "Loading" : 'Send reset link'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword
