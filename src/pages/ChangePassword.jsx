import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { removeErrors, removeMessage, removeSuccess, updatePassword } from "../slices/userSlice"

const ChangePassword = () => {

  const { loading , message , error , updatedUser , isAuthenticated} = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    if(error){
        toast.error(error , {position : 'top-center' , duration:3000})
        dispatch(removeErrors())
    }
  }, [dispatch , error])

  useEffect(()=>{
    if(message){
        toast.success(message , {position : 'top-center' , duration:3000})
        navigate('/profile')
        dispatch(removeMessage())
    }
  }, [dispatch , message])

  //new pass data
  const [newPass, setNewPass] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // eye-toggle
  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const { oldPassword, newPassword, confirmPassword } = newPass;

  const handleChange = (e) => {
    setNewPass({ ...newPass, [e.target.name]: e.target.value })
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    dispatch(updatePassword(newPass))
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="shadow-md rounded-lg border border-slate-100 bg-white w-80 sm:w-90 p-8">
        <div className="mb-12 text-center">
            <h3 className="font-medium text-blue-600 text-xl">Change Password</h3>
        </div>

        <div className='flex flex-col gap-5'>
            {/* Old Password */}
            <div className="font-medium text-gray-500">
                <label htmlFor="oldPassword">Old Password</label>
                <div className='relative mt-2'>
                    <input 
                      type={showOldPass ? 'text' : "password"}
                      className='w-full border border-gray-300 px-5 py-2 rounded focus:outline-blue-500'
                      name='oldPassword' 
                      value={oldPassword} 
                      onChange={handleChange}
                    />
                    <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={() => setShowOldPass(!showOldPass)}>
                        {showOldPass ? <Eye size={18}/> : <EyeOff size={18}/>}
                    </div>
                </div>
            </div>

            {/* New Password */}
            <div className="font-medium text-gray-500">
                <label htmlFor="newPassword">New Password</label>
                <div className='relative mt-2'>
                    <input 
                      type={showNewPass ? 'text' : "password"}
                      className='w-full border border-gray-300 px-5 py-2 rounded focus:outline-blue-500'
                      name='newPassword' 
                      value={newPassword} 
                      onChange={handleChange}
                    />
                    <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={() => setShowNewPass(!showNewPass)}>
                        {showNewPass ? <Eye size={18}/> : <EyeOff size={18}/>}
                    </div>
                </div>
            </div>

            {/* Confirm New Password */}
            <div className="font-medium text-gray-500">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <div className='relative mt-2'>
                    <input 
                      type={showConfirmPass ? 'text' : "password"}
                      className='w-full border border-gray-300 px-5 py-2 rounded focus:outline-blue-500'
                      name='confirmPassword' 
                      value={confirmPassword} 
                      onChange={handleChange}
                    />
                    <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                        {showConfirmPass ? <Eye size={18}/> : <EyeOff size={18}/>}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-5 bg-blue-600 text-white text-center py-1.5 rounded hover:bg-blue-700 cursor-pointer transition duration-200">
            <button onClick={handleUpdatePassword} className="w-full h-full font-semibold cursor-pointer">Change Password</button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
