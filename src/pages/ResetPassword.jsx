import { Eye, EyeOff } from "lucide-react"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { removeErrors, removeMessage, resetPassword } from "../slices/userSlice"
import toast from "react-hot-toast"

const ResetPassword = () => {
    const [newPass , setNewPass] = useState('')
    const [confirmNewPass , setConfirmNewPass] = useState('')

    const {resetToken} = useParams()
    
    const { loading , error , message } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const[showNewPass , setShowNewPass ] = useState(false)
    const [showConfirmNewPass , setShowConfirmNewPass ] = useState(false)

    useEffect(()=>{
        if(error){
            toast.error(error,{position : 'top-center' , duration:2000})
            dispatch(removeErrors())
        }

        if(message){
            toast.success(message , {position : 'top-center' , duration : 2000})
            dispatch(removeMessage())
            navigate('/login')
        }
    } , [dispatch , error, message])

    const handleReset = ()=>{

        if (!newPass || !confirmNewPass) {
            toast.error("Please fill all fields", { position: 'top-center' });
            return;
        }

        if(newPass !== confirmNewPass){
            toast.error("Password doesnot match Confirm Password" , {position : 'top-center' , duration : 2000})
            return
        }

        const resetData = {
            newPassword : newPass,
            confirmNewPassword : confirmNewPass
        }

        dispatch(resetPassword({resetToken , resetData}))
    }

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar/>

      <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
        <div className="shadow-md rounded-lg border border-slate-100 bg-white w-full max-w-sm p-8">
            <div className="mb-8">
                <h3 className="text-blue-600 text-xl font-medium text-center">Reset Password</h3>
            </div>

            <div>

                {/* new pass */}
                <div className="mb-5">
                    <div className="font-medium text-gray-500">
                    <label htmlFor="oldPassword">New Password</label>
                    <div className='relative mt-2'>
                        <input 
                        type={showNewPass ? 'text' : "password"}
                        className='w-full border border-gray-300 px-5 py-2 rounded focus:outline-blue-500'
                        name='' 
                        value={newPass} 
                        onChange={(e)=>setNewPass(e.target.value)}
                        />
                        <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={() => setShowNewPass(!showNewPass)}>
                            {showNewPass ? <Eye size={18}/> : <EyeOff size={18}/>}
                        </div>
                    </div>
                </div>
                </div>


                {/* confirm new Pass */}
                <div>
                    <div className="font-medium text-gray-500">
                    <label htmlFor="oldPassword">Confirm New Password</label>
                    <div className='relative mt-2'>
                        <input 
                        type={showConfirmNewPass ? 'text' : "password"}
                        className='w-full border border-gray-300 px-5 py-2 rounded focus:outline-blue-500'
                        name='' 
                        value={confirmNewPass} 
                        onChange={(e)=>setConfirmNewPass(e.target.value)}
                        />
                        <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}>
                            {showConfirmNewPass ? <Eye size={18}/> : <EyeOff size={18}/>}
                        </div>
                    </div>
                </div>
                </div>

                <button onClick={handleReset} className="bg-blue-600 py-1.5 text-white rounded hover:bg-blue-700 cursor-pointer transition duration-200 font-semibold w-full mt-5">{loading ? "Resetting password" : "Reset Password"}</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
